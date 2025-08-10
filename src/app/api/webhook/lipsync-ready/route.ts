import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// LipSync专用的回调数据结构
interface N8nCallbackBody {
  jobId: string;              // 必需 - 任务ID
  videoUrl?: string;          // 可选 - 生成的视频URL (completed时必需)
  duration?: number;          // 可选 - 视频时长(秒数) (用于积分调整)
  status: 'completed' | 'failed'; // 必需 - 最终状态
}

export async function POST(request: Request) {
  try {
    console.log('[LipSync Webhook] Received webhook request');

    // 解析请求体 - 与AI Baby Podcast保持一致
    const body: N8nCallbackBody = await request.json();
    console.log('[LipSync Webhook] Callback body received:', JSON.stringify(body, null, 2));

    const { jobId, videoUrl, status, duration } = body;

    // 基本字段验证 - 与AI Baby Podcast保持一致
    if (!jobId || !status) {
      console.error('[LipSync Webhook] Missing jobId or status in N8N callback body.');
      return NextResponse.json({ message: 'Bad Request: Missing jobId or status.' }, { status: 400 });
    }

    // 验证状态值
    if (!['completed', 'failed'].includes(status)) {
      console.error('[LipSync Webhook] Invalid status:', status);
      return NextResponse.json({
        message: 'Invalid status. Must be "completed" or "failed"'
      }, { status: 400 });
    }

    // 如果状态是completed，必须提供videoUrl
    if (status === 'completed' && !videoUrl) {
      console.error('[LipSync Webhook] Missing videoUrl for completed status');
      return NextResponse.json({
        message: 'videoUrl is required when status is "completed"'
      }, { status: 400 });
    }

    // 创建 Supabase 管理员客户端 - 与AI Baby Podcast保持一致
    const supabaseAdmin = createClient();

    // 处理completed状态 - 与AI Baby Podcast保持一致
    if (status === 'completed') {
      console.log(`[LipSync Webhook] Processing COMPLETED video for jobId: ${jobId}. Provided videoUrl: ${videoUrl}, duration: ${duration}s`);

      // 如果有duration，调用积分调整RPC（多退少补）
      if (duration && duration > 0) {
        console.log(`[LipSync Webhook] Calling RPC 'adjust_lipsync_credits_by_actual_duration' for job ${jobId} with duration ${duration * 1000}ms.`);

        const { data: creditsAdjustedData, error: creditsAdjustedError } = await supabaseAdmin.rpc(
          'adjust_lipsync_credits_by_actual_duration',
          {
            p_job_id: jobId,
            p_duration_ms: duration * 1000 // 转换为毫秒
          }
        );

        if (creditsAdjustedError) {
          console.error(`[LipSync Webhook] RPC 'adjust_lipsync_credits_by_actual_duration' failed for job ${jobId}:`, creditsAdjustedError.message);
          // 记录错误但继续更新状态
        } else if (creditsAdjustedData && creditsAdjustedData.success === false) {
          console.warn(`[LipSync Webhook] RPC 'adjust_lipsync_credits_by_actual_duration' indicated an issue for job ${jobId}:`, creditsAdjustedData.message);
          // 记录警告但继续
        } else {
          console.log(`[LipSync Webhook] RPC 'adjust_lipsync_credits_by_actual_duration' successful for job ${jobId}. Response:`, JSON.stringify(creditsAdjustedData));
        }
      } else {
        console.log(`[LipSync Webhook] Duration for job ${jobId} is ${duration}s. No credits will be adjusted.`);
      }

      // 更新项目状态和视频信息 - 与AI Baby Podcast保持一致
      try {
        const { error: dbUpdateError } = await supabaseAdmin
          .from('lipsync_generations')
          .update({
            status: 'completed',
            generated_video_url: videoUrl,
            completed_at: new Date().toISOString(),
          })
          .eq('job_id', jobId);

        if (dbUpdateError) {
          console.error(`[LipSync Webhook] DB error updating project ${jobId} to 'completed':`, dbUpdateError.message);
          return NextResponse.json({ message: 'Callback processed, but a server-side error occurred during database update. Please check server logs.' }, { status: 500 });
        } else {
          console.log(`[LipSync Webhook] Project ${jobId} successfully updated in DB: status='completed', videoUrl stored.`);
          return NextResponse.json({ message: 'Callback for completed job processed successfully and database updated.' });
        }
      } catch (updateError) {
        console.error(`[LipSync Webhook] Unexpected error updating project ${jobId}:`, updateError);
        return NextResponse.json({ message: 'Unexpected error during database update.' }, { status: 500 });
      }
    } else if (status === 'failed') {
      console.warn(`[LipSync Webhook] Processing FAILED job notification from N8N for jobId: ${jobId}.`);

      try {
        const { error: dbUpdateError } = await supabaseAdmin
          .from('lipsync_generations')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
          })
          .eq('job_id', jobId);

        if (dbUpdateError) {
          console.error(`[LipSync Webhook] DB error updating project ${jobId} to 'failed':`, dbUpdateError.message);
          return NextResponse.json({ message: 'Callback for failed job processed, but DB update failed. Check server logs.' }, { status: 500 });
        } else {
          console.log(`[LipSync Webhook] Project ${jobId} successfully updated in DB to 'failed'.`);
          return NextResponse.json({ message: 'Callback for failed job processed and recorded successfully.' });
        }
      } catch (updateError) {
        console.error(`[LipSync Webhook] Unexpected error updating failed project ${jobId}:`, updateError);
        return NextResponse.json({ message: 'Unexpected error during database update.' }, { status: 500 });
      }
    } else {
      console.error(`[LipSync Webhook] Unknown status received: ${status}`);
      return NextResponse.json({ message: 'Unknown status received.' }, { status: 400 });
    }

  } catch (error) {
    console.error('[LipSync Webhook] Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: String(error)
    }, { status: 500 });
  }
}
