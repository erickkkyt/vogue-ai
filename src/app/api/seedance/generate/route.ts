import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';
import VolcengineClient from '@/lib/volcengine-client';

// 图片验证函数
async function validateImageBase64(imageBase64: string): Promise<{ valid: boolean; error?: string }> {
  try {
    // 检查base64格式
    if (!imageBase64.startsWith('data:image/')) {
      return { valid: false, error: 'Invalid image format' };
    }

    // 提取图片数据
    const base64Data = imageBase64.split(',')[1];
    if (!base64Data) {
      return { valid: false, error: 'Invalid base64 data' };
    }

    // 检查文件大小 (10MB限制)
    const sizeInBytes = (base64Data.length * 3) / 4;
    if (sizeInBytes > 10 * 1024 * 1024) {
      return { valid: false, error: 'Image size cannot exceed 10MB' };
    }

    // 创建Image对象验证尺寸和宽高比
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const aspectRatio = width / height;

        // 检查尺寸 (300-6000px)
        if (width < 300 || width > 6000 || height < 300 || height > 6000) {
          resolve({ valid: false, error: 'Image dimensions must be between 300px and 6000px' });
          return;
        }

        // 检查宽高比 (0.4-2.5)
        if (aspectRatio < 0.4 || aspectRatio > 2.5) {
          resolve({ valid: false, error: 'Image aspect ratio must be between 0.4 and 2.5' });
          return;
        }

        resolve({ valid: true });
      };

      img.onerror = () => {
        resolve({ valid: false, error: 'Invalid image file' });
      };

      img.src = imageBase64;
    });

  } catch (error) {
    return { valid: false, error: 'Failed to validate image' };
  }
}
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// 移除N8N相关接口，现在直接调用火山引擎API

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
    const aspectRatio = formData.get('aspectRatio') as string;
    const resolution = formData.get('resolution') as string;
    const duration = formData.get('duration') as string;
    const textPrompt = formData.get('textPrompt') as string;
    const imagePrompt = formData.get('imagePrompt') as string;
    const imageBase64 = formData.get('imageBase64') as string;

    console.log('[Seedance API] Request data:', {
      generationMode,
      selectedModel,
      aspectRatio,
      resolution,
      duration,
      textPrompt: textPrompt ? 'provided' : 'not provided',
      imagePrompt: imagePrompt ? 'provided' : 'not provided',
      imageBase64: imageBase64 ? 'provided' : 'not provided'
    });

    // 验证必填字段
    if (!generationMode || !selectedModel || !aspectRatio || !resolution || !duration) {
      return NextResponse.json({ message: 'Missing required fields: generationMode, selectedModel, aspectRatio, resolution, duration' }, { status: 400 });
    }

    // 验证生成模式
    if (!['text-to-video', 'image-to-video'].includes(generationMode)) {
      return NextResponse.json({ message: 'Invalid generation mode' }, { status: 400 });
    }

    // 验证模型 (现在接收的是实际的模型名称)
    const validModels = [
      'doubao-seedance-1-0-pro-250528',
      'doubao-seedance-1-0-lite-t2v-250428',
      'doubao-seedance-1-0-lite-i2v-250428'
    ];
    if (!validModels.includes(selectedModel)) {
      return NextResponse.json({ message: 'Invalid model selection' }, { status: 400 });
    }

    // 验证新参数
    if (!['16:9', '9:16', '1:1'].includes(aspectRatio)) {
      return NextResponse.json({ message: 'Invalid aspect ratio' }, { status: 400 });
    }

    if (!['720p', '1080p'].includes(resolution)) {
      return NextResponse.json({ message: 'Invalid resolution' }, { status: 400 });
    }

    if (!['5', '10'].includes(duration)) {
      return NextResponse.json({ message: 'Invalid duration' }, { status: 400 });
    }

    // 验证1080p只能用于Pro模型
    if (resolution === '1080p' && selectedModel !== 'doubao-seedance-1-0-pro-250528') {
      return NextResponse.json({ message: '1080p resolution is only available for Seedance Pro model' }, { status: 400 });
    }

    // 验证模式特定的字段
    if (generationMode === 'text-to-video' && !textPrompt?.trim()) {
      return NextResponse.json({ message: 'Text prompt is required for text-to-video mode' }, { status: 400 });
    }

    if (generationMode === 'image-to-video') {
      if (!imageBase64) {
        return NextResponse.json({ message: 'Image base64 is required for image-to-video mode' }, { status: 400 });
      }
      if (!imagePrompt?.trim()) {
        return NextResponse.json({ message: 'Image prompt is required for image-to-video mode' }, { status: 400 });
      }

      // 验证图片
      console.log('[Seedance API] Validating image...');
      const imageValidation = await validateImageBase64(imageBase64);
      if (!imageValidation.valid) {
        console.error('[Seedance API] Image validation failed:', imageValidation.error);
        return NextResponse.json({ message: imageValidation.error }, { status: 400 });
      }
      console.log('[Seedance API] Image validation passed');
    }

    // 检查 seedance_fast 模型限制
    if (generationMode === 'image-to-video' && selectedModel === 'seedance_fast') {
      return NextResponse.json({ 
        message: 'seedance_fast model only supports text-to-video mode' 
      }, { status: 400 });
    }

    let imageUrl: string | null = null;

    // 生成唯一的jobId
    const jobId = uuidv4();
    console.log('[Seedance API] Generated jobId:', jobId);

    // 初始化火山引擎客户端
    const volcengineClient = new VolcengineClient();

    // 计算积分消耗
    const baseCredits = selectedModel === 'doubao-seedance-1-0-pro-250528' ? 30 : 10;
    const durationMultiplier = duration === '10' ? 2 : 1;
    const creditsRequired = baseCredits * durationMultiplier;

    // 调用 RPC 创建项目并扣除积分
    const rpcParams = {
      p_user_id: user.id,
      p_job_id: jobId,
      p_generation_mode: generationMode,
      p_selected_model: selectedModel,
      p_text_prompt: textPrompt || null,
      p_image_url: generationMode === 'image-to-video' ? imageBase64 : null,
      p_image_prompt: imagePrompt || null,
      p_credits_required: creditsRequired
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

    // 准备火山引擎API请求
    let volcengineRequest;

    if (generationMode === 'text-to-video') {
      // 文本生视频
      const fullPrompt = volcengineClient.buildTextPrompt(textPrompt, aspectRatio, resolution, duration);
      volcengineRequest = {
        model: selectedModel,
        content: [
          {
            type: 'text' as const,
            text: fullPrompt
          }
        ]
      };
      console.log('[Seedance API] Text-to-video request:', { model: selectedModel, prompt: fullPrompt });
    } else {
      // 图片生视频
      const fullPrompt = volcengineClient.buildTextPrompt(imagePrompt, aspectRatio, resolution, duration);
      volcengineRequest = {
        model: selectedModel,
        content: [
          {
            type: 'image_url' as const,
            image_url: {
              url: imageBase64
            }
          },
          {
            type: 'text' as const,
            text: fullPrompt
          }
        ]
      };
      console.log('[Seedance API] Image-to-video request:', {
        model: selectedModel,
        prompt: fullPrompt,
        hasImage: !!imageBase64
      });
    }

    // 调用火山引擎API创建任务
    try {
      console.log('[Seedance API] Creating Volcengine task...');
      const { id } = await volcengineClient.createTask(volcengineRequest);
      console.log('[Seedance API] Volcengine task created, id:', id);

      // 更新数据库记录，添加外部任务ID
      await supabase
        .from('seedance_generations')
        .update({
          external_task_id: id // 存储火山引擎返回的id
        })
        .eq('job_id', jobId);

      // 启动后台轮询任务 (使用硬编码配置)
      pollTaskInBackground(jobId, id, volcengineClient, supabase);

      return NextResponse.json({
        message: 'Seedance video generation started successfully',
        jobId,
        id, // 返回火山引擎的任务id
        status: 'processing',
        creditsDeducted: result.credits_deducted,
        generationMode,
        selectedModel,
        aspectRatio,
        resolution,
        duration,
        textPrompt: generationMode === 'text-to-video' ? textPrompt : undefined,
        imagePrompt: generationMode === 'image-to-video' ? imagePrompt : undefined
      });

    } catch (apiError: unknown) {
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      console.error('[Seedance API] Volcengine API error:', errorMessage);

      // 更新数据库记录为失败状态
      await supabase
        .from('seedance_generations')
        .update({
          status: 'failed',
          error_message: `API error: ${errorMessage}`,
          completed_at: new Date().toISOString()
        })
        .eq('job_id', jobId);

      return NextResponse.json({
        message: 'Failed to start video generation.',
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

// 后台轮询函数 (每20秒查询一次)
async function pollTaskInBackground(
  jobId: string,
  id: string, // 火山引擎返回的任务id
  volcengineClient: VolcengineClient,
  supabase: any
) {
  console.log(`[Seedance Polling] Starting background polling for job ${jobId}, task id ${id}`);

  try {
    // 🎯 使用硬编码配置 (20秒间隔，90次最大尝试 = 30分钟)
    console.log(`[Seedance Polling] Using hardcoded config: 90 attempts, 20000ms interval`);

    // 开始轮询 (使用硬编码配置)
    const result = await volcengineClient.pollTaskUntilComplete(id);

    if (result.status === 'succeeded' && result.content?.video_url) {
      // 任务成功完成
      console.log(`[Seedance Polling] Task ${id} completed successfully`);
      console.log(`[Seedance Polling] Video URL: ${result.content.video_url}`);
      console.log(`[Seedance Polling] Task details:`, {
        model: result.model,
        resolution: result.resolution,
        duration: result.duration,
        ratio: result.ratio,
        framespersecond: result.framespersecond,
        usage: result.usage
      });

      await supabase
        .from('seedance_generations')
        .update({
          status: 'completed',
          video_url: result.content.video_url,
          completed_at: new Date().toISOString()
        })
        .eq('job_id', jobId);

      console.log(`[Seedance Polling] Database updated for job ${jobId} with video URL`);
    } else if (result.status === 'failed') {
      // 任务失败
      const errorMessage = result.error?.message || 'Task failed without specific error message';
      console.error(`[Seedance Polling] Task ${id} failed:`, errorMessage);

      await supabase
        .from('seedance_generations')
        .update({
          status: 'failed',
          error_message: errorMessage,
          completed_at: new Date().toISOString()
        })
        .eq('job_id', jobId);

      console.log(`[Seedance Polling] Database updated for job ${jobId} with failure status`);
    } else {
      // 意外状态
      console.warn(`[Seedance Polling] Task ${id} ended with unexpected status:`, result.status);

      await supabase
        .from('seedance_generations')
        .update({
          status: 'failed',
          error_message: `Unexpected task status: ${result.status}`,
          completed_at: new Date().toISOString()
        })
        .eq('job_id', jobId);
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Seedance Polling] Polling failed for job ${jobId}:`, errorMessage);

    // 更新数据库为失败状态
    await supabase
      .from('seedance_generations')
      .update({
        status: 'failed',
        error_message: `Polling error: ${errorMessage}`,
        completed_at: new Date().toISOString()
      })
      .eq('job_id', jobId);

    console.log(`[Seedance Polling] Database updated for job ${jobId} with polling error`);
  }
}
