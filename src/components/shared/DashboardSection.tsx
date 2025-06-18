'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from './DashboardSiderbar';
import DashboardClient from '../ai-baby-podcast/DashboardClient';
import AIBabyGeneratorClient from '../ai-baby-generator/AIBabyGeneratorClient';

interface DashboardSectionProps {
  type: 'ai-baby-podcast' | 'ai-baby-generator' | 'veo-3-generator';
  title: string;
}

export default function DashboardSection({ type, title }: DashboardSectionProps) {
  const [user, setUser] = useState<any>(null);
  const [currentCredits, setCurrentCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      setUser(user); // 设置用户状态，无论是否登录

      // 如果用户已登录，获取积分信息
      if (user && !error) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('credits')
            .eq('user_id', user.id)
            .single();

          if (profileError) {
            console.warn("Error fetching user profile for credits or profile doesn't exist:", profileError.message);
            setCurrentCredits(0);
          } else if (profile) {
            setCurrentCredits(profile.credits || 0);
          } else {
            console.warn("User profile not found for user_id:", user.id, ". Defaulting credits to 0.");
            setCurrentCredits(0);
          }
        } catch (error) {
          console.error("Error fetching user credits:", error);
          setCurrentCredits(0);
        }
      } else {
        // 用户未登录，设置默认积分为0
        setCurrentCredits(0);
      }

      setLoading(false);
    };

    checkUser();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 移除登录检查，允许所有用户访问页面

  const renderDashboardContent = () => {
    switch (type) {
      case 'ai-baby-podcast':
        return <DashboardClient currentCredits={currentCredits || 0} />;
      
      case 'ai-baby-generator':
        return <AIBabyGeneratorClient currentCredits={currentCredits || 0} />;
      
      case 'veo-3-generator':
        return (
          <div className="bg-gray-800/90 border border-gray-600 rounded-2xl p-8 shadow-lg backdrop-blur-md">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-700">
                <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Coming Soon
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                We're bringing Google's revolutionary Veo 3 AI video generation technology with native audio capabilities.
                Create high-quality videos with synchronized sound effects, dialogue, and ambient noise.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-700/60 border border-gray-600 rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-700">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Native Audio</h3>
                  <p className="text-gray-300 text-sm">
                    Generate videos with synchronized audio, sound effects, and dialogue
                  </p>
                </div>

                <div className="bg-gray-700/60 border border-gray-600 rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-700">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Camera Controls</h3>
                  <p className="text-gray-300 text-sm">
                    Advanced camera movements with pans, zooms, and angle changes
                  </p>
                </div>

                <div className="bg-gray-700/60 border border-gray-600 rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-700">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Consistent Characters</h3>
                  <p className="text-gray-300 text-sm">
                    Maintain character consistency across multiple video clips
                  </p>
                </div>

                <div className="bg-gray-700/60 border border-gray-600 rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-700">
                    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Physics Simulation</h3>
                  <p className="text-gray-300 text-sm">
                    Realistic physics for natural motion and environmental effects
                  </p>
                </div>

                <div className="bg-gray-700/60 border border-gray-600 rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-yellow-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-700">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Prompt Understanding</h3>
                  <p className="text-gray-300 text-sm">
                    Advanced AI that interprets complex narrative prompts accurately
                  </p>
                </div>

                <div className="bg-gray-700/60 border border-gray-600 rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-700">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Flow Integration</h3>
                  <p className="text-gray-300 text-sm">
                    Seamless integration with Google's Flow AI filmmaking tool
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <button
                  disabled
                  className="bg-gray-600 text-gray-400 font-medium px-8 py-3 rounded-full cursor-not-allowed border border-gray-500"
                >
                  Coming Soon
                </button>
                <p className="text-gray-400 text-sm mt-2">
                  This revolutionary feature is currently under development
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <section id="dashboard" className="py-16 bg-gray-900">
      <div className="relative flex min-h-screen">
        {/* 侧边栏 - 固定在左侧 */}
        <div className="relative z-10">
          <DashboardSidebar />
        </div>

        {/* 主要内容区域 - 始终在sidebar右边，不被遮挡 */}
        <main className="relative z-10 flex-1 overflow-y-auto p-6 ml-64 min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold mb-8 text-white drop-shadow-lg bg-gray-800/80 px-6 py-2 rounded-xl inline-block border border-gray-600 backdrop-blur-md">
              {title}
            </h2>
            {renderDashboardContent()}
          </div>
        </main>
      </div>
    </section>
  );
}
