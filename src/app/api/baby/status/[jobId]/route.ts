import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json({ message: 'Job ID is required.' }, { status: 400 });
    }

    // 验证用户登录状态
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    // 查询baby generation状态
    const { data: babyGeneration, error: queryError } = await supabase
      .from('baby_generations')
      .select('*')
      .eq('job_id', jobId)
      .eq('user_id', user.id) // 确保用户只能查询自己的记录
      .single();

    if (queryError || !babyGeneration) {
      console.error('[Baby Status API] Baby generation not found:', queryError);
      return NextResponse.json({ message: 'Baby generation not found.' }, { status: 404 });
    }

    // 返回状态信息
    return NextResponse.json({
      jobId: babyGeneration.job_id,
      status: babyGeneration.status,
      gender: babyGeneration.baby_gender,
      generatedBabyUrl: babyGeneration.generated_baby_url,
      errorMessage: babyGeneration.error_message,
      creditsUsed: babyGeneration.credits_used,
      createdAt: babyGeneration.created_at,
      completedAt: babyGeneration.completed_at
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Baby Status API] Error:', errorMessage);
    return NextResponse.json({ 
      message: 'Internal Server Error.', 
      error: errorMessage 
    }, { status: 500 });
  }
}
