import { NextResponse } from 'next/server';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const supabaseUserClient = await createServerSupabaseClient();

  // 用户认证
  const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  const { jobId } = await params;

  if (!jobId) {
    return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
  }

  try {
    console.log(`[Veo3 Status API] Checking status for job_id: ${jobId}, user_id: ${user.id}`);

    // 查询视频生成状态
    const { data, error } = await supabaseUserClient
      .from('veo3_generations')
      .select('status, video_url, created_at, completed_at')
      .eq('job_id', jobId)
      .eq('user_id', user.id) // 确保用户只能查询自己的任务
      .single();

    if (error) {
      console.error(`[Veo3 Status API] Error fetching status for job ${jobId}:`, error);

      // 尝试查询是否存在该 job_id（不限制 user_id）
      const { data: anyUserData, error: anyUserError } = await supabaseUserClient
        .from('veo3_generations')
        .select('user_id, status')
        .eq('job_id', jobId)
        .single();

      if (anyUserData) {
        console.log(`[Veo3 Status API] Job ${jobId} exists but belongs to user ${anyUserData.user_id}, current user is ${user.id}`);
      } else {
        console.log(`[Veo3 Status API] Job ${jobId} does not exist in database at all`);
      }

      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      jobId,
      status: data.status,
      videoUrl: data.video_url,
      createdAt: data.created_at,
      completedAt: data.completed_at
    });

  } catch (error) {
    console.error(`[Veo3 Status API] Exception for job ${jobId}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
