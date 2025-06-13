'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client'; // 导入浏览器客户端
import { type User } from '@supabase/supabase-js'; // 导入 Supabase User 类型

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiToolsDropdownOpen, setAiToolsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient(); // 创建客户端实例

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              {/* Placeholder for a real logo SVG if available */}
              {/* <img className="h-8 w-auto" src="/logo.svg" alt="AI Baby Podcast" /> */}
              <span className="text-xl font-bold text-white">VOGUE AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* AI Tools Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors"
                onMouseEnter={() => setAiToolsDropdownOpen(true)}
                onMouseLeave={() => setAiToolsDropdownOpen(false)}
              >
                Current AI Tools
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-gray-600 ring-opacity-50 focus:outline-none z-50 transition-all duration-200 ${
                  aiToolsDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setAiToolsDropdownOpen(true)}
                onMouseLeave={() => setAiToolsDropdownOpen(false)}
              >
                <Link
                  href="/ai-baby-generator"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <span className="mr-3 text-lg">👶</span>
                  AI Baby Generator
                </Link>
                <Link
                  href="/ai-baby-podcast"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <span className="mr-3 text-lg">🎙️</span>
                  AI Baby Podcast
                </Link>
                <Link
                  href="/face-to-many-kontext"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <span className="mr-3 text-lg">🎭</span>
                  Face-to-Many-Kontext
                </Link>
              </div>
            </div>

            <Link href="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Blog
            </Link>
          </nav>

          {/* User specific actions */}
          <div className="hidden md:flex items-center space-x-3">
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
              <>
                <Link
                  href="/login"
                  className="flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium text-gray-300 transition-colors hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className="flex h-8 items-center justify-center rounded-md bg-blue-600 px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  Sign Up
                </Link>
              </>
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
        <div className="md:hidden border-t border-gray-600 bg-gray-800 shadow-lg sm:rounded-b-lg" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {/* AI Tools Section */}
            <div className="border-b border-gray-600 pb-2 mb-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Tools</div>
              <Link href="/ai-baby-generator" className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                <span className="mr-3 text-lg">👶</span>
                AI Baby Generator
              </Link>
              <Link href="/ai-baby-podcast" className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                <span className="mr-3 text-lg">🎙️</span>
                AI Baby Podcast
              </Link>
              <Link href="/face-to-many-kontext" className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                <span className="mr-3 text-lg">🎭</span>
                Face-to-Many-Kontext
              </Link>
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
              <div className="space-y-3 px-4">
                <Link href="/login" className="block w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-center text-base font-medium text-gray-300 shadow-sm hover:bg-gray-600" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/login" className="block w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 text-center text-base font-medium text-white shadow-sm hover:bg-blue-700" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}