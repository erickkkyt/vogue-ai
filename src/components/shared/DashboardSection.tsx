'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from './DashboardSiderbar';
import DashboardClient from '../ai-baby-podcast/DashboardClient';
import AIBabyGeneratorClient from '../ai-baby-generator/AIBabyGeneratorClient';
import Veo3GeneratorClient from '../veo-3-generator/Veo3GeneratorClient';
import HailuoGeneratorClient from '../hailuo-generator/HailuoGeneratorClient';
import EarthZoomGeneratorClient from '../effect/EarthZoomGeneratorClient';

interface DashboardSectionProps {
  type: 'ai-baby-podcast' | 'ai-baby-generator' | 'veo-3-generator' | 'hailuo-generator' | 'earth-zoom';
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
        return <Veo3GeneratorClient currentCredits={currentCredits || 0} />;

      case 'hailuo-generator':
        return <HailuoGeneratorClient currentCredits={currentCredits || 0} />;

      case 'earth-zoom':
        return <EarthZoomGeneratorClient currentCredits={currentCredits || 0} />;

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
            <div className="max-w-4xl mx-auto mb-8 ml-8">
              <h2 className="text-3xl font-extrabold text-white drop-shadow-lg bg-gray-800/80 px-6 py-2 rounded-xl border border-gray-600 backdrop-blur-md inline-block">
                {title}
              </h2>
            </div>
            {renderDashboardContent()}
          </div>
        </main>
      </div>
    </section>
  );
}
