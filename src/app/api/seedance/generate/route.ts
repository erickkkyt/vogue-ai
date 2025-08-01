import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// N8N 请求体接口
interface N8nSeedanceRequestBody {
  jobId: string;
  userId: string;
  generationMode: 'text-to-video' | 'image-to-video';
  selectedModel: 'seedance' | 'seedance_fast';
  textPrompt?: string;
  imageUrl?: string;
  imagePrompt?: string;
}

// 配置 R2 客户端
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const R2_BUCKET_NAME = 'flux-original';
const R2_PUBLIC_HOSTNAME = 'pub-7d236ebab03f49ddb1f51cb5feb00790.r2.dev';

export async function POST(request: Request) {
  try {
    console.log('[Seedance API] Starting seedance generation request...');

    // 验证用户登录状态
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('[Seedance API] Authentication failed:', userError);
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    console.log('[Seedance API] User authenticated:', user.id);

    // 解析请求体
    const formData = await request.formData();
    const generationMode = formData.get('generationMode') as string;
    const selectedModel = formData.get('selectedModel') as string;
    const textPrompt = formData.get('textPrompt') as string;
    const imagePrompt = formData.get('imagePrompt') as string;
    const imageFile = formData.get('imageFile') as File | null;

    console.log('[Seedance API] Request data:', {
      generationMode,
      selectedModel,
      textPrompt: textPrompt ? 'provided' : 'not provided',
      imagePrompt: imagePrompt ? 'provided' : 'not provided',
      imageFile: imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : 'not provided'
    });

    // 验证必填字段
    if (!generationMode || !selectedModel) {
      return NextResponse.json({ message: 'Missing required fields: generationMode, selectedModel' }, { status: 400 });
    }

    // 验证生成模式
    if (!['text-to-video', 'image-to-video'].includes(generationMode)) {
      return NextResponse.json({ message: 'Invalid generation mode' }, { status: 400 });
    }

    // 验证模型
    if (!['seedance', 'seedance_fast'].includes(selectedModel)) {
      return NextResponse.json({ message: 'Invalid model selection' }, { status: 400 });
    }

    // 验证模式特定的字段
    if (generationMode === 'text-to-video' && !textPrompt?.trim()) {
      return NextResponse.json({ message: 'Text prompt is required for text-to-video mode' }, { status: 400 });
    }

    if (generationMode === 'image-to-video') {
      if (!imageFile) {
        return NextResponse.json({ message: 'Image file is required for image-to-video mode' }, { status: 400 });
      }
      if (!imagePrompt?.trim()) {
        return NextResponse.json({ message: 'Image prompt is required for image-to-video mode' }, { status: 400 });
      }
    }

    // 检查 seedance_fast 模型限制
    if (generationMode === 'image-to-video' && selectedModel === 'seedance_fast') {
      return NextResponse.json({ 
        message: 'seedance_fast model only supports text-to-video mode' 
      }, { status: 400 });
    }

    let imageUrl: string | null = null;

    // 处理图片上传（如果是 image-to-video 模式）
    if (generationMode === 'image-to-video' && imageFile) {
      try {
        console.log('[Seedance API] Uploading image to R2...');
        
        const fileExtension = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `seedance/${user.id}/${Date.now()}.${fileExtension}`;
        
        const uploadCommand = new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: fileName,
          Body: Buffer.from(await imageFile.arrayBuffer()),
          ContentType: imageFile.type,
        });

        await r2Client.send(uploadCommand);
        imageUrl = `https://${R2_PUBLIC_HOSTNAME}/${fileName}`;
        
        console.log('[Seedance API] Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.error('[Seedance API] Image upload failed:', uploadError);
        return NextResponse.json({ message: 'Failed to upload image' }, { status: 500 });
      }
    }

    // 生成唯一的jobId
    const jobId = uuidv4();
    console.log('[Seedance API] Generated jobId:', jobId);

    // 调用 RPC 创建项目并扣除积分
    const rpcParams = {
      p_user_id: user.id,
      p_job_id: jobId,
      p_generation_mode: generationMode,
      p_selected_model: selectedModel,
      p_text_prompt: textPrompt || null,
      p_image_url: imageUrl,
      p_image_prompt: imagePrompt || null
    };

    console.log('[Seedance API] Calling RPC create_seedance_project for job', jobId, 'by user', user.id);

    const { data: projectData, error: rpcError } = await supabase.rpc(
      'create_seedance_project',
      rpcParams
    );

    if (rpcError) {
      console.error('[Seedance API] RPC error:', rpcError);
      return NextResponse.json({
        message: 'Database operation failed.'
      }, { status: 500 });
    }

    if (!projectData || projectData.length === 0) {
      console.error('[Seedance API] No data returned from RPC');
      return NextResponse.json({
        message: 'Failed to create project.'
      }, { status: 500 });
    }

    const result = projectData[0];
    console.log('[Seedance API] RPC result:', result);

    // 处理各种状态
    if (result.status === 'user_not_found') {
      return NextResponse.json({
        message: 'User profile not found.'
      }, { status: 404 });
    }

    if (result.status === 'insufficient_credits') {
      return NextResponse.json({
        message: 'Insufficient credits for this generation.'
      }, { status: 402 });
    }

    if (result.status === 'concurrent_generation_exists') {
      return NextResponse.json({
        message: 'You already have a Seedance video generation in progress. Please wait for it to complete before starting a new one.'
      }, { status: 409 });
    }

    if (result.status.startsWith('database_error')) {
      console.error('[Seedance API] Database error:', result.status);
      return NextResponse.json({
        message: 'Database operation failed.'
      }, { status: 500 });
    }

    // 准备发送到N8N的数据
    const requestBodyToN8n: N8nSeedanceRequestBody = {
      jobId,
      userId: user.id,
      generationMode: generationMode as 'text-to-video' | 'image-to-video',
      selectedModel: selectedModel as 'seedance' | 'seedance_fast',
      textPrompt: textPrompt || undefined,
      imageUrl: imageUrl || undefined,
      imagePrompt: imagePrompt || undefined
    };

    console.log('[Seedance API] Sending request to N8N:', {
      ...requestBodyToN8n,
      textPrompt: requestBodyToN8n.textPrompt ? 'provided' : 'not provided',
      imageUrl: requestBodyToN8n.imageUrl ? 'provided' : 'not provided'
    });

    // 发送请求到N8N
    const n8nWebhookUrl = process.env.N8N_SEEDANCE_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      console.error('[Seedance API] N8N_SEEDANCE_WEBHOOK_URL not configured');
      return NextResponse.json({
        message: 'Video generation service not configured.'
      }, { status: 500 });
    }

    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBodyToN8n),
      });

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        console.error('[Seedance API] N8N webhook failed:', n8nResponse.status, errorText);
        
        // 更新数据库记录为失败状态
        await supabase
          .from('seedance_generations')
          .update({
            status: 'failed',
            error_message: `N8N webhook failed: ${n8nResponse.status}`,
            completed_at: new Date().toISOString()
          })
          .eq('job_id', jobId);

        return NextResponse.json({
          message: 'Failed to start video generation process.',
          error: `N8N responded with status ${n8nResponse.status}`
        }, { status: 500 });
      }

      const n8nResult = await n8nResponse.json();
      console.log('[Seedance API] N8N response:', n8nResult);

      // 返回成功响应
      return NextResponse.json({
        message: 'Seedance video generation started successfully.',
        jobId,
        creditsDeducted: result.credits_deducted,
        status: 'processing'
      }, { status: 200 });

    } catch (n8nCallError: unknown) {
      const errorMessage = n8nCallError instanceof Error ? n8nCallError.message : String(n8nCallError);
      console.error('[Seedance API] Network error during N8N call:', errorMessage);

      // 更新数据库记录为失败状态
      await supabase
        .from('seedance_generations')
        .update({
          status: 'failed',
          error_message: `Network error: ${errorMessage}`,
          completed_at: new Date().toISOString()
        })
        .eq('job_id', jobId);

      return NextResponse.json({
        message: 'Failed to communicate with video generation service.',
        error: errorMessage
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[Seedance API] Unexpected error:', error);
    return NextResponse.json({
      message: 'Internal server error.',
      error: String(error)
    }, { status: 500 });
  }
}
