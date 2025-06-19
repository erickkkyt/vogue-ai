import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import DashboardSidebar from '@/components/shared/DashboardSiderbar';
import ProjectsClient from '@/components/shared/ProjectsClient'; // Make sure this component is created later
import type { Project, BabyGeneration, ProjectItem } from '@/types/project'; // We'll define this type

export default async function ProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Auth Error or No User on ProjectsPage, redirecting to login:', authError?.message);
    const message = 'Please log in to access your projects.';
    redirect(`/login?message=${encodeURIComponent(message)}`);
    // For server components, redirect() should halt execution.
    // If not, you might need to return null or throw an error from next/navigation.
  }

  // Fetch projects for the current user
  console.log(`[ProjectsPage] Fetching projects for user: ${user.id}`);
  const { data: projectsData, error: projectsError } = await supabase
    .from('projects')
    .select('*') // Select all columns, or specify needed ones
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (projectsError) {
    console.error('[ProjectsPage] Error fetching projects:', projectsError.message);
  }

  // Fetch baby generations for the current user
  console.log(`[ProjectsPage] Fetching baby generations for user: ${user.id}`);
  const { data: babyGenerationsData, error: babyGenerationsError } = await supabase
    .from('baby_generations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (babyGenerationsError) {
    console.error('[ProjectsPage] Error fetching baby generations:', babyGenerationsError.message);
  }

  // Fetch veo3 generations for the current user
  console.log(`[ProjectsPage] Fetching veo3 generations for user: ${user.id}`);
  const { data: veo3GenerationsData, error: veo3GenerationsError } = await supabase
    .from('veo3_generations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (veo3GenerationsError) {
    console.error('[ProjectsPage] Error fetching veo3 generations:', veo3GenerationsError.message);
  }

  // Combine and transform data
  const projects: Project[] = projectsData || [];
  const babyGenerations: BabyGeneration[] = babyGenerationsData || [];
  const veo3Generations = veo3GenerationsData || [];

  // Convert to unified ProjectItem format
  const projectItems: ProjectItem[] = [
    // Convert projects
    ...projects.map((project): ProjectItem => ({
      id: project.id,
      type: 'project' as const,
      created_at: project.created_at,
      status: project.status,
      credits_used: project.credits_used,
      topic: project.topic,
      ethnicity: project.ethnicity,
      hair: project.hair,
      video_url: project.video_url,
      duration: project.duration,
    })),
    // Convert baby generations
    ...babyGenerations.map((babyGen): ProjectItem => ({
      id: babyGen.id,
      type: 'baby_generation' as const,
      created_at: babyGen.created_at,
      status: babyGen.status,
      credits_used: babyGen.credits_used,
      baby_gender: babyGen.baby_gender,
      generated_baby_url: babyGen.generated_baby_url,
      father_image_url: babyGen.father_image_url,
      mother_image_url: babyGen.mother_image_url,
    })),
    // Convert veo3 generations
    ...veo3Generations.map((veo3Gen): ProjectItem => ({
      id: veo3Gen.id,
      type: 'veo3_generation' as const,
      created_at: veo3Gen.created_at,
      status: veo3Gen.status,
      credits_used: veo3Gen.credits_used,
      generation_mode: veo3Gen.generation_mode,
      selected_model: veo3Gen.selected_model,
      text_prompt: veo3Gen.text_prompt,
      image_prompt: veo3Gen.image_prompt,
      video_url: veo3Gen.video_url,
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  console.log(`[ProjectsPage] Fetched ${projects.length} projects, ${babyGenerations.length} baby generations, and ${veo3Generations.length} veo3 generations.`);
  console.log(`[ProjectsPage] Total combined items: ${projectItems.length}`);

  return (
    <div className="relative flex h-screen">
      {/* 侧边栏 */}
      <div className="relative z-10">
        <DashboardSidebar />
      </div>

      {/* 主要内容区域 */}
      <main className="relative z-10 flex-1 overflow-y-auto p-6 md:ml-64"> {/* Adjusted ml for larger screens, check sidebar width */}
        <h1 className="text-3xl font-extrabold mb-8 text-white drop-shadow-lg bg-gray-800/80 px-6 py-2 rounded-xl inline-block border border-gray-600 backdrop-blur-md">My Projects</h1>
        <ProjectsClient projects={projectItems} />
      </main>
    </div>
  );
} 