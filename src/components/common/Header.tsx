'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // 导入浏览器客户端
import { type User } from '@supabase/supabase-js'; // 导入 Supabase User 类型
import StarBorder from './StarBorder';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiModelDropdownOpen, setAiModelDropdownOpen] = useState(false);
  const [aiEffectDropdownOpen, setAiEffectDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const supabase = createClient(); // 创建客户端实例

  // 生成带有来源信息的登录链接
  const getLoginUrl = () => {
    // 如果当前在特定工具页面，传递next参数
    if (pathname.startsWith('/ai-baby-generator')) {
      return `/login?next=${encodeURIComponent('/ai-baby-generator')}`;
    }
    if (pathname.startsWith('/ai-baby-podcast')) {
      return `/login?next=${encodeURIComponent('/ai-baby-podcast')}`;
    }
    if (pathname.startsWith('/veo-3-generator')) {
      return `/login?next=${encodeURIComponent('/veo-3-generator')}`;
    }
    if (pathname.startsWith('/hailuo-ai-video-generator')) {
      return `/login?next=${encodeURIComponent('/hailuo-ai-video-generator')}`;
    }
    if (pathname.startsWith('/seedance')) {
      return `/login?next=${encodeURIComponent('/seedance')}`;
    }
    if (pathname.startsWith('/lipsync')) {
      return `/login?next=${encodeURIComponent('/lipsync')}`;
    }
    if (pathname.startsWith('/effect')) {
      return `/login?next=${encodeURIComponent(pathname)}`;
    }
    // 其他页面默认重定向到首页
    return '/login';
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user in Header:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // 监听认证状态变化，以便在登录/登出后更新 Header
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };

  }, [supabase]); // 依赖 supabase 实例

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // onAuthStateChange 会自动处理 setUser(null)
    // 可能需要 router.push('/')，但这通常在 AuthContext 或 Server Action 中处理
    setMobileMenuOpen(false); // 关闭移动菜单
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Fixed to left */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              {/* Brand Logo */}
              <div className="relative">
                <img
                  className="h-8 w-auto"
                  src="/logo/logo.png"
                  alt="VOGUE AI Logo"
                />
              </div>
              <span className="text-xl font-bold text-white">VOGUE AI</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {/* AI Model Dropdown */}
            <div className="relative group" onMouseLeave={() => setAiModelDropdownOpen(false)}>
              <button
                onMouseEnter={() => setAiModelDropdownOpen(true)}
                className="flex items-center text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200 py-2 px-1"
              >
                <span className="tracking-wide">AI Model</span>
                <svg className="ml-2 h-3 w-3 text-gray-400 group-hover:text-gray-300 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {aiModelDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-gray-900/95 backdrop-blur-md border border-gray-700/50 shadow-2xl ring-1 ring-white/5 z-50"
                  onMouseEnter={() => setAiModelDropdownOpen(true)}
                  onMouseLeave={() => setAiModelDropdownOpen(false)}
                >
                  <div className="p-2">
                    <Link
                      href="/veo-3-generator"
                      className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-all duration-200"
                    >
                      Veo3
                    </Link>
                    <Link
                      href="/hailuo-ai-video-generator"
                      className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-all duration-200"
                    >
                      Hailuo AI
                    </Link>
                    <Link
                      href="/seedance"
                      className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-all duration-200"
                    >
                      Seedance
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* AI Effect Dropdown */}
            <div className="relative group" onMouseLeave={() => setAiEffectDropdownOpen(false)}>
              <button
                onMouseEnter={() => setAiEffectDropdownOpen(true)}
                className="flex items-center text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200 py-2 px-1"
              >
                <span className="tracking-wide">AI Effect</span>
                <svg className="ml-2 h-3 w-3 text-gray-400 group-hover:text-gray-300 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {aiEffectDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-gray-900/95 backdrop-blur-md border border-gray-700/50 shadow-2xl ring-1 ring-white/5 z-50"
                  onMouseEnter={() => setAiEffectDropdownOpen(true)}
                  onMouseLeave={() => setAiEffectDropdownOpen(false)}
                >
                  <div className="p-2">
                    <Link
                      href="/ai-baby-generator"
                      className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-all duration-200"
                    >
                      AI Baby Generator
                    </Link>
                    <Link
                      href="/ai-baby-podcast"
                      className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-all duration-200"
                    >
                      AI Baby Podcast
                    </Link>
                    <Link
                      href="/effect/earth-zoom"
                      className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-all duration-200"
                    >
                      Earth Zoom
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* LipSync - Direct Link */}
            <Link
              href="/lipsync"
              className="flex items-center text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200 py-2 px-1 group"
            >
              <span className="tracking-wide">LipSync</span>
              <div className="ml-2 w-1.5 h-1.5 bg-gradient-to-br from-pink-500 to-red-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
            </Link>

            <Link href="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Blog
            </Link>
          </nav>

          {/* User specific actions */}
          <div className="hidden md:flex items-center space-x-3 ml-auto">
            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded-full bg-gray-600"></div>
            ) : user ? (
              <div className="relative group">
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white shadow-sm ring-2 ring-offset-2 ring-offset-gray-900 ring-transparent transition-all group-hover:ring-blue-400">
                  {user.email?.charAt(0).toUpperCase()}
                </button>
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-gray-600 ring-opacity-50 focus:outline-none hidden group-hover:block z-50">
                  <div className="border-b border-gray-600 px-3 py-2">
                    <p className="text-xs font-medium text-gray-300">Signed in as</p>
                    <p className="truncate text-xs text-gray-400">{user.email}</p>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="block w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <StarBorder
                as={Link}
                href={getLoginUrl()}
                color="rgba(99, 102, 241, 0.8)"
                speed="4s"
                className="text-sm font-medium no-underline"
              >
                Sign In/Up
              </StarBorder>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-700/50 bg-gray-900/95 backdrop-blur-md shadow-2xl" id="mobile-menu">
          <div className="space-y-6 px-4 pb-6 pt-4">
            {/* AI Model Section */}
            <div className="space-y-3">
              <div className="px-2 py-1">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wide">AI Model</h3>
              </div>
              <div className="space-y-1">
                <Link href="/veo-3-generator" className="block rounded-xl px-4 py-3 text-base font-medium text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Veo3
                </Link>
                <Link href="/hailuo-ai-video-generator" className="block rounded-xl px-4 py-3 text-base font-medium text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Hailuo AI
                </Link>
                <Link href="/seedance" className="block rounded-xl px-4 py-3 text-base font-medium text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Seedance
                </Link>
              </div>
            </div>

            {/* AI Effect Section */}
            <div className="space-y-3">
              <div className="px-2 py-1">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wide">AI Effect</h3>
              </div>
              <div className="space-y-1">
                <Link href="/ai-baby-generator" className="block rounded-xl px-4 py-3 text-base font-medium text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                  AI Baby Generator
                </Link>
                <Link href="/ai-baby-podcast" className="block rounded-xl px-4 py-3 text-base font-medium text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                  AI Baby Podcast
                </Link>
                <Link href="/effect/earth-zoom" className="block rounded-xl px-4 py-3 text-base font-medium text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Earth Zoom
                </Link>
              </div>
            </div>

            {/* LipSync Section */}
            <div className="space-y-3">
              <div className="px-2 py-1">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wide">LipSync</h3>
              </div>
              <div className="space-y-1">
                <Link href="/lipsync" className="block rounded-xl px-4 py-3 text-base font-medium text-gray-300 hover:bg-gray-800/60 hover:text-white transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                  LipSync Generator
                </Link>
              </div>
            </div>

            <Link href="/pricing" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="/blog" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
          </div>
          <div className="border-t border-gray-600 pb-3 pt-4">
            {loading ? (
              <div className="px-4">
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-600"></div>
              </div>
            ) : user ? (
              <div className="space-y-2 px-4">
                <div className="text-xs font-medium text-gray-400">{user.email}</div>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-4">
                <StarBorder
                  as={Link}
                  href={getLoginUrl()}
                  color="rgba(99, 102, 241, 0.8)"
                  speed="4s"
                  className="text-base font-medium text-center no-underline block w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In/Up
                </StarBorder>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}