"use client";

import { useEffect } from "react";
import useOneTapLogin from "@/hooks/useOneTapLogin";

export default function GoogleOneTap() {
  const { isLoading } = useOneTapLogin();

  // 在组件挂载时立即触发 One-Tap
  useEffect(() => {
    console.log("GoogleOneTap component mounted");
  }, []);

  // 这个组件不渲染任何可见内容，只是初始化 One-Tap 功能
  return (
    <>
      {isLoading && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">Signing in with Google...</span>
          </div>
        </div>
      )}
    </>
  );
}
