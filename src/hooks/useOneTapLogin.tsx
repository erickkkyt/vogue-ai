"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// 全局变量防止重复初始化
let isOneTapInitialized = false;
let isOneTapPrompting = false;

export default function useOneTapLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const oneTapLogin = async function () {
    // 防止重复调用
    if (isOneTapPrompting) {
      console.log("One-Tap already prompting, skipping...");
      return;
    }

    // 检查环境变量
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("Google Client ID not configured");
      return;
    }

    // 检查用户是否已登录
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log("User already logged in, skipping One-Tap");
      return; // 用户已登录，不显示 One-Tap
    }

    // 检查 Google Identity Services 是否已加载
    if (!window.google?.accounts?.id) {
      console.log("Google Identity Services not yet loaded, waiting...");
      return; // 不再递归重试，由定时器处理
    }

    initializeOneTap();
  };

  const initializeOneTap = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("Google Client ID not configured");
      return;
    }

    if (!window.google?.accounts?.id) {
      console.warn("Google Identity Services not loaded");
      return;
    }

    // 防止重复初始化
    if (isOneTapInitialized) {
      console.log("One-Tap already initialized, prompting...");
      promptOneTap();
      return;
    }

    try {
      console.log("Initializing Google One-Tap with client ID:", clientId);

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: false,
        context: "signin",
      });

      isOneTapInitialized = true;
      promptOneTap();
    } catch (error) {
      console.error("Error initializing Google One-Tap:", error);
      isOneTapInitialized = false;
    }
  };

  const promptOneTap = () => {
    if (isOneTapPrompting) {
      console.log("One-Tap prompt already in progress");
      return;
    }

    try {
      isOneTapPrompting = true;

      window.google.accounts.id.prompt((notification: any) => {
        isOneTapPrompting = false; // 重置状态

        if (notification.isNotDisplayed()) {
          console.log("One Tap not displayed - reason:", notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.log("One Tap skipped - reason:", notification.getSkippedReason());
        } else if (notification.isDismissedMoment()) {
          console.log("One Tap dismissed - reason:", notification.getDismissedReason());
        } else {
          console.log("One Tap displayed successfully");
        }
      });
    } catch (error) {
      console.error("Error prompting Google One-Tap:", error);
      isOneTapPrompting = false;
    }
  };

  const handleCredentialResponse = async (response: any) => {
    if (!response.credential) {
      console.error("No credential received from Google One-Tap");
      return;
    }

    setIsLoading(true);
    
    try {
      // 验证 Google ID Token
      const tokenResponse = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${response.credential}`
      );

      if (!tokenResponse.ok) {
        throw new Error("Failed to verify Google token");
      }

      const payload = await tokenResponse.json();
      const {
        email,
        sub: googleId,
        given_name,
        family_name,
        email_verified,
        picture: avatar_url,
      } = payload;

      if (!email_verified) {
        throw new Error("Email not verified by Google");
      }

      // 使用 Supabase 的 signInWithIdToken 方法
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) {
        console.error("Supabase sign-in error:", error);
        throw error;
      }

      console.log("Google One-Tap login successful:", data);
      
      // 登录成功后刷新页面或重定向
      router.refresh();
      
    } catch (error) {
      console.error("Google One-Tap login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 检查是否启用了 Google One-Tap
    const isEnabled = process.env.NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED === 'true';
    if (!isEnabled) {
      console.log("Google One-Tap is disabled");
      return;
    }

    console.log("Starting Google One-Tap initialization...");

    // 立即尝试初始化
    oneTapLogin();

    // 只设置一个重试定时器，减少频率
    const retryTimer = setTimeout(() => {
      if (!isOneTapInitialized) {
        oneTapLogin();
      }
    }, 2000);

    // 设置较长间隔的重试（每30秒）
    const intervalId = setInterval(() => {
      if (!isOneTapPrompting) {
        oneTapLogin();
      }
    }, 30000);

    return () => {
      clearTimeout(retryTimer);
      clearInterval(intervalId);
    };
  }, []);

  return { isLoading };
}
