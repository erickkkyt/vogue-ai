import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient as createAdminSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase admin client for server-side operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: SupabaseClient | undefined;
if (supabaseUrl && supabaseServiceRoleKey) {
  supabaseAdmin = createAdminSupabaseClient(supabaseUrl, supabaseServiceRoleKey);
  console.log('[N8N Webhook] Supabase Admin Client initialized for n8n-video-ready route.');
} else {
  console.error('[N8N Webhook] Supabase URL or Service Role Key for admin client is not defined. DB operations will fail.');
}

interface N8nCallbackBody {
  jobId: string;
  videoUrl?: string;
  fileName?: string; // Kept for potential future use, but not directly used for storage path now
  duration?: number; // 新增 duration 字段，假设为秒数
  status: 'completed' | 'failed';
  errorMessage?: string; // errorMessage from n8n is received but not stored in the DB
}

export async function POST(request: NextRequest) {
  console.log('[N8N Webhook] Received callback from n8n on /api/webhook/n8n-video-ready');

  // 1. Validate shared secret
  const expectedSecret = process.env.N8N_API_KEY;
  if (!expectedSecret) {
    console.error('[N8N Webhook] N8N_API_KEY (used as callback secret) is not defined in environment variables.');
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
    console.warn('[N8N Webhook] Missing secret in callback request headers.');
    return NextResponse.json({ message: 'Unauthorized: Missing secret.' }, { status: 401 });
  }
  if (receivedSecret !== expectedSecret) {
    console.warn('[N8N Webhook] Invalid secret provided in callback request.');
    return NextResponse.json({ message: 'Unauthorized: Invalid secret.' }, { status: 403 });
  }
  console.log('[N8N Webhook] Shared secret validated successfully.');

  // 2. Parse request body
  let body: N8nCallbackBody;
  try {
    body = await request.json();
    console.log('[N8N Webhook] Callback body received:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.error('[N8N Webhook] Error parsing JSON body from n8n callback:', error);
    return NextResponse.json({ message: 'Bad Request: Invalid JSON body.' }, { status: 400 });
  }

  const { jobId, videoUrl, status, errorMessage, duration } = body;

  // Basic body validation
  if (!jobId || !status) {
    console.error('[N8N Webhook] Missing jobId or status in n8n callback body.');
    return NextResponse.json({ message: 'Bad Request: Missing jobId or status.' }, { status: 400 });
  }
  if (status !== 'completed' && status !== 'failed') {
    console.error(`[N8N Webhook] Invalid status value: ${status} for jobId: ${jobId}. Must be 'completed' or 'failed'.`);
    return NextResponse.json({ message: 'Bad Request: Invalid status value.' }, { status: 400 });
  }

  // Ensure Supabase admin client is available for DB operations
  if (!supabaseAdmin) {
    console.error('[N8N Webhook] Supabase admin client not initialized. Cannot update database.');
    return NextResponse.json({ message: 'Server configuration error: Database client not available for webhook processing.' }, { status: 500 });
  }

  // <<<< START IDEMPOTENCY CHECK >>>>
  // Only perform full processing if the job hasn't been marked 'completed' already by a previous callback
  // For 'failed' status, we might allow an update from 'pending' or 'processing' to 'failed'.
  // If n8n sends 'completed' status first, then 'failed', this logic will ignore the 'failed'.
  // This assumes 'completed' is a final state that shouldn't be overwritten by a 'failed' status later for the same job.
  if (status === 'completed') { // Idempotency check primarily for 'completed' status
    try {
      const { data: existingProject, error: fetchError } = await supabaseAdmin
        .from('projects')
        .select('status')
        .eq('job_id', jobId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: "Zero rows returned" - project might not exist yet if this webhook is very fast
        console.error(`[N8N Webhook] Error fetching project ${jobId} for idempotency check:`, fetchError.message);
        return NextResponse.json({ message: 'Server error during idempotency check.' }, { status: 500 });
      }

      if (existingProject && existingProject.status === 'completed') {
        console.log(`[N8N Webhook] Job ${jobId} has already been processed and marked as 'completed'. Ignoring duplicate 'completed' callback.`);
        // It's important to return a success response to n8n so it doesn't keep retrying.
        return NextResponse.json({ message: 'Callback for already completed job ignored.' });
      }
      // If project doesn't exist (existingProject is null) or status is not 'completed', proceed.
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`[N8N Webhook] Exception during idempotency check for job ${jobId}:`, message);
      return NextResponse.json({ message: 'Server error during idempotency check.' }, { status: 500 });
    }
  }
  // <<<< END IDEMPOTENCY CHECK >>>>

  // 3. Process based on status
  if (status === 'completed') {
    if (!videoUrl || duration === undefined || duration === null) {
      console.error(`[N8N Webhook] Status is 'completed' but videoUrl or duration is missing for jobId: ${jobId}. Marking as failed.`);
      try {
        const { error: dbError } = await supabaseAdmin
          .from('projects')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString(),
            video_url: null,
            duration: null, 
          })
          .eq('job_id', jobId);
        if (dbError) {
          console.error(`[N8N Webhook] DB error updating project ${jobId} to 'failed' (due to missing URL/duration):`, dbError.message);
        } else {
          console.log(`[N8N Webhook] Project ${jobId} marked as 'failed' in DB due to missing videoUrl/duration from n8n.`);
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error(`[N8N Webhook] Exception while updating project ${jobId} to 'failed' (missing URL/duration):`, message);
      }
      return NextResponse.json({ message: 'Bad Request: videoUrl and duration are required for completed status.' }, { status: 400 });
    }

    console.log(`[N8N Webhook] Processing COMPLETED video for jobId: ${jobId}. Provided videoUrl: ${videoUrl}, duration: ${duration}ms`);
    
    // 首先，尝试扣除积分
    if (duration > 0) {
        console.log(`[N8N Webhook] Calling RPC 'deduct_credits_by_duration' for job ${jobId} with duration ${duration}ms.`);
        const { data: creditsDeductedData, error: creditsDeductedError } = await supabaseAdmin.rpc(
            'deduct_credits_by_duration',
            {
                p_job_id: jobId,
                p_duration_ms: duration
            }
        );

        if (creditsDeductedError) {
            console.error(`[N8N Webhook] RPC 'deduct_credits_by_duration' failed for job ${jobId}:`, creditsDeductedError.message);
            // 即使扣费失败（例如函数本身错误），我们仍然尝试更新项目状态为 completed
        } else if (creditsDeductedData && creditsDeductedData.success === false) {
            console.warn(`[N8N Webhook] RPC 'deduct_credits_by_duration' indicated an issue for job ${jobId}:`, creditsDeductedData.message);
            // 同样，记录警告但继续
        } else {
            console.log(`[N8N Webhook] RPC 'deduct_credits_by_duration' successful for job ${jobId}. Response:`, JSON.stringify(creditsDeductedData));
        }
    } else {
        console.log(`[N8N Webhook] Duration for job ${jobId} is ${duration}ms. No credits will be deducted.`);
    }

    // 然后，更新项目状态和视频信息
    try {
      const { error: dbUpdateError } = await supabaseAdmin
        .from('projects')
        .update({
          status: 'completed',
          video_url: videoUrl, 
          duration: duration, // 存储ms单位的duration
          updated_at: new Date().toISOString(),
        })
        .eq('job_id', jobId);

      if (dbUpdateError) {
        console.error(`[N8N Webhook] DB error updating project ${jobId} to 'completed':`, dbUpdateError.message);
        return NextResponse.json({ message: 'Callback processed, but a server-side error occurred during database update. Please check server logs.' }, { status: 500 }); 
      } else {
        console.log(`[N8N Webhook] Project ${jobId} successfully updated in DB: status='completed', videoUrl and duration stored.`);
        return NextResponse.json({ message: 'Callback for completed job processed successfully and database updated.' });
      }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error(`[N8N Webhook] Exception during DB update for completed job ${jobId}:`, message);
        return NextResponse.json({ message: 'Server error during database update for completed job. Please check server logs.' }, { status: 500 });
    }

  } else if (status === 'failed') {
    console.warn(`[N8N Webhook] Processing FAILED job notification from n8n for jobId: ${jobId}. Reported error (not stored in DB): ${errorMessage || 'Not provided'}`);
    
    // OPTIONAL: Add idempotency for 'failed' status as well, e.g., don't update if already 'completed'.
    // For now, it will update to 'failed' regardless of previous state unless it was 'completed' and handled by the above block.
    // However, the current idempotency check for 'completed' status might prevent this 'failed' block from running
    // if a 'completed' callback for the same job_id was processed first.
    // If 'failed' can overwrite other states (except 'completed'), that logic would be more complex or need adjustment here.

    try {
      const { error: dbUpdateError } = await supabaseAdmin
        .from('projects')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
          video_url: null, 
          duration: null, // 失败时清除 duration
        })
        .eq('job_id', jobId);

      if (dbUpdateError) {
        console.error(`[N8N Webhook] DB error updating project ${jobId} to 'failed':`, dbUpdateError.message);
        return NextResponse.json({ message: 'Callback for failed job processed, but DB update failed. Check server logs.' }, { status: 500 });
      } else {
        console.log(`[N8N Webhook] Project ${jobId} successfully updated in DB to 'failed'. Error from n8n (if any) was: ${errorMessage || 'Not provided'}`);
        return NextResponse.json({ message: 'Callback for failed job processed and recorded successfully.' });
      }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error(`[N8N Webhook] Exception during DB update for failed job ${jobId}:`, message);
        return NextResponse.json({ message: 'Server error during database update for failed job. Check server logs.' }, { status: 500 });
    }
  }

  console.error(`[N8N Webhook] Reached end of POST handler with unhandled status for jobId: ${jobId}. Status: ${status}`);
  return NextResponse.json({ message: 'Bad Request: Unknown or unhandled status.' }, { status: 400 });
}
