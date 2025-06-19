import { NextResponse } from 'next/server';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';

export async function GET() {
  const supabaseUserClient = await createServerSupabaseClient();

  // 用户认证
  const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    // 查询用户是否有正在处理的项目
    const { data, error } = await supabaseUserClient
      .from('veo3_generations')
      .select('job_id, status, created_at')
      .eq('user_id', user.id)
      .eq('status', 'processing')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error(`[Veo3 Check Active API] Error checking active projects for user ${user.id}:`, error);
      return NextResponse.json({ message: 'Error checking active projects' }, { status: 500 });
    }

    const hasActiveProject = data && data.length > 0;
    const activeProject = hasActiveProject ? data[0] : null;

    return NextResponse.json({
      hasActiveProject,
      activeProject: activeProject ? {
        jobId: activeProject.job_id,
        status: activeProject.status,
        createdAt: activeProject.created_at
      } : null
    });

  } catch (error) {
    console.error(`[Veo3 Check Active API] Exception for user ${user.id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
