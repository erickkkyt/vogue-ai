import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// N8N 请求体接口
interface N8nVeo3RequestBody {
  jobId: string;
  userId: string;
  generationMode: 'text-to-video' | 'image-to-video';
  selectedModel: 'veo3' | 'veo3-fast';
  textPrompt?: string;
  imageUrl?: string;
  imagePrompt?: string;
}

// R2 上传辅助函数
async function uploadToR2(file: File, userId: string, prefix: string): Promise<string> {
  const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const R2_BUCKET_NAME = 'flux-original';
  const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
  const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
  const R2_PUBLIC_HOSTNAME = 'pub-7d236ebab03f49ddb1f51cb5feb00790.r2.dev';

  if (!process.env.R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 configuration missing in environment variables');
  }

  // 清理文件名并添加唯一前缀
  const cleanedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
  const uniqueFileName = `user_${userId}/${prefix}_${Date.now()}_${cleanedFileName}`.toLowerCase();

  const s3Client = new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  const buffer = Buffer.from(await file.arrayBuffer());

  const putObjectParams = {
    Bucket: R2_BUCKET_NAME,
    Key: uniqueFileName,
    Body: buffer,
    ContentType: file.type,
  };

  await s3Client.send(new PutObjectCommand(putObjectParams));

  const publicUrl = `https://${R2_PUBLIC_HOSTNAME}/${uniqueFileName}`;
  console.log(`[Veo3 API] File uploaded successfully to R2: ${publicUrl}`);
  return publicUrl;
}

export async function POST(request: Request) {
  const supabaseUserClient = await createServerSupabaseClient();

  // 用户认证
  const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser();
  if (authError || !user) {
    console.warn('[Veo3 API] Authentication error or no user session:', authError?.message);
    return NextResponse.json({ message: 'Authentication required. Please log in.' }, { status: 401 });
  }
  console.log(`[Veo3 API] Authenticated User ID: ${user.id}`);

  try {
    const formData = await request.formData();

    // 提取表单数据
    const generationMode = formData.get('generationMode') as 'text-to-video' | 'image-to-video';
    const selectedModel = formData.get('selectedModel') as 'veo3' | 'veo3-fast';
    const textPrompt = formData.get('textPrompt') as string;
    const imagePrompt = formData.get('imagePrompt') as string;
    const imageFile = formData.get('imageFile') as File | null;

    // 验证必填字段
    if (!generationMode || !selectedModel) {
      return NextResponse.json({ message: 'Missing required fields: generationMode and selectedModel' }, { status: 400 });
    }

    if (!['text-to-video', 'image-to-video'].includes(generationMode)) {
      return NextResponse.json({ message: 'Invalid generationMode. Must be text-to-video or image-to-video' }, { status: 400 });
    }

    if (!['veo3', 'veo3-fast'].includes(selectedModel)) {
      return NextResponse.json({ message: 'Invalid selectedModel. Must be veo3 or veo3-fast' }, { status: 400 });
    }

    // 图片转视频模式下，veo3-fast 不支持
    if (generationMode === 'image-to-video' && selectedModel === 'veo3-fast') {
      return NextResponse.json({ message: 'veo3-fast model only supports text-to-video mode' }, { status: 400 });
    }

    if (generationMode === 'text-to-video' && !textPrompt?.trim()) {
      return NextResponse.json({ message: 'Text prompt is required for text-to-video mode' }, { status: 400 });
    }

    if (generationMode === 'image-to-video' && (!imageFile || !imagePrompt?.trim())) {
      return NextResponse.json({ message: 'Image file and image prompt are required for image-to-video mode' }, { status: 400 });
    }

    // 上传图片到 R2（如果是图片转视频模式）
    let imageUrl: string | null = null;
    if (generationMode === 'image-to-video' && imageFile) {
      try {
        console.log('[Veo3 API] Uploading image to R2...');
        imageUrl = await uploadToR2(imageFile, user.id, 'veo3_input');
      } catch (uploadError: unknown) {
        console.error('[Veo3 API] File upload to R2 failed:', uploadError instanceof Error ? uploadError.message : String(uploadError));
        return NextResponse.json({ 
          message: 'File upload failed.', 
          details: uploadError instanceof Error ? uploadError.message : String(uploadError) 
        }, { status: 500 });
      }
    }

    const jobId = uuidv4();
    console.log(`[Veo3 API] Generated Job ID: ${jobId}`);

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

    console.log(`[Veo3 API] Calling RPC 'create_veo3_project' for job ${jobId} by user ${user.id}`, {
      params: rpcParams
    });

    const { data: projectData, error: rpcError } = await supabaseUserClient.rpc(
      'create_veo3_project',
      rpcParams
    );

    if (rpcError) {
      console.error(`[Veo3 API] RPC call 'create_veo3_project' failed for job ${jobId}:`, {
        message: rpcError.message,
        details: rpcError.details,
        hint: rpcError.hint,
        code: rpcError.code
      });
      return NextResponse.json({
        message: 'Failed to process request due to a database function error.',
        error: rpcError.message,
        error_details: rpcError.details,
        error_hint: rpcError.hint,
        error_code: 'RPC_CALL_FAILED'
      }, { status: 500 });
    }

    const project = Array.isArray(projectData) && projectData.length > 0 ? projectData[0] : null;

    if (!project) {
      console.error(`[Veo3 API] RPC 'create_veo3_project' for job ${jobId} did not return expected data`);
      return NextResponse.json({ 
        message: 'Project creation failed - no data returned from database',
        error_code: 'RPC_NO_DATA'
      }, { status: 500 });
    }

    // 处理 RPC 返回的状态
    if (project.status === 'insufficient_credits') {
      return NextResponse.json({ 
        message: 'Insufficient credits. Please purchase more credits.',
        error_code: 'INSUFFICIENT_CREDITS'
      }, { status: 402 });
    }

    if (project.status === 'active_project_exists') {
      return NextResponse.json({
        message: 'You have an active video generation in progress. Please wait for it to complete.',
        error_code: 'ACTIVE_PROJECT_EXISTS'
      }, { status: 409 });
    }

    if (project.status === 'user_not_found') {
      return NextResponse.json({
        message: 'User profile not found.',
        error_code: 'USER_NOT_FOUND'
      }, { status: 404 });
    }

    if (project.status === 'database_error') {
      return NextResponse.json({
        message: 'Database error occurred while creating project.',
        error_code: 'DATABASE_ERROR'
      }, { status: 500 });
    }

    if (project.status !== 'processing') {
      return NextResponse.json({
        message: `Unexpected project status: ${project.status}`,
        error_code: 'UNEXPECTED_STATUS'
      }, { status: 500 });
    }

    console.log(`[Veo3 API] Project created successfully. Credits deducted: ${project.credits_deducted}`);
    console.log(`[Veo3 API] Database record created with job_id: ${jobId}`);

    // 调用 N8N Webhook
    const n8nRequestBody: N8nVeo3RequestBody = {
      jobId,
      userId: user.id,
      generationMode,
      selectedModel,
      ...(textPrompt && { textPrompt }),
      ...(imageUrl && { imageUrl }),
      ...(imagePrompt && { imagePrompt })
    };

    // Veo3 N8N webhook URL - 生产环境
    const n8nWebhookUrl = 'https://n8n-avskrukq.us-east-1.clawcloudrun.com/webhook/0f10d941-19c5-4e6f-aad7-5ea549e36448';

    const n8nApiKey = process.env.N8N_API_KEY;

    console.log('[Veo3 API] Using PRODUCTION N8N webhook URL:', n8nWebhookUrl);
    console.log('[Veo3 API] N8N API Key status:', n8nApiKey ? 'SET' : 'NOT_SET');

    console.log(`[Veo3 API] Sending request to N8N for job ${jobId}`);

    // 准备请求头 - 使用与其他服务一致的认证方式
    const headersForN8n: HeadersInit = { 'Content-Type': 'application/json' };
    if (n8nApiKey) {
        headersForN8n['N8N_API_KEY'] = n8nApiKey;  // 使用自定义头而不是 Bearer Token
    }

    console.log('[Veo3 API] Request headers:', Object.keys(headersForN8n));

    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: headersForN8n,
        body: JSON.stringify(n8nRequestBody)
      });

      const responseText = await n8nResponse.text();
      if (!n8nResponse.ok) {
        console.error(`[Veo3 API] N8N webhook call failed for job ${jobId}. Status: ${n8nResponse.status}. Response: ${responseText}`);
      } else {
        console.log(`[Veo3 API] N8N webhook call successful for job ${jobId}. Status: ${n8nResponse.status}`);
      }
    } catch (n8nError: unknown) {
      const errorMessage = n8nError instanceof Error ? n8nError.message : String(n8nError);
      console.error(`[Veo3 API] N8N webhook call exception for job ${jobId}:`, errorMessage);
    }

    // 返回成功响应
    return NextResponse.json({
      message: 'Video generation started successfully',
      jobId,
      status: 'processing',
      creditsDeducted: project.credits_deducted
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Veo3 API] Critical error in POST handler:', errorMessage);
    return NextResponse.json({ 
      message: 'Internal Server Error. Please try again later.', 
      error: errorMessage 
    }, { status: 500 });
  }
}
