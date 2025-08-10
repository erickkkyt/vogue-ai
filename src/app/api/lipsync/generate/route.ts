import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// N8N 请求体接口
interface N8nLipsyncRequestBody {
  jobId: string;
  userId: string;
  audioInputMode: 'upload' | 'record' | 'text';
  voiceId: string; // 与AI Baby Podcast保持一致
  estimatedDurationSeconds: number; // 添加时长信息
  videoResolution: '540p' | '720p';
  aspectRatio: '1:1' | '16:9' | '9:16';
  imageUrl?: string;
  audioUrl?: string;
  audioContent?: string; // 改为audioContent
}

// R2 配置 - 与AI Baby Podcast保持一致
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_HOSTNAME = process.env.R2_PUBLIC_HOSTNAME;

// R2上传辅助函数 - 与AI Baby Podcast保持一致
async function uploadToR2(file: File, userId: string, fileTypeIdentifier: string): Promise<string> {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_HOSTNAME) {
    console.error('[LipSync API - R2 Upload] R2 credentials missing in environment variables.');
    throw new Error('Server configuration error: R2 credentials missing.');
  }

  // 清理文件名并添加唯一前缀 - 与AI Baby Podcast保持一致
  const cleanedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
  const uniqueFileName = `user_${userId}/${fileTypeIdentifier}_${Date.now()}_${cleanedFileName}`.toLowerCase();

  // Create S3 client for R2 - 与AI Baby Podcast保持一致
  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  try {
    // Convert File to Buffer - 与AI Baby Podcast保持一致
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2 - 与AI Baby Podcast保持一致
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Return public URL - 与AI Baby Podcast保持一致
    const publicUrl = `https://${R2_PUBLIC_HOSTNAME}/${uniqueFileName}`;
    console.log(`[LipSync API - R2 Upload] File uploaded successfully to R2: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('[LipSync API] R2 upload error:', error);
    throw new Error(`R2 upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

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
    const audioInputMode = formData.get('audioInputMode') as string;
    const voiceId = formData.get('voiceId') as string; // 与AI Baby Podcast保持一致
    const audioContent = formData.get('audioContent') as string;
    const videoResolution = formData.get('videoResolution') as string || '540p';
    const aspectRatio = formData.get('aspectRatio') as string || '9:16';
    const imageFile = formData.get('imageFile') as File | null;
    const audioFile = formData.get('audioFile') as File | null;
    const recordedAudio = formData.get('recordedAudio') as File | null;

    // 获取前端传递的音频时长信息
    const audioDuration = parseFloat(formData.get('audioDuration') as string || '0');
    const recordingDuration = parseFloat(formData.get('recordingDuration') as string || '0');

    console.log('[LipSync API] Request data:', {
      audioInputMode,
      voiceId,
      videoResolution,
      aspectRatio,
      audioContent: audioContent ? 'provided' : 'not provided',
      imageFile: imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : 'not provided',
      audioFile: audioFile ? `${audioFile.name} (${audioFile.size} bytes)` : 'not provided',
      recordedAudio: recordedAudio ? `${recordedAudio.name} (${recordedAudio.size} bytes)` : 'not provided'
    });

    // 验证必填字段 - 必须有图片
    if (!imageFile) {
      return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
    }

    // 验证音频输入 - 必须有音频文件、录音或文本
    if (!audioFile && !recordedAudio && !audioContent?.trim()) {
      return NextResponse.json({ message: 'Audio file, recorded audio, or audio content is required' }, { status: 400 });
    }

    let imageUrl: string | null = null;
    let uploadedAudioUrl: string | null = null;
    let recordedAudioUrl: string | null = null;

    // 处理图片上传 - 使用标准uploadToR2函数
    if (imageFile) {
      try {
        console.log('[LipSync API] Uploading image to R2...');
        imageUrl = await uploadToR2(imageFile, user.id, 'lipsync_image');
        console.log('[LipSync API] Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.error('[LipSync API] Image upload failed:', uploadError);
        return NextResponse.json({ message: 'Failed to upload image' }, { status: 500 });
      }
    }



    // 处理上传音频文件
    if (audioFile) {
      try {
        console.log('[LipSync API] Uploading audio file to R2...');
        uploadedAudioUrl = await uploadToR2(audioFile, user.id, 'lipsync_uploaded_audio');
        console.log('[LipSync API] Uploaded audio file successfully:', uploadedAudioUrl);
      } catch (uploadError) {
        console.error('[LipSync API] Uploaded audio file upload failed:', uploadError);
        return NextResponse.json({ message: 'Failed to upload audio file' }, { status: 500 });
      }
    }

    // 处理录音音频
    if (recordedAudio) {
      try {
        console.log('[LipSync API] Uploading recorded audio to R2...');
        recordedAudioUrl = await uploadToR2(recordedAudio, user.id, 'lipsync_recorded_audio');
        console.log('[LipSync API] Recorded audio uploaded successfully:', recordedAudioUrl);
      } catch (uploadError) {
        console.error('[LipSync API] Recorded audio upload failed:', uploadError);
        return NextResponse.json({ message: 'Failed to upload recorded audio' }, { status: 500 });
      }
    }

    // 生成唯一的jobId
    const jobId = uuidv4();
    console.log('[LipSync API] Generated jobId:', jobId);

    // 估算视频时长
    let estimatedDurationSeconds = 10; // 默认10秒

    if (audioInputMode === 'upload' && audioDuration > 0) {
      // 上传音频：使用前端检测到的准确时长
      estimatedDurationSeconds = Math.max(3, Math.ceil(audioDuration));
      console.log('[LipSync API] Using uploaded audio duration:', estimatedDurationSeconds, 'seconds');
    } else if (audioInputMode === 'record' && recordingDuration > 0) {
      // 录音：使用前端记录的准确时长
      estimatedDurationSeconds = Math.max(3, Math.ceil(recordingDuration));
      console.log('[LipSync API] Using recorded audio duration:', estimatedDurationSeconds, 'seconds');
    } else if (audioInputMode === 'text' && audioContent && audioContent.trim()) {
      // 文本转语音：估算时长（150词/分钟，5字符/词）
      const estimatedWords = audioContent.trim().length / 5;
      estimatedDurationSeconds = Math.max(3, Math.ceil((estimatedWords / 150) * 60));
      console.log('[LipSync API] Estimated text-to-speech duration:', estimatedDurationSeconds, 'seconds for', audioContent.length, 'characters');
    }

    // 调用 RPC 创建项目并前扣除积分
    const rpcParams = {
      p_user_id: user.id,
      p_job_id: jobId,
      p_audio_input_mode: audioInputMode,
      p_voice_id: voiceId || 'en-US-ken',
      p_estimated_duration_seconds: estimatedDurationSeconds,
      p_image_url: imageUrl,
      p_uploaded_audio_url: uploadedAudioUrl,
      p_recorded_audio_url: recordedAudioUrl,
      p_audio_content: audioContent || null,
      p_video_resolution: videoResolution,
      p_aspect_ratio: aspectRatio
    };

    console.log('[LipSync API] Calling RPC create_lipsync_project_with_credit_deduction for job', jobId, 'by user', user.id, 'estimated duration:', estimatedDurationSeconds);

    const { data: projectData, error: rpcError } = await supabase.rpc(
      'create_lipsync_project_with_credit_deduction',
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
      audioInputMode: audioInputMode as 'upload' | 'record' | 'text',
      voiceId: voiceId || 'en-US-ken', // 与AI Baby Podcast保持一致
      estimatedDurationSeconds: estimatedDurationSeconds, // 添加时长信息
      videoResolution: videoResolution as '540p' | '720p',
      aspectRatio: aspectRatio as '1:1' | '16:9' | '9:16',
      imageUrl: imageUrl || undefined,
      audioUrl: uploadedAudioUrl || recordedAudioUrl || undefined, // 合并音频URL
      audioContent: audioContent || undefined
    };

    console.log('[LipSync API] Sending request to N8N:', {
      ...requestBodyToN8n,
      audioPrompt: requestBodyToN8n.audioPrompt ? 'provided' : 'not provided',
      imageUrl: requestBodyToN8n.imageUrl ? 'provided' : 'not provided',
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
