import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// N8N 请求体接口
interface N8nLipsyncRequestBody {
  jobId: string;
  userId: string;
  generationMode: 'image-audio' | 'video-audio';
  selectedModel: 'lipsync' | 'lipsync_fast';
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  audioPrompt?: string;
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
    console.log('[LipSync API] Starting lipsync generation request...');

    // 验证用户登录状态
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('[LipSync API] Authentication failed:', userError);
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    console.log('[LipSync API] User authenticated:', user.id);

    // 解析请求体
    const formData = await request.formData();
    const generationMode = formData.get('generationMode') as string;
    const selectedModel = formData.get('selectedModel') as string;
    const audioPrompt = formData.get('audioPrompt') as string;
    const imageFile = formData.get('imageFile') as File | null;
    const videoFile = formData.get('videoFile') as File | null;
    const audioFile = formData.get('audioFile') as File | null;

    console.log('[LipSync API] Request data:', {
      generationMode,
      selectedModel,
      audioPrompt: audioPrompt ? 'provided' : 'not provided',
      imageFile: imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : 'not provided',
      videoFile: videoFile ? `${videoFile.name} (${videoFile.size} bytes)` : 'not provided',
      audioFile: audioFile ? `${audioFile.name} (${audioFile.size} bytes)` : 'not provided'
    });

    // 验证必填字段
    if (!generationMode || !selectedModel) {
      return NextResponse.json({ message: 'Missing required fields: generationMode, selectedModel' }, { status: 400 });
    }

    // 验证生成模式
    if (!['image-audio', 'video-audio'].includes(generationMode)) {
      return NextResponse.json({ message: 'Invalid generation mode' }, { status: 400 });
    }

    // 验证模型
    if (!['lipsync', 'lipsync_fast'].includes(selectedModel)) {
      return NextResponse.json({ message: 'Invalid model selection' }, { status: 400 });
    }

    // 验证模式特定的字段
    if (generationMode === 'image-audio' && !imageFile) {
      return NextResponse.json({ message: 'Image file is required for image-audio mode' }, { status: 400 });
    }

    if (generationMode === 'video-audio' && !videoFile) {
      return NextResponse.json({ message: 'Video file is required for video-audio mode' }, { status: 400 });
    }

    // 验证音频输入
    if (!audioFile && !audioPrompt?.trim()) {
      return NextResponse.json({ message: 'Either audio file or audio prompt is required' }, { status: 400 });
    }

    let imageUrl: string | null = null;
    let videoUrl: string | null = null;
    let audioUrl: string | null = null;

    // 处理图片上传（如果是 image-audio 模式）
    if (generationMode === 'image-audio' && imageFile) {
      try {
        console.log('[LipSync API] Uploading image to R2...');
        
        const fileExtension = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `lipsync/${user.id}/${Date.now()}_image.${fileExtension}`;
        
        const uploadCommand = new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: fileName,
          Body: Buffer.from(await imageFile.arrayBuffer()),
          ContentType: imageFile.type,
        });

        await r2Client.send(uploadCommand);
        imageUrl = `https://${R2_PUBLIC_HOSTNAME}/${fileName}`;
        
        console.log('[LipSync API] Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.error('[LipSync API] Image upload failed:', uploadError);
        return NextResponse.json({ message: 'Failed to upload image' }, { status: 500 });
      }
    }

    // 处理视频上传（如果是 video-audio 模式）
    if (generationMode === 'video-audio' && videoFile) {
      try {
        console.log('[LipSync API] Uploading video to R2...');
        
        const fileExtension = videoFile.name.split('.').pop() || 'mp4';
        const fileName = `lipsync/${user.id}/${Date.now()}_video.${fileExtension}`;
        
        const uploadCommand = new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: fileName,
          Body: Buffer.from(await videoFile.arrayBuffer()),
          ContentType: videoFile.type,
        });

        await r2Client.send(uploadCommand);
        videoUrl = `https://${R2_PUBLIC_HOSTNAME}/${fileName}`;
        
        console.log('[LipSync API] Video uploaded successfully:', videoUrl);
      } catch (uploadError) {
        console.error('[LipSync API] Video upload failed:', uploadError);
        return NextResponse.json({ message: 'Failed to upload video' }, { status: 500 });
      }
    }

    // 处理音频上传（如果提供了音频文件）
    if (audioFile) {
      try {
        console.log('[LipSync API] Uploading audio to R2...');
        
        const fileExtension = audioFile.name.split('.').pop() || 'mp3';
        const fileName = `lipsync/${user.id}/${Date.now()}_audio.${fileExtension}`;
        
        const uploadCommand = new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: fileName,
          Body: Buffer.from(await audioFile.arrayBuffer()),
          ContentType: audioFile.type,
        });

        await r2Client.send(uploadCommand);
        audioUrl = `https://${R2_PUBLIC_HOSTNAME}/${fileName}`;
        
        console.log('[LipSync API] Audio uploaded successfully:', audioUrl);
      } catch (uploadError) {
        console.error('[LipSync API] Audio upload failed:', uploadError);
        return NextResponse.json({ message: 'Failed to upload audio' }, { status: 500 });
      }
    }

    // 生成唯一的jobId
    const jobId = uuidv4();
    console.log('[LipSync API] Generated jobId:', jobId);

    // 调用 RPC 创建项目并扣除积分
    const rpcParams = {
      p_user_id: user.id,
      p_job_id: jobId,
      p_generation_mode: generationMode,
      p_selected_model: selectedModel,
      p_image_url: imageUrl,
      p_video_url: videoUrl,
      p_audio_url: audioUrl,
      p_audio_prompt: audioPrompt || null
    };

    console.log('[LipSync API] Calling RPC create_lipsync_project for job', jobId, 'by user', user.id);

    const { data: projectData, error: rpcError } = await supabase.rpc(
      'create_lipsync_project',
      rpcParams
    );

    if (rpcError) {
      console.error('[LipSync API] RPC error:', rpcError);
      return NextResponse.json({
        message: 'Database operation failed.'
      }, { status: 500 });
    }

    if (!projectData || projectData.length === 0) {
      console.error('[LipSync API] No data returned from RPC');
      return NextResponse.json({
        message: 'Failed to create project.'
      }, { status: 500 });
    }

    const result = projectData[0];
    console.log('[LipSync API] RPC result:', result);

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
        message: 'You already have a LipSync video generation in progress. Please wait for it to complete before starting a new one.'
      }, { status: 409 });
    }

    if (result.status.startsWith('database_error')) {
      console.error('[LipSync API] Database error:', result.status);
      return NextResponse.json({
        message: 'Database operation failed.'
      }, { status: 500 });
    }

    // 准备发送到N8N的数据
    const requestBodyToN8n: N8nLipsyncRequestBody = {
      jobId,
      userId: user.id,
      generationMode: generationMode as 'image-audio' | 'video-audio',
      selectedModel: selectedModel as 'lipsync' | 'lipsync_fast',
      imageUrl: imageUrl || undefined,
      videoUrl: videoUrl || undefined,
      audioUrl: audioUrl || undefined,
      audioPrompt: audioPrompt || undefined
    };

    console.log('[LipSync API] Sending request to N8N:', {
      ...requestBodyToN8n,
      audioPrompt: requestBodyToN8n.audioPrompt ? 'provided' : 'not provided',
      imageUrl: requestBodyToN8n.imageUrl ? 'provided' : 'not provided',
      videoUrl: requestBodyToN8n.videoUrl ? 'provided' : 'not provided',
      audioUrl: requestBodyToN8n.audioUrl ? 'provided' : 'not provided'
    });

    // 发送请求到N8N
    const n8nWebhookUrl = process.env.N8N_LIPSYNC_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      console.error('[LipSync API] N8N_LIPSYNC_WEBHOOK_URL not configured');
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
        console.error('[LipSync API] N8N webhook failed:', n8nResponse.status, errorText);
        
        // 更新数据库记录为失败状态
        await supabase
          .from('lipsync_generations')
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
      console.log('[LipSync API] N8N response:', n8nResult);

      // 返回成功响应
      return NextResponse.json({
        message: 'LipSync video generation started successfully.',
        jobId,
        creditsDeducted: result.credits_deducted,
        status: 'processing'
      }, { status: 200 });

    } catch (n8nCallError: unknown) {
      const errorMessage = n8nCallError instanceof Error ? n8nCallError.message : String(n8nCallError);
      console.error('[LipSync API] Network error during N8N call:', errorMessage);

      // 更新数据库记录为失败状态
      await supabase
        .from('lipsync_generations')
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
    console.error('[LipSync API] Unexpected error:', error);
    return NextResponse.json({
      message: 'Internal server error.',
      error: String(error)
    }, { status: 500 });
  }
}
