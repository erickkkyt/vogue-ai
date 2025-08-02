"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import Prediction from "@/backend/type/domain/replicate";
import { useAppContext } from "@/contexts/app";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import DeleteButton from "@/components/button/delete-button";
import { handleApiErrors } from "@/components/replicate/common-logic/response";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import Output from "@/components/worker/img-output";
import { UserPermissions, TierLevel } from "@/lib/user-permissions-validator";
import PricingModal from "@/components/price/pricing-modal";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Worker(props: {
  model: string;
  effect_link_name: string;
  version: string;
  credit: number;
  promptTips?: string;
  defaultImage?: string;
}) {
  const t = useTranslations("SeedEdit.generator");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [userSubscriptionInfo, setUserSubscriptionInfo] = useState<UserSubscriptionInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { user } = useAppContext();
  const { data: session } = useSession();

  // 新增用户权限相关状态
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [showWaitingQueue, setShowWaitingQueue] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [canSubmitAPI, setCanSubmitAPI] = useState(false); // 免费用户初始需要等待

  useEffect(() => {
    if (user?.uuid) {
      fetchUserSubscriptionInfo();
    }
  }, [user?.uuid]);

  // 获取用户权限信息
  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!session?.user?.email) {
        setPermissionsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user/permissions');
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setUserPermissions(result.data);
            setIsSubscribed(result.data.isSubscribed);
          }
        }
      } catch (error) {
        console.error('Error fetching user permissions:', error);
      } finally {
        setPermissionsLoading(false);
      }
    };

    fetchUserPermissions();
  }, [session]);

  const fetchUserSubscriptionInfo = async () => {
    if (!user?.uuid) return;
    const userSubscriptionInfo = await fetch(
      "/api/user/get_user_subscription_info",
      {
        method: "POST",
        body: JSON.stringify({ user_id: user.uuid }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const userSubscriptionInfoData = await userSubscriptionInfo.json();
    setUserSubscriptionInfo(userSubscriptionInfoData);
    setIsSubscribed(userSubscriptionInfoData?.subscription_plan_id > 1);
  };

  // 等待完成处理 - 免费用户专用
  const handleWaitComplete = () => {
    setShowWaitingQueue(false);
    setCanSubmitAPI(true);

    // 免费用户等待完成后检查积分
    if (userPermissions && userPermissions.remainingCredits < props.credit) {
      // 积分不足，跳转到pricing页面
      console.log("⚠️ [Frontend] Free user wait completed but insufficient credits, redirecting to pricing");
      router.push('/pricing');
      return;
    }

    // 积分充足，自动提交表单
    console.log("✅ [Frontend] Free user wait completed with sufficient credits, auto-submitting");
    handleEdit();
  };

  // 升级处理
  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  // 图片上传处理
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件大小 (5MB限制)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 编辑处理
  const handleEdit = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter edit instructions");
      return;
    }

    if (prompt.length > 120) {
      toast.error("Edit instructions must be 120 characters or less");
      return;
    }

    // 检查用户是否登录
    if (!user || !user.uuid || !user.email) {
      toast.warning("Please login first");
      await sleep(1000);
      signIn("google");
      return;
    }

    // 积分检查
    if (props.credit > 0) {
      if (typeof userSubscriptionInfo?.remain_count === 'number' && userSubscriptionInfo.remain_count < props.credit) {
        // 免费用户等待机制检查
        if (userPermissions && userPermissions.tierLevel === TierLevel.FREE) {
          if (!canSubmitAPI) {
            setShowWaitingQueue(true);
            return;
          }
        } else {
          // 付费用户积分不足，显示升级模态框
          toast.warning("No credit left");
          setShowUpgradeModal(true);
          return;
        }
      }
    }

    setGenerating(true);
    setError(null);
    setPrediction(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("prompt", prompt);
      formData.append("model", props.model);
      formData.append("user_id", user.uuid);
      formData.append("user_email", user.email || "");
      formData.append("effect_link_name", props.effect_link_name);
      formData.append("version", props.version);
      formData.append("credit", props.credit.toString());
      formData.append("scale", "0.5"); // 默认scale值
      formData.append("seed", "-1"); // 默认随机seed

      console.log(`🎨 [Image Edit] Submitting edit request for: ${props.effect_link_name}`);

      const response = await fetch("/api/predictions/image_edit", {
        method: "POST",
        body: formData,
      });

      const newPrediction = await response.json();
      
      const canContinue = await handleApiErrors({
        response,
        newPrediction,
        router,
      });

      if (canContinue) {
        setPrediction(newPrediction);
        toast.success("Image edited successfully!");
        
        // 刷新用户积分信息
        await fetchUserSubscriptionInfo();
      }
    } catch (error) {
      console.error("❌ [Image Edit] Error:", error);
      toast.error("Failed to edit image. Please try again.");
      setError("Failed to edit image");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col md:flex-row my-8 sm:my-12 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 border-2 border-gray-300 rounded-xl sm:rounded-2xl bg-white">
      {/* 左侧：输入区域 */}
      <div className="w-full md:w-1/2 px-4 sm:px-6 lg:px-8 md:border-r border-gray-300">
        {/* 图片上传区域 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">{t("uploadLabel")}</label>
            {/* 精简积分显示 - 右上角 */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-theme-primary/5 border border-theme-primary/20 rounded-lg">
              <svg className="w-4 h-4 text-theme-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-medium text-theme-primary-text">
                {userSubscriptionInfo?.remain_count || 0}
              </span>
            </div>
          </div>
          <label className="relative flex flex-col items-center justify-center h-72 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition duration-300">
            {previewUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain rounded-lg"
                />
                <DeleteButton onClick={() => {
                  setSelectedImage(null);
                  setPreviewUrl(null);
                }} />
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-4">📷</div>
                <p className="text-gray-600">Click to upload image</p>
                <p className="text-sm text-gray-500 mt-2">JPEG, PNG • Max 5MB • Max 4096×4096</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>

        {/* 编辑指令输入 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">{t("promptLabel")}</label>
          </div>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t("promptPlaceholder")}
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition-all duration-200 bg-white resize-none min-h-[140px] sm:min-h-[160px]"
              maxLength={120}
              rows={5}
              aria-label={t("promptLabel")}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {prompt.length}/120 characters
            </div>
          </div>
          {props.promptTips && (
            <span className="text-xs pl-1 text-gray-500 mt-1 block">
              {props.promptTips}
            </span>
          )}
        </div>

        {/* 编辑按钮 */}
        {generating ? (
          <Button
            isLoading
            className="w-full h-12 sm:h-14 mt-8 bg-theme-primary text-white hover:bg-theme-primary-hover transition duration-200 text-base font-medium"
          >
            {t("editingButton")}
          </Button>
        ) : (
          <Button
            className="w-full h-12 sm:h-14 mt-8 bg-theme-primary text-white hover:bg-theme-primary-hover transition duration-200 text-base font-medium"
            onClick={handleEdit}
            disabled={!selectedImage || !prompt.trim()}
          >
            {t("editButton")} ({props.credit} credits)
          </Button>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* 右侧：输出区域 */}
      <Output
        error={error || ""}
        prediction={prediction}
        defaultImage={props.defaultImage || ""}
        showImage={null}
        showWaitingQueue={showWaitingQueue}
        onWaitComplete={handleWaitComplete}
        onUpgrade={handleUpgrade}
        waitTimeSeconds={180}
      />

      {/* 价格模态框 */}
      <PricingModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Upgrade for image editing"
        subtitle="Unlock unlimited image editing capabilities"
      />
    </div>
  );
}
