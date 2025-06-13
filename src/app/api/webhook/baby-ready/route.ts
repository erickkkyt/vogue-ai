import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient as createAdminSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase admin client for server-side operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: SupabaseClient | undefined;
if (supabaseUrl && supabaseServiceRoleKey) {
  supabaseAdmin = createAdminSupabaseClient(supabaseUrl, supabaseServiceRoleKey);
  console.log('[Baby Webhook] Supabase Admin Client initialized for baby-ready route.');
} else {
  console.error('[Baby Webhook] Supabase URL or Service Role Key for admin client is not defined. DB operations will fail.');
}

export async function POST(request: NextRequest) {
  console.log('[Baby Webhook] Received callback from n8n on /api/webhook/baby-ready');

  // 1. Validate shared secret for baby generation webhook
  const expectedSecret = process.env.N8N_BABY_CALLBACK_SECRET || process.env.N8N_API_KEY;
  if (!expectedSecret) {
    console.error('[Baby Webhook] N8N_BABY_CALLBACK_SECRET (or N8N_API_KEY as fallback) is not defined in environment variables.');
    return NextResponse.json({ message: 'Server configuration error: Callback secret missing.' }, { status: 500 });
  }

  let receivedSecret: string | null = null;
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    receivedSecret = authHeader.substring(7);
  } else {
    receivedSecret = request.headers.get('X-Webhook-Secret') || request.headers.get('X-Baby-Webhook-Secret');
  }

  if (!receivedSecret) {
    console.warn('[Baby Webhook] Missing secret in callback request headers.');
    return NextResponse.json({ message: 'Unauthorized: Missing secret.' }, { status: 401 });
  }
  if (receivedSecret !== expectedSecret) {
    console.warn('[Baby Webhook] Invalid secret provided in callback request.');
    return NextResponse.json({ message: 'Unauthorized: Invalid secret.' }, { status: 403 });
  }
  console.log('[Baby Webhook] Shared secret validated successfully.');

  // Ensure Supabase admin client is available for DB operations
  if (!supabaseAdmin) {
    console.error('[Baby Webhook] Supabase admin client not initialized. Cannot update database.');
    return NextResponse.json({ message: 'Server configuration error: Database client not available for webhook processing.' }, { status: 500 });
  }

  try {
    const payload = await request.json();
    console.log('[Baby Webhook] Received payload:', JSON.stringify(payload, null, 2));

    // 提取必需字段
    const jobId = payload.jobId || payload.job_id;
    const generatedBabyImageUrl = payload.generatedBabyImageUrl || payload.generated_baby_image_url || payload.babyImageUrl;
    const status = payload.status || 'completed';
    const errorMessage = payload.errorMessage || payload.error_message;

    // 验证必需字段
    if (!jobId) {
      console.error('[Baby Webhook] Missing required field: jobId', payload);
      return NextResponse.json({ message: 'Missing required field: jobId' }, { status: 400 });
    }

    // 如果状态是completed，必须有生成的图片URL
    if (status === 'completed' && !generatedBabyImageUrl) {
      console.error('[Baby Webhook] Missing required field: generatedBabyImageUrl for completed status', payload);
      return NextResponse.json({ message: 'Missing required field: generatedBabyImageUrl for completed generation' }, { status: 400 });
    }

    // 首先检查记录是否存在
    console.log('[Baby Webhook] Searching for jobId:', jobId);
    console.log('[Baby Webhook] JobId type:', typeof jobId);

    const { data: existingRecord, error: fetchError } = await supabaseAdmin
      .from('baby_generations')
      .select('id, user_id, status, job_id')
      .eq('job_id', jobId)
      .single();

    console.log('[Baby Webhook] Database query result:', { existingRecord, fetchError });

    if (fetchError || !existingRecord) {
      console.error('[Baby Webhook] Baby generation record not found for jobId:', jobId);
      console.error('[Baby Webhook] Fetch error details:', fetchError);

      // 尝试查询所有记录来调试
      const { data: allRecords } = await supabaseAdmin
        .from('baby_generations')
        .select('job_id')
        .limit(10);
      console.log('[Baby Webhook] Recent job_ids in database:', allRecords?.map((r: any) => r.job_id));

      return NextResponse.json({ message: 'Baby generation record not found' }, { status: 404 });
    }

    // 检查记录是否已经完成
    if (existingRecord.status === 'completed') {
      console.warn('[Baby Webhook] Baby generation already completed for jobId:', jobId);
      return NextResponse.json({ message: 'Baby generation already completed', generatedBabyImageUrl: generatedBabyImageUrl || 'N/A' });
    }

    // 准备更新数据
    const updateData: any = {
      status: status,
      completed_at: new Date().toISOString()
    };

    if (status === 'completed' && generatedBabyImageUrl) {
      updateData.generated_baby_url = generatedBabyImageUrl;
    }

    if (status === 'failed' && errorMessage) {
      updateData.error_message = errorMessage;
    }

    // 更新baby_generations表
    const { error: updateError } = await supabaseAdmin
      .from('baby_generations')
      .update(updateData)
      .eq('job_id', jobId);

    if (updateError) {
      console.error('[Baby Webhook] Error updating baby generation record:', updateError);
      return NextResponse.json({ message: 'Database update failed' }, { status: 500 });
    }

    console.log(`[Baby Webhook] Successfully updated baby generation record for jobId: ${jobId}, status: ${status}`);

    // 根据状态返回不同的响应
    if (status === 'completed') {
      return NextResponse.json({ 
        message: 'Baby generation completed successfully', 
        jobId,
        generatedBabyImageUrl,
        status: 'completed'
      });
    } else if (status === 'failed') {
      return NextResponse.json({ 
        message: 'Baby generation failed', 
        jobId,
        errorMessage,
        status: 'failed'
      });
    } else {
      return NextResponse.json({ 
        message: 'Baby generation status updated', 
        jobId,
        status
      });
    }

  } catch (error) {
    console.error('[Baby Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
