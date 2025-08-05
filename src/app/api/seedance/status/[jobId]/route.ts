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

    // 验证用户身份
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    // 查询生成状态
    const { data: generation, error: queryError } = await supabase
      .from('seedance_generations')
      .select(`
        id, 
        job_id, 
        external_task_id,
        status, 
        video_url, 
        error_message, 
        generation_mode,
        selected_model,
        aspect_ratio,
        resolution,
        duration,
        text_prompt,
        image_prompt,
        credits_used,
        created_at, 
        completed_at
      `)
      .eq('job_id', jobId)
      .eq('user_id', user.id)
      .single();

    if (queryError || !generation) {
      console.error('[Seedance Status API] Query error or generation not found:', queryError);
      return NextResponse.json({ message: 'Generation not found.' }, { status: 404 });
    }

    return NextResponse.json({
      jobId: generation.job_id,
      id: generation.external_task_id, // 火山引擎任务ID
      status: generation.status,
      videoUrl: generation.video_url,
      errorMessage: generation.error_message,
      generationMode: generation.generation_mode,
      selectedModel: generation.selected_model,
      aspectRatio: generation.aspect_ratio,
      resolution: generation.resolution,
      duration: generation.duration,
      textPrompt: generation.text_prompt,
      imagePrompt: generation.image_prompt,
      creditsUsed: generation.credits_used,
      createdAt: generation.created_at,
      completedAt: generation.completed_at
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Seedance Status API] Error:', errorMessage);
    return NextResponse.json({ 
      message: 'Internal Server Error.', 
      error: errorMessage 
    }, { status: 500 });
  }
}
