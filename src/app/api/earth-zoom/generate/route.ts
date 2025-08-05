import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// N8N 请求体接口
interface N8nEarthZoomRequestBody {
  jobId: string;
  userId: string;
  imageUrl: string;
  customPrompt?: string;
  zoomSpeed: 'slow' | 'medium' | 'fast';
  outputFormat: '16:9' | '9:16' | '1:1';
  effectType: 'earth-zoom' | 'space-zoom' | 'satellite-zoom';
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

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_HOSTNAME = process.env.R2_PUBLIC_HOSTNAME!;

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  // 验证用户登录状态
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('[Earth Zoom API] Authentication failed:', userError);
    return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
  }

  console.log('[Earth Zoom API] User authenticated:', user.id);

  try {
    const formData = await request.formData();

    // 提取表单数据
    const customPrompt = formData.get('customPrompt') as string;
    const zoomSpeed = formData.get('zoomSpeed') as 'slow' | 'medium' | 'fast';
    const outputFormat = formData.get('outputFormat') as '16:9' | '9:16' | '1:1';
    const effectType = formData.get('effectType') as 'earth-zoom' | 'space-zoom' | 'satellite-zoom';
    const imageFile = formData.get('imageFile') as File | null;

    // 验证必填字段
    if (!imageFile) {
      return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
    }

    if (!zoomSpeed || !['slow', 'medium', 'fast'].includes(zoomSpeed)) {
      return NextResponse.json({ message: 'Invalid zoom speed. Must be slow, medium, or fast' }, { status: 400 });
    }

    if (!outputFormat || !['16:9', '9:16', '1:1'].includes(outputFormat)) {
      return NextResponse.json({ message: 'Invalid output format. Must be 16:9, 9:16, or 1:1' }, { status: 400 });
    }

    if (!effectType || !['earth-zoom', 'space-zoom', 'satellite-zoom'].includes(effectType)) {
      return NextResponse.json({ message: 'Invalid effect type' }, { status: 400 });
    }

    // 验证文件大小和类型
    if (imageFile.size > 10 * 1024 * 1024) { // 10MB
      return NextResponse.json({ message: 'Image file size must be less than 10MB' }, { status: 400 });
    }

    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json({ message: 'File must be an image' }, { status: 400 });
    }

    console.log('[Earth Zoom API] Processing image upload...');

    // 上传图片到R2
    let imageUrl: string;
    try {
      const fileExtension = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `earth-zoom/${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadCommand = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: imageFile.type,
      });

      await r2Client.send(uploadCommand);
      imageUrl = `https://${R2_PUBLIC_HOSTNAME}/${fileName}`;
      
      console.log('[Earth Zoom API] Image uploaded successfully:', imageUrl);
    } catch (uploadError) {
      console.error('[Earth Zoom API] Image upload failed:', uploadError);
      return NextResponse.json({ message: 'Failed to upload image' }, { status: 500 });
    }

    // 生成唯一的jobId
    const jobId = uuidv4();
    console.log('[Earth Zoom API] Generated jobId:', jobId);

    // 调用 RPC 创建项目并扣除积分
    const rpcParams = {
      p_user_id: user.id,
      p_job_id: jobId,
      p_image_url: imageUrl,
      p_custom_prompt: customPrompt || null,
      p_zoom_speed: zoomSpeed,
      p_output_format: outputFormat,
      p_effect_type: effectType
    };

    console.log('[Earth Zoom API] Calling RPC create_earth_zoom_project for job', jobId, 'by user', user.id);

    const { data: projectData, error: rpcError } = await supabase.rpc(
      'create_earth_zoom_project',
      rpcParams
    );

    if (rpcError) {
      console.error('[Earth Zoom API] RPC error:', rpcError);
      return NextResponse.json({
        message: 'Database operation failed.'
      }, { status: 500 });
    }

    if (!projectData || projectData.length === 0) {
      console.error('[Earth Zoom API] No data returned from RPC');
      return NextResponse.json({
        message: 'Failed to create project.'
      }, { status: 500 });
    }

    const result = projectData[0];
    console.log('[Earth Zoom API] RPC result:', result);

    // 处理不同的返回状态
    if (result.status === 'insufficient_credits') {
      return NextResponse.json({
        message: 'Insufficient credits. You need 15 credits to generate an Earth Zoom video.'
      }, { status: 402 });
    }

    if (result.status === 'user_not_found') {
      return NextResponse.json({
        message: 'User profile not found.'
      }, { status: 404 });
    }

    if (result.status === 'concurrent_generation_exists') {
      return NextResponse.json({
        message: 'You already have an Earth Zoom video generation in progress. Please wait for it to complete before starting a new one.'
      }, { status: 409 });
    }

    if (result.status === 'invalid_zoom_speed') {
      return NextResponse.json({
        message: 'Invalid zoom speed. Only slow, medium, and fast are supported.'
      }, { status: 400 });
    }

    if (result.status === 'invalid_output_format') {
      return NextResponse.json({
        message: 'Invalid output format. Only 16:9, 9:16, and 1:1 are supported.'
      }, { status: 400 });
    }

    if (result.status === 'invalid_effect_type') {
      return NextResponse.json({
        message: 'Invalid effect type.'
      }, { status: 400 });
    }

    if (result.status.startsWith('database_error')) {
      console.error('[Earth Zoom API] Database error:', result.status);
      return NextResponse.json({
        message: 'Database operation failed.'
      }, { status: 500 });
    }

    // 准备发送到N8N的数据
    const requestBodyToN8n: N8nEarthZoomRequestBody = {
      jobId,
      userId: user.id,
      imageUrl,
      customPrompt: customPrompt || undefined,
      zoomSpeed,
      outputFormat,
      effectType
    };

    console.log('[Earth Zoom API] Sending request to N8N:', {
      ...requestBodyToN8n,
      customPrompt: requestBodyToN8n.customPrompt ? 'provided' : 'not provided',
      imageUrl: 'provided'
    });

    // 发送请求到N8N
    const n8nWebhookUrl = process.env.N8N_EARTH_ZOOM_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      console.error('[Earth Zoom API] N8N webhook URL not configured');
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
        console.error('[Earth Zoom API] N8N webhook failed:', n8nResponse.status, errorText);
        
        // 更新数据库记录为失败状态
        await supabase
          .from('earth_zoom_generations')
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

      const responseData = await n8nResponse.json();
      console.log('[Earth Zoom API] N8N response:', responseData);

      return NextResponse.json({
        message: 'Earth Zoom video generation started successfully',
        jobId,
        status: 'processing',
        creditsDeducted: result.credits_deducted,
        imageUrl,
        customPrompt,
        zoomSpeed,
        outputFormat,
        effectType
      });

    } catch (n8nCallError: unknown) {
      const errorMessage = n8nCallError instanceof Error ? n8nCallError.message : String(n8nCallError);
      console.error('[Earth Zoom API] Network error during N8N call:', errorMessage);

      // 更新数据库记录为失败状态
      await supabase
        .from('earth_zoom_generations')
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
    console.error('[Earth Zoom API] Unexpected error:', error);
    return NextResponse.json({
      message: 'Internal server error.',
      error: String(error)
    }, { status: 500 });
  }
}
