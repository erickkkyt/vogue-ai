'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from './DashboardSiderbar';
import DashboardClient from '../ai-baby-podcast/DashboardClient';
import AIBabyGeneratorClient from '../ai-baby-generator/AIBabyGeneratorClient';

interface DashboardSectionProps {
  type: 'ai-baby-podcast' | 'ai-baby-generator' | 'face-to-many-kontext';
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
      
      case 'face-to-many-kontext':
        return (
          <div className="bg-gray-800/90 border border-gray-600 rounded-2xl p-8 shadow-lg backdrop-blur-md">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-700">
                <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 716.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Coming Soon
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                We're developing revolutionary face transformation technology that will allow you to transform any face
                into multiple contexts, styles, and scenarios with unprecedented realism.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-700/60 border border-gray-600 rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-700">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3M7 4H5a1 1 0 00-1 1v3m0 0v8a1 1 0 001 1h3M7 4h10M5 8h14M5 8V5a1 1 0 011-1h2a1 1 0 011 1v3" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Style Transfer</h3>
                  <p className="text-gray-300 text-sm">
                    Transform faces into artistic styles and visual effects
                  </p>
                </div>

                <div className="bg-gray-700/60 border border-gray-600 rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-700">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Age Progression</h3>
                  <p className="text-gray-300 text-sm">
                    See faces at different ages with realistic aging effects
                  </p>
                </div>

                <div className="bg-gray-700/60 border border-gray-600 rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-700">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Context Adaptation</h3>
                  <p className="text-gray-300 text-sm">
                    Adapt faces to different environments and scenarios
                  </p>
                </div>

                <div className="bg-gray-700/60 border border-gray-600 rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-700">
                    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Expression Control</h3>
                  <p className="text-gray-300 text-sm">
                    Control facial expressions and emotional states
                  </p>
                </div>

                <div className="bg-gray-700/60 border border-gray-600 rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-yellow-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-700">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Lighting Effects</h3>
                  <p className="text-gray-300 text-sm">
                    Apply professional lighting and atmospheric effects
                  </p>
                </div>

                <div className="bg-gray-700/60 border border-gray-600 rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-700">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Batch Processing</h3>
                  <p className="text-gray-300 text-sm">
                    Process multiple faces and apply transformations in bulk
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
            <h1 className="text-3xl font-extrabold mb-8 text-white drop-shadow-lg bg-gray-800/80 px-6 py-2 rounded-xl inline-block border border-gray-600 backdrop-blur-md">
              {title}
            </h1>
            {renderDashboardContent()}
          </div>
        </main>
      </div>
    </section>
  );
}
