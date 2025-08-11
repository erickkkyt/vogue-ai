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

    // 查询LipSync生成状态
    const { data: generation, error: queryError } = await supabase
      .from('lipsync_generations')
      .select(`
        id, 
        job_id, 
        status, 
        generated_video_url, 
        error_message, 
        audio_input_mode,
        voice_id,
        estimated_duration_seconds,
        video_resolution,
        aspect_ratio,
        credits_used,
        created_at, 
        completed_at
      `)
      .eq('job_id', jobId)
      .eq('user_id', user.id)
      .single();

    if (queryError || !generation) {
      console.error('[LipSync Status API] Query error or generation not found:', queryError);
      return NextResponse.json({ message: 'Generation not found.' }, { status: 404 });
    }

    return NextResponse.json({
      jobId: generation.job_id,
      status: generation.status,
      videoUrl: generation.generated_video_url,
      errorMessage: generation.error_message,
      audioInputMode: generation.audio_input_mode,
      voiceId: generation.voice_id,
      estimatedDurationSeconds: generation.estimated_duration_seconds,
      videoResolution: generation.video_resolution,
      aspectRatio: generation.aspect_ratio,
      creditsUsed: generation.credits_used,
      createdAt: generation.created_at,
      completedAt: generation.completed_at
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[LipSync Status API] Error:', errorMessage);
    return NextResponse.json({ 
      message: 'Internal Server Error.', 
      error: errorMessage 
    }, { status: 500 });
  }
}
