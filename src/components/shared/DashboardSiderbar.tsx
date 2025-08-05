'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import { LayoutDashboard, LogOut, Zap, Layers, Home as HomeIcon, Mail, X, Mic, Heart, Sparkles, ChevronDown, Palette, Video, Smile, Music } from 'lucide-react';
import Portal from '../common/Portal';

// Define a type for the profile to expect `credits`
interface UserProfile {
  credits: number;
  // Add other profile fields if needed
}

export default function DashboardSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number>(0); // Initialize credits to 0
  const [currentTool, setCurrentTool] = useState<'podcast' | 'generator' | 'kontext' | 'hailuo' | 'effect' | 'seedance' | 'lipsync'>('generator');

  const [isContactModalOpen, setIsContactModalOpen] = useState(false); // State for contact modal
  const [currentPage, setCurrentPage] = useState<string>('');
  const supabase = createClient();

  useEffect(() => {
    const currentPathname = window.location.pathname;

    // 设置当前页面
    setCurrentPage(currentPathname);

    // 确定当前工具
    if (currentPathname.includes('/ai-baby-podcast')) {
      setCurrentTool('podcast');
    } else if (currentPathname.includes('/ai-baby-generator')) {
      setCurrentTool('generator');
    } else if (currentPathname.includes('/veo-3-generator')) {
      setCurrentTool('kontext');
    } else if (currentPathname.includes('/hailuo-ai-video-generator')) {
      setCurrentTool('hailuo');
    } else if (currentPathname.includes('/effect')) {
      setCurrentTool('effect');
    } else if (currentPathname.includes('/seedance')) {
      setCurrentTool('seedance');
    } else if (currentPathname.includes('/lipsync')) {
      setCurrentTool('lipsync');
    } else {
      setCurrentTool('generator'); // 默认为 generator
    }

    const getUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
        if (currentUser) {
          // Fetch credits if user exists
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('credits')
            .eq('user_id', currentUser.id)
            .single();

          if (profileError) {
            console.warn("Error fetching user profile for credits or profile doesn't exist:", profileError.message);
            setCredits(0); // Default to 0 if profile not found or error
          } else if (profile) {
            setCredits((profile as UserProfile).credits);
          } else {
            // This case might happen if the user exists in auth.users but not in user_profiles yet
            console.warn("User profile not found for user_id:", currentUser.id, ". Defaulting credits to 0.");
            setCredits(0);
          }
        } else {
          setCredits(0); // No user, no credits
        }
      } catch (error) {
        console.error("Error fetching user in Sidebar:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        // Re-fetch credits on auth change if user is present
        const fetchUserCredits = async () => {
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('credits')
            .eq('user_id', session.user.id)
            .single();

          if (profileError) {
            console.warn("Error fetching user profile for credits on auth change or profile doesn't exist:", profileError.message);
            setCredits(0);
          } else if (profile) {
            setCredits((profile as UserProfile).credits);
          } else {
            console.warn("User profile not found for user_id (on auth change):", session.user.id, ". Defaulting credits to 0.");
            setCredits(0);
          }
        };
        fetchUserCredits();
      } else {
        setCredits(0); // Clear credits if user signs out
      }
      // 移除自动重定向到登录页面，允许用户继续浏览页面
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Listen to supabase client changes if any

  // 监听路由变化来更新当前页面状态
  useEffect(() => {
    const handleRouteChange = () => {
      const currentPathname = window.location.pathname;
      setCurrentPage(currentPathname);

      // 更新当前工具
      if (currentPathname.includes('/ai-baby-podcast')) {
        setCurrentTool('podcast');
      } else if (currentPathname.includes('/ai-baby-generator')) {
        setCurrentTool('generator');
      } else if (currentPathname.includes('/veo-3-generator')) {
        setCurrentTool('kontext');
      } else if (currentPathname.includes('/hailuo-ai-video-generator')) {
        setCurrentTool('hailuo');
      } else if (currentPathname.includes('/effect')) {
        setCurrentTool('effect');
      } else if (currentPathname.includes('/seedance')) {
        setCurrentTool('seedance');
      } else if (currentPathname.includes('/lipsync')) {
        setCurrentTool('lipsync');
      } else {
        setCurrentTool('generator');
      }
    };

    // 监听浏览器的前进后退按钮
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);



  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className="w-64 bg-gray-900/95 text-gray-300 p-6 flex flex-col justify-between h-screen border-r border-gray-700 rounded-r-2xl fixed left-0 top-0 backdrop-blur-md shadow-lg z-40">
      <div className="space-y-6">
        {/* Logo and Brand Name */}
        <div className="flex items-center space-x-2 p-2">
          <Link href="/" className="flex items-center space-x-2 whitespace-nowrap">
            <Layers size={28} className="text-purple-400" />
            <h1 className="text-lg font-semibold text-white">AI Creative Suite</h1>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav>
          <div className="space-y-1 mb-6">
            <Link
              href="/"
              className="flex items-center space-x-2.5 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-gray-300 hover:bg-purple-600/20 hover:text-purple-300 text-sm group"
            >
              <HomeIcon size={16} className="group-hover:text-purple-400" />
              <span className="font-medium">Home</span>
            </Link>
            <Link
              href="/effect"
              className={`flex items-center space-x-2.5 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-sm group ${
                currentPage === '/effect'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-purple-600/20 hover:text-purple-300'
              }`}
            >
              <Palette size={16} className={currentPage === '/effect' ? 'text-white' : 'group-hover:text-purple-400'} />
              <span className="font-medium">Effects</span>
            </Link>
          </div>
        </nav>

        {/* Section Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* AI Tools Categories */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium text-gray-400 mb-2 px-2 uppercase tracking-wider">AI Tools</h3>

          {/* AI Model Category */}
          <div className="space-y-1">
            <div className="px-2 py-1">
              <h4 className="text-sm font-semibold text-gray-300 tracking-wide">AI Model</h4>
            </div>
            <div className="space-y-1 ml-2">
              <Link
                href="/veo-3-generator"
                className={`flex items-center space-x-2.5 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-sm group ${
                  currentTool === 'kontext'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-purple-600/20 hover:text-purple-300'
                }`}
              >
                <Sparkles size={16} className={currentTool === 'kontext' ? 'text-white' : 'group-hover:text-purple-400'} />
                <span className="font-medium">Veo 3 Generator</span>
              </Link>
              <Link
                href="/hailuo-ai-video-generator"
                className={`flex items-center space-x-2.5 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-sm group ${
                  currentTool === 'hailuo'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-purple-600/20 hover:text-purple-300'
                }`}
              >
                <Zap size={16} className={currentTool === 'hailuo' ? 'text-white' : 'group-hover:text-purple-400'} />
                <span className="font-medium">Hailuo AI Generator</span>
              </Link>
              <Link
                href="/seedance"
                className={`flex items-center space-x-2.5 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-sm group ${
                  currentTool === 'seedance'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-purple-600/20 hover:text-purple-300'
                }`}
              >
                <Video size={16} className={currentTool === 'seedance' ? 'text-white' : 'group-hover:text-purple-400'} />
                <span className="font-medium">Seedance Generator</span>
              </Link>
            </div>
          </div>

          {/* AI Effect Category */}
          <div className="space-y-1">
            <div className="px-2 py-1">
              <h4 className="text-sm font-semibold text-gray-300 tracking-wide">AI Effect</h4>
            </div>
            <div className="space-y-1 ml-2">
              <Link
                href="/ai-baby-generator"
                className={`flex items-center space-x-2.5 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-sm group ${
                  currentTool === 'generator'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-purple-600/20 hover:text-purple-300'
                }`}
              >
                <Heart size={16} className={currentTool === 'generator' ? 'text-white' : 'group-hover:text-purple-400'} />
                <span className="font-medium">AI Baby Generator</span>
              </Link>
              <Link
                href="/ai-baby-podcast"
                className={`flex items-center space-x-2.5 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-sm group ${
                  currentTool === 'podcast'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-purple-600/20 hover:text-purple-300'
                }`}
              >
                <Mic size={16} className={currentTool === 'podcast' ? 'text-white' : 'group-hover:text-purple-400'} />
                <span className="font-medium">AI Baby Podcast</span>
              </Link>
              <Link
                href="/effect/earth-zoom"
                className={`flex items-center space-x-2.5 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-sm group ${
                  currentPage.includes('/effect/earth-zoom')
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-purple-600/20 hover:text-purple-300'
                }`}
              >
                <Zap size={16} className={currentPage.includes('/effect/earth-zoom') ? 'text-white' : 'group-hover:text-purple-400'} />
                <span className="font-medium">AI Earth Zoom</span>
              </Link>

            </div>
          </div>

          {/* LipSync Category */}
          <div className="space-y-1">
            <div className="px-2 py-1">
              <h4 className="text-sm font-semibold text-gray-300 tracking-wide">LipSync</h4>
            </div>
            <div className="space-y-1 ml-2">
              <Link
                href="/lipsync"
                className={`flex items-center space-x-2.5 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-sm group ${
                  currentTool === 'lipsync'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-purple-600/20 hover:text-purple-300'
                }`}
              >
                <Smile size={16} className={currentTool === 'lipsync' ? 'text-white' : 'group-hover:text-purple-400'} />
                <span className="font-medium">LipSync Generator</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Navigation Links */}
        <nav>
          <h3 className="text-xs font-medium text-gray-400 mb-2 px-2 uppercase tracking-wider">Navigation</h3>
          <div className="space-y-1">
            <Link
              href="/projects"
              className={`flex items-center space-x-2.5 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-sm group ${
                currentPage.includes('/projects')
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-purple-600/20 hover:text-purple-300'
              }`}
            >
              <LayoutDashboard size={16} className={currentPage.includes('/projects') ? 'text-white' : 'group-hover:text-purple-400'} />
              <span className="font-medium">Projects</span>
            </Link>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex items-center space-x-2.5 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-gray-300 hover:bg-purple-600/20 hover:text-purple-300 w-full text-left text-sm group"
            >
              <Mail size={16} className="group-hover:text-purple-400" />
              <span className="font-medium">Contact</span>
            </button>
          </div>
        </nav>

        {/* Credit Info */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl border border-gray-600 shadow-sm mt-4">
            <div className="flex items-center justify-between mb-3">
                <span className="flex items-center font-medium text-yellow-300 text-sm">
                  <Zap size={16} className="mr-2 text-yellow-400"/>
                  Credits
                </span>
                <span className="font-bold text-yellow-200 text-lg">{loading ? '...' : credits}</span>
            </div>
            <Link href="/pricing" className="block w-full border-2 border-purple-600 hover:border-purple-500 bg-transparent hover:bg-purple-600/10 text-white text-center py-2.5 rounded-lg text-xs font-medium transition-all duration-200">
                Upgrade Plan
            </Link>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Contact Creator Modal - Now wrapped in Portal */}
      {isContactModalOpen && (
        <Portal>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-xl max-w-md w-full relative">
              <button 
                onClick={() => setIsContactModalOpen(false)} 
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              <div className="flex items-center mb-4">
                <Mail size={24} className="text-purple-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">Contact Creator</h2>
              </div>
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                Have questions, feedback, or need assistance? I&rsquo;m here to help! Please feel free to reach out, and I&rsquo;ll do my best to address your concerns promptly and patiently.
              </p>
              <p className="text-slate-300 text-sm mb-6">
                You can reach me at: <a href="mailto:support@vogueai.net" className="text-purple-400 hover:underline">support@vogueai.net</a>
              </p>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </Portal>
      )}
    </aside>
  );
}