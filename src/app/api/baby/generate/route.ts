import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// R2 configuration - Baby Generator specific (hardcoded to distinguish from env vars)
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = 'flux-original'; // Baby Generator specific bucket
const R2_PUBLIC_HOSTNAME = 'pub-7d236ebab03f49ddb1f51cb5feb00790.r2.dev'; // Baby Generator specific hostname

// N8N Request Body Interface
interface N8nBabyRequestBody {
  fatherImageUrl: string;
  motherImageUrl: string;
  gender: string;
  jobId: string;
  userId: string;
}

// Helper function to upload file to R2
async function uploadToR2(file: File, userId: string, fileTypeIdentifier: string): Promise<string> {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error('[Baby Generate API - R2 Upload] R2 credentials missing in environment variables.');
    throw new Error('Server configuration error: R2 credentials missing.');
  }

  // 清理文件名并添加唯一前缀
  const cleanedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
  const uniqueFileName = `user_${userId}/${fileTypeIdentifier}_${Date.now()}_${cleanedFileName}`.toLowerCase();

  // Create S3 client for R2
  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Return public URL using hardcoded Baby Generator hostname
    const publicUrl = `https://${R2_PUBLIC_HOSTNAME}/${uniqueFileName}`;
    console.log(`[Baby Generate API - R2 Upload] File uploaded successfully to R2: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('[Baby Generate API] R2 upload error:', error);
    throw new Error(`R2 upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Baby Generate API] Starting baby generation request...');

    // 验证用户登录状态
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('[Baby Generate API] Authentication failed:', userError);
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    console.log('[Baby Generate API] User authenticated:', user.id);

    // 检查用户是否有正在处理中的任务
    const { data: existingTasks, error: checkError } = await supabase
      .from('baby_generations')
      .select('id, job_id')
      .eq('user_id', user.id)
      .eq('status', 'processing')
      .limit(1);

    if (checkError) {
      console.error('[Baby Generate API] Error checking existing tasks:', checkError);
      return NextResponse.json({ message: 'Database query failed.' }, { status: 500 });
    }

    if (existingTasks && existingTasks.length > 0) {
      console.log('[Baby Generate API] User has existing processing task:', existingTasks[0].job_id);
      return NextResponse.json({ 
        message: 'You already have a baby generation in progress. Please wait for it to complete.',
        existingJobId: existingTasks[0].job_id
      }, { status: 409 });
    }

    // 解析表单数据
    const formData = await request.formData();
    const fatherImage = formData.get('fatherImage') as File;
    const motherImage = formData.get('motherImage') as File;
    const gender = formData.get('gender') as string;

    console.log('[Baby Generate API] Form data received:', {
      fatherImageSize: fatherImage?.size,
      motherImageSize: motherImage?.size,
      gender
    });

    // 验证必需字段
    if (!fatherImage || !motherImage || !gender) {
      return NextResponse.json({ message: 'Missing required fields: fatherImage, motherImage, gender' }, { status: 400 });
    }

    // 验证性别值
    if (!['boy', 'girl'].includes(gender)) {
      return NextResponse.json({ message: 'Invalid gender. Must be "boy" or "girl".' }, { status: 400 });
    }

    // 生成唯一的jobId
    const jobId = uuidv4();
    console.log('[Baby Generate API] Generated jobId:', jobId);

    // 上传图片到R2
    console.log('[Baby Generate API] Uploading images to R2...');

    let fatherImageUrl: string;
    let motherImageUrl: string;

    try {
      fatherImageUrl = await uploadToR2(fatherImage, user.id, 'baby_father');
      motherImageUrl = await uploadToR2(motherImage, user.id, 'baby_mother');
      console.log('[Baby Generate API] Images uploaded successfully:', { fatherImageUrl, motherImageUrl });
    } catch (uploadError) {
      console.error('[Baby Generate API] R2 upload failed:', uploadError);
      return NextResponse.json({ message: 'Failed to upload images to storage.' }, { status: 500 });
    }

    // 创建baby_generations记录并扣除积分
    const creditsToDeduct = 3;
    try {
      const { data: newBabyGeneration, error: dbError } = await supabase
        .from('baby_generations')
        .insert({
          user_id: user.id,
          job_id: jobId,
          father_image_url: fatherImageUrl,
          mother_image_url: motherImageUrl,
          baby_gender: gender,
          status: 'processing',
          credits_used: creditsToDeduct
        })
        .select()
        .single();

      if (dbError) {
        console.error('[Baby Generate API] Database insertion failed:', dbError);
        return NextResponse.json({ message: 'Database operation failed.' }, { status: 500 });
      }

      // 扣除用户积分
      const { error: creditError } = await supabase.rpc('deduct_credits', {
        p_user_id: user.id,
        p_credits_to_deduct: creditsToDeduct
      });

      if (creditError) {
        console.error('[Baby Generate API] Credit deduction failed:', creditError);
        // 如果积分扣除失败，删除刚创建的记录
        await supabase
          .from('baby_generations')
          .delete()
          .eq('job_id', jobId);
        
        return NextResponse.json({ message: 'Insufficient credits or credit deduction failed.' }, { status: 402 });
      }

      console.log('[Baby Generate API] Database record created and credits deducted successfully');

    } catch (dbOperationError) {
      console.error('[Baby Generate API] Database operation error:', dbOperationError);
      return NextResponse.json({ message: 'Database operation failed.' }, { status: 500 });
    }

    // 检查N8N配置 - Baby Generator specific
    const n8nApiKey = process.env.N8N_API_KEY?.trim();
    const n8nWebhookUrl = (process.env.N8N_BABY_GENERATION_WEBHOOK_URL?.trim()) || 'https://n8n-avskrukq.us-east-1.clawcloudrun.com/webhook/8f637ae5-7aff-410f-8de3-a9910cfc1ad9'; // Baby Generator specific N8N Webhook URL with fallback (production)

    console.log('[Baby Generate API] Checking N8N configuration...');
    console.log('[Baby Generate API] N8N API Key exists:', !!n8nApiKey);
    console.log('[Baby Generate API] N8N Baby Webhook URL:', n8nWebhookUrl);
    console.log('[Baby Generate API] Environment:', process.env.NODE_ENV);
    console.log('[Baby Generate API] Request headers will include:', headersForN8n);

    // Webhook URL现在是硬编码的，所以不需要检查是否存在

    // 准备发送到N8N的数据
    const requestBodyToN8n: N8nBabyRequestBody = {
      fatherImageUrl,
      motherImageUrl,
      gender,
      jobId,
      userId: user.id
    };

    console.log('[Baby Generate API] Sending request to N8N:', requestBodyToN8n);

    // 发送请求到N8N
    const headersForN8n: HeadersInit = { 'Content-Type': 'application/json' };
    if (n8nApiKey) {
        headersForN8n['N8N_API_KEY'] = n8nApiKey;
    }

    try {
      // 添加超时控制，适应Vercel环境
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时

      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: headersForN8n,
        body: JSON.stringify(requestBodyToN8n),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let responseData;
      try {
        responseData = await n8nResponse.json();
      } catch (jsonError) {
        // 如果响应不是JSON格式，尝试获取文本内容
        const responseText = await n8nResponse.text();
        console.error('[Baby Generate API] N8N response is not JSON:', responseText);
        responseData = { message: 'Invalid response format', responseText };
      }

      console.log(`[Baby Generate API] N8N response status: ${n8nResponse.status}`);
      console.log('[Baby Generate API] N8N response data:', responseData);

      if (!n8nResponse.ok) {
        const errorMessage = `N8N request failed with status ${n8nResponse.status}: ${responseData?.message || 'Unknown error'}`;
        console.error('[Baby Generate API] N8N request failed:', errorMessage);

        // 更新数据库记录为失败状态
        await supabase
          .from('baby_generations')
          .update({ 
            status: 'failed', 
            error_message: errorMessage,
            completed_at: new Date().toISOString()
          })
          .eq('job_id', jobId);

        return NextResponse.json({ 
          message: errorMessage,
          details: responseData,
          status: n8nResponse.status
        }, { status: n8nResponse.status });
      }

      console.log(`[Baby Generate API] Successfully submitted to n8n. Status: ${n8nResponse.status}. Response:`, responseData);
      return NextResponse.json({ 
        message: 'Baby generation request received and processing started.',
        status: 'processing',
        jobId,
        fatherImageUrl,
        motherImageUrl,
        gender,
        workflowData: responseData
      });

    } catch (n8nCallError: unknown) {
      const errorMessage = n8nCallError instanceof Error ? n8nCallError.message : String(n8nCallError);
      console.error('[Baby Generate API] Network error during N8N call:', errorMessage);
      
      // 更新数据库记录为失败状态
      await supabase
        .from('baby_generations')
        .update({ 
          status: 'failed', 
          error_message: `Network error: ${errorMessage}`,
          completed_at: new Date().toISOString()
        })
        .eq('job_id', jobId);

      return NextResponse.json({ 
        message: 'Failed to communicate with baby generation service.', 
        error: errorMessage 
      }, { status: 500 });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Baby Generate API] Unexpected error:', errorMessage);
    return NextResponse.json({ 
      message: 'Internal Server Error.', 
      error: errorMessage 
    }, { status: 500 });
  }
}
