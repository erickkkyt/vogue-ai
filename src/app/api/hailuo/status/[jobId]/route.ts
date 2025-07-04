import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json({ message: 'Job ID is required.' }, { status: 400 });
    }

    // 验证用户身份
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    // 查询生成状态
    const { data: generation, error: queryError } = await supabase
      .from('hailuo_generations')
      .select('id, job_id, status, video_url, error_message, created_at, completed_at')
      .eq('job_id', jobId)
      .eq('user_id', user.id)
      .single();

    if (queryError || !generation) {
      console.error('[Hailuo Status API] Generation not found:', queryError);
      return NextResponse.json({ message: 'Generation not found.' }, { status: 404 });
    }

    return NextResponse.json({
      jobId: generation.job_id,
      status: generation.status,
      videoUrl: generation.video_url,
      errorMessage: generation.error_message,
      createdAt: generation.created_at,
      completedAt: generation.completed_at
    });

  } catch (error) {
    console.error('[Hailuo Status API] Unexpected error:', error);
    return NextResponse.json({
      message: 'Internal server error.',
      error: String(error)
    }, { status: 500 });
  }
}
