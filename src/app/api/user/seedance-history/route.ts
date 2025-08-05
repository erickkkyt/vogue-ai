import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 验证用户身份
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    // 获取用户的Seedance生成历史
    const { data: generations, error: queryError } = await supabase.rpc(
      'get_user_seedance_generations',
      {
        p_user_id: user.id,
        p_limit: limit,
        p_offset: offset
      }
    );

    if (queryError) {
      console.error('[Seedance History API] Query error:', queryError);
      return NextResponse.json({ message: 'Failed to fetch history.' }, { status: 500 });
    }

    // 格式化返回数据
    const formattedGenerations = generations.map((gen: any) => ({
      id: gen.id,
      jobId: gen.job_id,
      generationMode: gen.generation_mode,
      selectedModel: gen.selected_model,
      textPrompt: gen.text_prompt,
      imageUrl: gen.image_url,
      imagePrompt: gen.image_prompt,
      videoUrl: gen.video_url, // 🎯 关键字段：视频URL
      status: gen.status,
      creditsUsed: gen.credits_used,
      errorMessage: gen.error_message,
      createdAt: gen.created_at,
      completedAt: gen.completed_at
    }));

    return NextResponse.json({
      generations: formattedGenerations,
      total: formattedGenerations.length,
      hasMore: formattedGenerations.length === limit
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Seedance History API] Error:', errorMessage);
    return NextResponse.json({ 
      message: 'Internal Server Error.', 
      error: errorMessage 
    }, { status: 500 });
  }
}
