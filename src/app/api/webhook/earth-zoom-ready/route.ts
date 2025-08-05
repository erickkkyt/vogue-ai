import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// 定义 N8N webhook 请求体接口
interface N8nEarthZoomWebhookBody {
  jobId: string;
  status: 'completed' | 'failed';
  videoUrl?: string;
  errorMessage?: string;
}

export async function POST(request: Request) {
  try {
    console.log('[Earth Zoom Webhook] Received webhook request');

    // 解析请求体
    const body: N8nEarthZoomWebhookBody = await request.json();
    console.log('[Earth Zoom Webhook] Request body:', body);

    const { jobId, status, videoUrl, errorMessage } = body;

    // 验证必需字段
    if (!jobId || !status) {
      console.error('[Earth Zoom Webhook] Missing required fields:', { jobId, status });
      return NextResponse.json({ message: 'Missing required fields: jobId and status' }, { status: 400 });
    }

    if (!['completed', 'failed'].includes(status)) {
      console.error('[Earth Zoom Webhook] Invalid status:', status);
      return NextResponse.json({ message: 'Invalid status. Must be completed or failed' }, { status: 400 });
    }

    if (status === 'completed' && !videoUrl) {
      console.error('[Earth Zoom Webhook] Missing videoUrl for completed status');
      return NextResponse.json({ message: 'videoUrl is required when status is completed' }, { status: 400 });
    }

    // 创建 Supabase 管理员客户端
    const supabaseAdmin = await createClient();

    // 查询现有记录
    console.log('[Earth Zoom Webhook] Querying database for jobId:', jobId);
    const { data: existingRecord, error: fetchError } = await supabaseAdmin
      .from('earth_zoom_generations')
      .select('id, user_id, status')
      .eq('job_id', jobId)
      .single();

    console.log('[Earth Zoom Webhook] Database query result:', { existingRecord, fetchError });

    if (fetchError || !existingRecord) {
      console.error('[Earth Zoom Webhook] Earth Zoom generation record not found for jobId:', jobId);
      console.error('[Earth Zoom Webhook] Fetch error details:', fetchError);

      // 尝试查询所有记录来调试
      const { data: allRecords } = await supabaseAdmin
        .from('earth_zoom_generations')
        .select('job_id')
        .limit(10);
      console.log('[Earth Zoom Webhook] Recent job_ids in database:', allRecords?.map((r: any) => r.job_id));

      return NextResponse.json({ message: 'Earth Zoom generation record not found' }, { status: 404 });
    }

    // 检查记录是否已经是最终状态
    if (existingRecord.status === 'completed' || existingRecord.status === 'failed') {
      console.log('[Earth Zoom Webhook] Record already in final state:', existingRecord.status);
      return NextResponse.json({ 
        message: 'Record already processed', 
        currentStatus: existingRecord.status 
      }, { status: 200 });
    }

    // 使用 RPC 函数更新状态
    console.log('[Earth Zoom Webhook] Calling RPC to update status...');
    const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc(
      'update_earth_zoom_generation_status',
      {
        p_job_id: jobId,
        p_status: status,
        p_video_url: videoUrl || null,
        p_error_message: errorMessage || null
      }
    );

    if (rpcError) {
      console.error('[Earth Zoom Webhook] RPC error:', rpcError);
      return NextResponse.json({ 
        message: 'Failed to update generation status', 
        error: rpcError.message 
      }, { status: 500 });
    }

    console.log('[Earth Zoom Webhook] RPC result:', rpcResult);

    if (rpcResult && rpcResult.length > 0) {
      const result = rpcResult[0];
      if (!result.success) {
        console.error('[Earth Zoom Webhook] RPC returned failure:', result.message);
        return NextResponse.json({ 
          message: 'Failed to update status', 
          details: result.message 
        }, { status: 500 });
      }
    }

    console.log('[Earth Zoom Webhook] Successfully updated Earth Zoom generation status:', {
      jobId,
      status,
      videoUrl: videoUrl ? 'provided' : 'not provided',
      errorMessage: errorMessage ? 'provided' : 'not provided'
    });

    return NextResponse.json({ 
      message: 'Earth Zoom generation status updated successfully',
      jobId,
      status
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Earth Zoom Webhook] Unexpected error:', errorMessage, error);
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: errorMessage 
    }, { status: 500 });
  }
}
