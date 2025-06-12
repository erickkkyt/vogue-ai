import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import DashboardSidebar from '@/components/DashboardSiderbar';
import ProjectsClient from '@/components/ProjectsClient'; // Make sure this component is created later
import type { Project } from '@/types/project'; // We'll define this type

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
    // Optionally, pass error information to the client component
  }
  
  const projects: Project[] = projectsData || [];
  if (projects) {
    console.log(`[ProjectsPage] Fetched ${projects.length} projects.`);
  }

  return (
    <div className="relative flex h-screen">
      {/* 侧边栏 */}
      <div className="relative z-10">
        <DashboardSidebar />
      </div>

      {/* 主要内容区域 */}
      <main className="relative z-10 flex-1 overflow-y-auto p-6 md:ml-64"> {/* Adjusted ml for larger screens, check sidebar width */}
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800 drop-shadow-lg bg-white/70 px-6 py-2 rounded-xl inline-block" style={{textShadow: '0 2px 8px #fff9e5, 0 1px 0 #fff'}}>My Projects</h1>
        <ProjectsClient projects={projects} />
      </main>
    </div>
  );
} 