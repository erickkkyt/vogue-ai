'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function TestOneTapPage() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState<string[]>([]);
  const supabase = createClient();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    // 检查用户状态
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      addLog(`User status: ${user ? 'Logged in' : 'Not logged in'}`);
    };

    checkUser();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      addLog(`Auth event: ${event}`);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // 检查环境变量
    addLog(`Google Client ID: ${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'Configured' : 'Not configured'}`);
    addLog(`One-Tap Enabled: ${process.env.NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED}`);

    // 检查 Google Identity Services
    const checkGoogleAPI = () => {
      if (window.google?.accounts?.id) {
        addLog('Google Identity Services: Available');
      } else {
        addLog('Google Identity Services: Not available');
        setTimeout(checkGoogleAPI, 1000);
      }
    };

    checkGoogleAPI();
  }, []);

  const manualTriggerOneTap = () => {
    addLog('Manually triggering One-Tap...');

    if (!window.google?.accounts?.id) {
      addLog('Error: Google Identity Services not loaded');
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      addLog('Error: Google Client ID not configured');
      return;
    }

    try {
      // 先取消任何现有的提示
      window.google.accounts.id.cancel();

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => {
          addLog('One-Tap callback triggered');
          addLog(`Credential received: ${response.credential ? 'Yes' : 'No'}`);
        },
        auto_select: false,
        cancel_on_tap_outside: false,
        context: "signin",
      });

      setTimeout(() => {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            addLog(`One-Tap not displayed: ${notification.getNotDisplayedReason()}`);
          } else if (notification.isSkippedMoment()) {
            addLog(`One-Tap skipped: ${notification.getSkippedReason()}`);
          } else if (notification.isDismissedMoment()) {
            addLog(`One-Tap dismissed: ${notification.getDismissedReason()}`);
          } else {
            addLog('One-Tap displayed successfully');
          }
        });
      }, 100);
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Google One-Tap 测试页面</h1>
        
        {/* 用户状态 */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">用户状态</h2>
          <p className="text-lg">
            状态: <span className={user ? 'text-green-400' : 'text-red-400'}>
              {user ? '已登录' : '未登录'}
            </span>
          </p>
          {user && (
            <div className="mt-2">
              <p>邮箱: {user.email}</p>
              <p>ID: {user.id}</p>
            </div>
          )}
        </div>

        {/* 控制按钮 */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">控制</h2>
          <button
            onClick={manualTriggerOneTap}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg mr-4"
          >
            手动触发 One-Tap
          </button>
          <button
            onClick={() => setLogs([])}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            清除日志
          </button>
        </div>

        {/* 日志 */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">实时日志</h2>
          <div className="bg-black p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-gray-500">等待日志...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
