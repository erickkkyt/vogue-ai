import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    // 验证用户登录状态
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    // 查询用户是否有正在处理中的baby generation任务
    const { data: pendingGenerations, error: queryError } = await supabase
      .from('baby_generations')
      .select('id, job_id, created_at, baby_gender')
      .eq('user_id', user.id)
      .eq('status', 'processing')
      .order('created_at', { ascending: false })
      .limit(1);

    if (queryError) {
      console.error('[Baby Check Pending API] Query error:', queryError);
      return NextResponse.json({ message: 'Database query failed.' }, { status: 500 });
    }

    const hasPendingTask = pendingGenerations && pendingGenerations.length > 0;
    const pendingTask = hasPendingTask ? pendingGenerations[0] : null;

    return NextResponse.json({
      hasPendingTask,
      pendingTask: pendingTask ? {
        jobId: pendingTask.job_id,
        createdAt: pendingTask.created_at,
        gender: pendingTask.baby_gender
      } : null
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Baby Check Pending API] Error:', errorMessage);
    return NextResponse.json({ 
      message: 'Internal Server Error.', 
      error: errorMessage 
    }, { status: 500 });
  }
}
