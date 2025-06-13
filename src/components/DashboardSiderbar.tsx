'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import { LayoutDashboard, LogOut, Zap, Layers, Home as HomeIcon, Mail, X, Mic, Heart, Sparkles, ChevronDown } from 'lucide-react';
import Portal from './Portal';

// Define a type for the profile to expect `credits`
interface UserProfile {
  credits: number;
  // Add other profile fields if needed
}

export default function DashboardSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number>(0); // Initialize credits to 0
  const [currentTool, setCurrentTool] = useState<'podcast' | 'generator' | 'kontext'>('generator');
  const [isToolDropdownOpen, setIsToolDropdownOpen] = useState(false);
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
    } else if (currentPathname.includes('/face-to-many-kontext')) {
      setCurrentTool('kontext');
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
      } else if (currentPathname.includes('/face-to-many-kontext')) {
        setCurrentTool('kontext');
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

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.tool-dropdown')) {
        setIsToolDropdownOpen(false);
      }
    };

    if (isToolDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isToolDropdownOpen]);

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

        {/* AI工具下拉选择器 */}
        <div>
          <h3 className="text-xs font-medium text-gray-400 mb-2 px-2 uppercase tracking-wider">Current AI Tool</h3>
          <div className="relative tool-dropdown">
            <button
              onClick={() => setIsToolDropdownOpen(!isToolDropdownOpen)}
              className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-sm ${
                currentPage.includes('/projects')
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : currentTool === 'generator'
                  ? 'bg-purple-600 text-white shadow-md'
                  : currentTool === 'podcast'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-green-600 text-white shadow-md'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {currentTool === 'podcast' && <Mic size={16} />}
                {currentTool === 'generator' && <Heart size={16} />}
                {currentTool === 'kontext' && <Sparkles size={16} />}
                <span className="font-medium">
                  {currentTool === 'podcast' && 'AI Baby Podcast'}
                  {currentTool === 'generator' && 'AI Baby Generator'}
                  {currentTool === 'kontext' && 'Face-to-Many-Kontext'}
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isToolDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* 下拉菜单 */}
            {isToolDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-600/30 z-50">
                <Link
                  href="/ai-baby-generator"
                  onClick={() => setIsToolDropdownOpen(false)}
                  className={`flex items-center space-x-3 py-2.5 px-3 hover:bg-purple-600/20 transition-colors text-sm ${
                    currentTool === 'generator' ? 'bg-purple-600/20 text-purple-300' : 'text-gray-300'
                  }`}
                >
                  <Heart size={16} />
                  <div>
                    <div className="font-medium">AI Baby Generator</div>
                    <div className="text-xs text-gray-400">Generate baby images</div>
                  </div>
                </Link>
                <Link
                  href="/ai-baby-podcast"
                  onClick={() => setIsToolDropdownOpen(false)}
                  className={`flex items-center space-x-3 py-2.5 px-3 hover:bg-blue-600/20 transition-colors text-sm ${
                    currentTool === 'podcast' ? 'bg-blue-600/20 text-blue-300' : 'text-gray-300'
                  }`}
                >
                  <Mic size={16} />
                  <div>
                    <div className="font-medium">AI Baby Podcast</div>
                    <div className="text-xs text-gray-400">Create viral podcast videos</div>
                  </div>
                </Link>
                <Link
                  href="/face-to-many-kontext"
                  onClick={() => setIsToolDropdownOpen(false)}
                  className={`flex items-center space-x-3 py-2.5 px-3 hover:bg-green-600/20 transition-colors rounded-b-lg text-sm ${
                    currentTool === 'kontext' ? 'bg-green-600/20 text-green-300' : 'text-gray-300'
                  }`}
                >
                  <Sparkles size={16} />
                  <div>
                    <div className="font-medium">Face-to-Many-Kontext</div>
                    <div className="text-xs text-gray-400">Transform faces</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav>
          <h3 className="text-xs font-medium text-gray-400 mb-2 px-2 uppercase tracking-wider">Navigation</h3>
          <div className="space-y-1">
            <Link
              href="/projects"
              className={`flex items-center space-x-2.5 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-sm group ${
                currentPage.includes('/projects')
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-yellow-600/20 hover:text-yellow-300'
              }`}
            >
              <LayoutDashboard size={16} className={currentPage.includes('/projects') ? 'text-white' : 'group-hover:text-yellow-400'} />
              <span className="font-medium">Projects</span>
            </Link>
          </div>
        </nav>

        {/* Quick Links */}
        <nav>
          <h3 className="text-xs font-medium text-gray-400 mb-2 px-2 uppercase tracking-wider">Quick Links</h3>
          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center space-x-2.5 py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out text-gray-300 hover:bg-blue-600/20 hover:text-blue-300 text-sm group"
            >
              <HomeIcon size={16} className="group-hover:text-blue-400" />
              <span className="font-medium">Home</span>
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
      </div>

      <div className="space-y-4">
        {/* Credit Info */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl border border-gray-600 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <span className="flex items-center font-medium text-yellow-300 text-sm">
                  <Zap size={16} className="mr-2 text-yellow-400"/>
                  Credits
                </span>
                <span className="font-bold text-yellow-200 text-lg">{loading ? '...' : credits}</span>
            </div>
            <Link href="/pricing" className="block w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white text-center py-2.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                Upgrade Plan
            </Link>
        </div>

        {/* Notification Link -  REMOVED AND REPLACED BY CONTACT CREATOR BUTTON ABOVE */}
        {/* <button ... Contact Creator button was here ... /> */}

        {/* User Info and Sign Out */}
        {loading ? (
          <div className="h-12 bg-gray-700 animate-pulse rounded-lg"></div>
        ) : user ? (
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600">
            <div className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <span className="text-sm font-medium text-gray-300 block truncate">
                  {user.email?.split('@')[0]}
                </span>
                <span className="text-xs text-gray-400">Signed in</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        ) : (
          <Link href="/login" className="block w-full text-center p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-sm font-medium text-white transition-all duration-200 shadow-sm hover:shadow-md">
            Sign In
          </Link>
        )}
      </div>

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
                You can reach me at: <a href="mailto:support@babypodcast.pro" className="text-purple-400 hover:underline">support@babypodcast.pro</a>
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