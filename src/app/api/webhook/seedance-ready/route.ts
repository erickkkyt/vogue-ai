import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface SeedanceWebhookPayload {
  jobId: string;
  userId: string;
  status: 'completed' | 'failed';
  videoUrl?: string;
  errorMessage?: string;
}

export async function POST(request: Request) {
  try {
    console.log('[Seedance Webhook] Received webhook request');

    // 解析请求体
    const payload: SeedanceWebhookPayload = await request.json();
    console.log('[Seedance Webhook] Payload:', {
      jobId: payload.jobId,
      userId: payload.userId,
      status: payload.status,
      videoUrl: payload.videoUrl ? 'provided' : 'not provided',
      errorMessage: payload.errorMessage || 'none'
    });

    // 验证必填字段
    if (!payload.jobId || !payload.userId || !payload.status) {
      console.error('[Seedance Webhook] Missing required fields');
      return NextResponse.json({ 
        error: 'Missing required fields: jobId, userId, status' 
      }, { status: 400 });
    }

    // 验证状态值
    if (!['completed', 'failed'].includes(payload.status)) {
      console.error('[Seedance Webhook] Invalid status:', payload.status);
      return NextResponse.json({ 
        error: 'Invalid status. Must be "completed" or "failed"' 
      }, { status: 400 });
    }

    // 如果状态是completed，必须提供videoUrl
    if (payload.status === 'completed' && !payload.videoUrl) {
      console.error('[Seedance Webhook] Missing videoUrl for completed status');
      return NextResponse.json({ 
        error: 'videoUrl is required when status is "completed"' 
      }, { status: 400 });
    }

    // 创建 Supabase 服务端客户端
    const supabase = await createClient();

    // 首先检查记录是否存在
    const { data: existingRecord, error: fetchError } = await supabase
      .from('seedance_generations')
      .select('id, status, user_id')
      .eq('job_id', payload.jobId)
      .single();

    if (fetchError) {
      console.error('[Seedance Webhook] Error fetching record:', fetchError);
      return NextResponse.json({ 
        error: 'Failed to fetch generation record' 
      }, { status: 500 });
    }

    if (!existingRecord) {
      console.error('[Seedance Webhook] Generation record not found for jobId:', payload.jobId);
      return NextResponse.json({ 
        error: 'Generation record not found' 
      }, { status: 404 });
    }

    // 验证用户ID匹配
    if (existingRecord.user_id !== payload.userId) {
      console.error('[Seedance Webhook] User ID mismatch:', {
        expected: existingRecord.user_id,
        received: payload.userId
      });
      return NextResponse.json({ 
        error: 'User ID mismatch' 
      }, { status: 403 });
    }

    // 检查记录是否已经完成
    if (existingRecord.status !== 'processing') {
      console.warn('[Seedance Webhook] Record already processed:', {
        jobId: payload.jobId,
        currentStatus: existingRecord.status,
        newStatus: payload.status
      });
      return NextResponse.json({ 
        message: 'Record already processed',
        currentStatus: existingRecord.status
      }, { status: 200 });
    }

    // 准备更新数据
    const updateData: any = {
      status: payload.status,
      completed_at: new Date().toISOString()
    };

    if (payload.status === 'completed' && payload.videoUrl) {
      updateData.video_url = payload.videoUrl;
    }

    if (payload.status === 'failed' && payload.errorMessage) {
      updateData.error_message = payload.errorMessage;
    }

    console.log('[Seedance Webhook] Updating record with data:', updateData);

    // 更新数据库记录
    const { error: updateError } = await supabase
      .from('seedance_generations')
      .update(updateData)
      .eq('job_id', payload.jobId);

    if (updateError) {
      console.error('[Seedance Webhook] Error updating record:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update generation record' 
      }, { status: 500 });
    }

    console.log('[Seedance Webhook] Successfully updated record for jobId:', payload.jobId);

    // 如果生成失败，可以考虑退还积分（根据业务需求决定）
    if (payload.status === 'failed') {
      console.log('[Seedance Webhook] Generation failed for jobId:', payload.jobId);
      // 这里可以添加退还积分的逻辑，如果业务需要的话
      // 例如：调用退还积分的RPC函数
    }

    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      jobId: payload.jobId,
      status: payload.status
    }, { status: 200 });

  } catch (error) {
    console.error('[Seedance Webhook] Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: String(error)
    }, { status: 500 });
  }
}
