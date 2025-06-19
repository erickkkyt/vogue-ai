import { NextResponse, NextRequest } from 'next/server';
import { createClient as createAdminSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase admin client for server-side operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: SupabaseClient | undefined;
if (supabaseUrl && supabaseServiceRoleKey) {
  supabaseAdmin = createAdminSupabaseClient(supabaseUrl, supabaseServiceRoleKey);
  console.log('[Veo3 Webhook] Supabase Admin Client initialized for veo3-ready route.');
} else {
  console.error('[Veo3 Webhook] Supabase URL or Service Role Key for admin client is not defined. DB operations will fail.');
}

interface Veo3CallbackBody {
  jobId: string;
  videoUrl?: string;
  status: 'completed' | 'failed';
}

export async function POST(request: NextRequest) {
  console.log('[Veo3 Webhook] Received callback from N8N on /api/webhook/veo3-ready');

  // 1. 验证 webhook 密钥
  const expectedSecret = process.env.N8N_API_KEY;
  if (!expectedSecret) {
    console.error('[Veo3 Webhook] N8N_API_KEY is not defined in environment variables.');
    return NextResponse.json({ message: 'Server configuration error: Callback secret missing.' }, { status: 500 });
  }

  let receivedSecret: string | null = null;
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    receivedSecret = authHeader.substring(7);
  } else {
    receivedSecret = request.headers.get('X-Webhook-Secret'); // Fallback to custom header
  }

  if (!receivedSecret) {
    console.warn('[Veo3 Webhook] Missing secret in callback request headers.');
    return NextResponse.json({ message: 'Unauthorized: Missing secret.' }, { status: 401 });
  }
  if (receivedSecret !== expectedSecret) {
    console.warn('[Veo3 Webhook] Invalid secret provided in callback request.');
    return NextResponse.json({ message: 'Unauthorized: Invalid secret.' }, { status: 403 });
  }
  console.log('[Veo3 Webhook] Shared secret validated successfully.');

  // 2. 解析请求体
  let body: Veo3CallbackBody;
  try {
    body = await request.json();
    console.log('[Veo3 Webhook] Callback body received:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.error('[Veo3 Webhook] Error parsing JSON body from N8N callback:', error);
    return NextResponse.json({ message: 'Bad Request: Invalid JSON body.' }, { status: 400 });
  }

  const { jobId, videoUrl, status } = body;

  // 基本字段验证
  if (!jobId || !status) {
    console.error('[Veo3 Webhook] Missing jobId or status in N8N callback body.');
    return NextResponse.json({ message: 'Bad Request: Missing jobId or status.' }, { status: 400 });
  }
  if (status !== 'completed' && status !== 'failed') {
    console.error(`[Veo3 Webhook] Invalid status value: ${status} for jobId: ${jobId}. Must be 'completed' or 'failed'.`);
    return NextResponse.json({ message: 'Bad Request: Invalid status value.' }, { status: 400 });
  }

  // 确保 Supabase admin client 可用
  if (!supabaseAdmin) {
    console.error('[Veo3 Webhook] Supabase admin client not initialized. Cannot update database.');
    return NextResponse.json({ message: 'Server configuration error: Database client not available.' }, { status: 500 });
  }

  // 幂等性检查 - 避免重复处理
  if (status === 'completed') {
    try {
      const { data: existingProject, error: fetchError } = await supabaseAdmin
        .from('veo3_generations')
        .select('status')
        .eq('job_id', jobId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: "Zero rows returned"
        console.error(`[Veo3 Webhook] Error fetching project ${jobId} for idempotency check:`, fetchError.message);
        return NextResponse.json({ message: 'Server error during idempotency check.' }, { status: 500 });
      }

      if (existingProject && existingProject.status === 'completed') {
        console.log(`[Veo3 Webhook] Job ${jobId} has already been processed and marked as 'completed'. Ignoring duplicate callback.`);
        return NextResponse.json({ message: 'Callback for already completed job ignored.' });
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`[Veo3 Webhook] Exception during idempotency check for job ${jobId}:`, message);
      return NextResponse.json({ message: 'Server error during idempotency check.' }, { status: 500 });
    }
  }

  // 3. 根据状态处理
  if (status === 'completed') {
    if (!videoUrl) {
      console.error(`[Veo3 Webhook] Status is 'completed' but videoUrl is missing for jobId: ${jobId}. Marking as failed.`);
      try {
        const { error: dbError } = await supabaseAdmin
          .from('veo3_generations')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
          })
          .eq('job_id', jobId);
        if (dbError) {
          console.error(`[Veo3 Webhook] DB error updating project ${jobId} to 'failed' (missing URL):`, dbError.message);
        } else {
          console.log(`[Veo3 Webhook] Project ${jobId} marked as 'failed' due to missing videoUrl.`);
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error(`[Veo3 Webhook] Exception while updating project ${jobId} to 'failed' (missing URL):`, message);
      }
      return NextResponse.json({ message: 'Bad Request: videoUrl is required for completed status.' }, { status: 400 });
    }

    console.log(`[Veo3 Webhook] Processing COMPLETED video for jobId: ${jobId}. VideoUrl: ${videoUrl}`);
    
    try {
      const { error: dbUpdateError } = await supabaseAdmin
        .from('veo3_generations')
        .update({
          status: 'completed',
          video_url: videoUrl,
          completed_at: new Date().toISOString(),
        })
        .eq('job_id', jobId);

      if (dbUpdateError) {
        console.error(`[Veo3 Webhook] DB error updating project ${jobId} to 'completed':`, dbUpdateError.message);
        return NextResponse.json({ message: 'Server error during database update for completed job.' }, { status: 500 }); 
      } else {
        console.log(`[Veo3 Webhook] Project ${jobId} successfully updated: status='completed', videoUrl stored.`);
        return NextResponse.json({ message: 'Callback for completed job processed successfully.' });
      }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error(`[Veo3 Webhook] Exception during DB update for completed job ${jobId}:`, message);
        return NextResponse.json({ message: 'Server error during database update for completed job.' }, { status: 500 });
    }

  } else if (status === 'failed') {
    console.warn(`[Veo3 Webhook] Processing FAILED job notification for jobId: ${jobId}`);

    try {
      const { error: dbUpdateError } = await supabaseAdmin
        .from('veo3_generations')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          video_url: null,
        })
        .eq('job_id', jobId);

      if (dbUpdateError) {
        console.error(`[Veo3 Webhook] DB error updating project ${jobId} to 'failed':`, dbUpdateError.message);
        return NextResponse.json({ message: 'Server error during database update for failed job.' }, { status: 500 });
      } else {
        console.log(`[Veo3 Webhook] Project ${jobId} successfully updated to 'failed'.`);
        return NextResponse.json({ message: 'Callback for failed job processed successfully.' });
      }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error(`[Veo3 Webhook] Exception during DB update for failed job ${jobId}:`, message);
        return NextResponse.json({ message: 'Server error during database update for failed job.' }, { status: 500 });
    }
  }

  console.error(`[Veo3 Webhook] Reached end of POST handler with unhandled status for jobId: ${jobId}. Status: ${status}`);
  return NextResponse.json({ message: 'Bad Request: Unknown or unhandled status.' }, { status: 400 });
}
