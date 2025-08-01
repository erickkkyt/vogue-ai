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

    // 查询用户是否有正在处理中的seedance generation任务
    const { data: pendingGenerations, error: queryError } = await supabase
      .from('seedance_generations')
      .select('id, job_id, created_at, generation_mode, selected_model, text_prompt, image_prompt')
      .eq('user_id', user.id)
      .eq('status', 'processing')
      .order('created_at', { ascending: false })
      .limit(1);

    if (queryError) {
      console.error('[Seedance Check Pending API] Query error:', queryError);
      return NextResponse.json({ message: 'Database query failed.' }, { status: 500 });
    }

    const hasPending = pendingGenerations && pendingGenerations.length > 0;

    return NextResponse.json({
      hasPending,
      pendingGeneration: hasPending ? pendingGenerations[0] : null
    }, { status: 200 });

  } catch (error) {
    console.error('[Seedance Check Pending API] Unexpected error:', error);
    return NextResponse.json({
      message: 'Internal server error.',
      error: String(error)
    }, { status: 500 });
  }
}
