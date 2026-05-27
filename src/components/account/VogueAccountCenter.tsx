'use client';

import { Button } from '@/components/ui/button';
import { usePricingDialog } from '@/components/pricing/PricingDialogProvider';
import { normalizeVogueLocale, type VogueLocale } from '@/i18n/vogue';
import { authClient } from '@/lib/auth-client';
import { validateUploadedImageFile } from '@/lib/effects/validation';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { cn } from '@/lib/utils';
import { uploadFileFromBrowser } from '@/storage/client';
import {
  GalleryVerticalEnd,
  Loader2,
  LogOut,
  PencilLine,
  UserRound,
  WalletCards,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export type VogueAccountSection = 'profile' | 'billing';

type VogueAccountUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  subscriptionState?: string | null;
};

type AccountCopy = {
  title: string;
  close: string;
  loading: string;
  sections: Record<VogueAccountSection, string>;
  profile: {
    title: string;
    subtitle: string;
    avatar: string;
    avatarHint: string;
    avatarUploading: string;
    avatarSuccess: string;
    avatarFail: string;
    name: string;
    email: string;
    edit: string;
    cancel: string;
    save: string;
    saving: string;
    namePlaceholder: string;
    nameLength: string;
    nameSuccess: string;
    nameFail: string;
    signOut: string;
    signedInAs: string;
  };
  billing: {
    title: string;
    subtitle: string;
    currentPlan: string;
    freePlan: string;
    credits: string;
    status: string;
    manage: string;
    viewAssets: string;
    upgrade: string;
    refreshed: string;
  };
};

const ACCOUNT_COPY = {
  en: {
    title: 'Account',
    close: 'Close account dialog',
    loading: 'Loading account...',
    sections: {
      profile: 'Profile',
      billing: 'Billing & credits',
    },
    profile: {
      title: 'Account information',
      subtitle: 'Manage your profile details for Vogue AI.',
      avatar: 'Change avatar',
      avatarHint: 'PNG, JPG, or WEBP.',
      avatarUploading: 'Uploading...',
      avatarSuccess: 'Avatar updated',
      avatarFail: 'Failed to update avatar',
      name: 'User name',
      email: 'E-mail',
      edit: 'Edit',
      cancel: 'Cancel',
      save: 'Save',
      saving: 'Saving...',
      namePlaceholder: 'Enter your name',
      nameLength: 'Name must be between 3 and 30 characters.',
      nameSuccess: 'Name updated',
      nameFail: 'Failed to update name',
      signOut: 'Log out',
      signedInAs: 'Signed in as',
    },
    billing: {
      title: 'Billing & credits',
      subtitle: 'Review available credits and recharge without leaving the workspace.',
      currentPlan: 'Current plan',
      freePlan: 'Free',
      credits: 'Available credits',
      status: 'Situação',
      manage: 'Manage billing',
      viewAssets: 'View assets',
      upgrade: 'Upgrade or recharge',
      refreshed: 'Live balance',
    },
  },
  zh: {
    title: '账户',
    close: '关闭账户弹窗',
    loading: '正在加载账户...',
    sections: {
      profile: '个人资料',
      billing: '账单 / 积分',
    },
    profile: {
      title: '账户信息',
      subtitle: '管理你在 Vogue AI 中展示的基础资料。',
      avatar: '更换头像',
      avatarHint: '支持 PNG、JPG 或 WEBP。',
      avatarUploading: '上传中...',
      avatarSuccess: '头像已更新',
      avatarFail: '头像更新失败',
      name: '用户名',
      email: '邮箱',
      edit: '编辑',
      cancel: '取消',
      save: '保存',
      saving: '保存中...',
      namePlaceholder: '输入用户名',
      nameLength: '用户名长度需在 3 到 30 个字符之间。',
      nameSuccess: '用户名已更新',
      nameFail: '用户名更新失败',
      signOut: '退出登录',
      signedInAs: '当前登录',
    },
    billing: {
      title: '账单 / 积分',
      subtitle: '查看当前积分，并从这里进入充值或升级流程。',
      currentPlan: '当前套餐',
      freePlan: '免费版',
      credits: '可用积分',
      status: '状态',
      manage: '账单管理',
      viewAssets: '查看资产',
      upgrade: '升级或充值',
      refreshed: '实时余额',
    },
  },
  fr: {
    title: 'Compte',
    close: 'Fermer la fenêtre du compte',
    loading: 'Chargement du compte...',
    sections: {
      profile: 'Profil',
      billing: 'Facturation et crédits',
    },
    profile: {
      title: 'Informations du compte',
      subtitle: 'Gérez les informations visibles dans Vogue AI.',
      avatar: "Changer l'avatar",
      avatarHint: 'PNG, JPG ou WEBP.',
      avatarUploading: 'Import...',
      avatarSuccess: 'Avatar mis à jour',
      avatarFail: "Impossible de mettre à jour l'avatar",
      name: "Nom d'utilisateur",
      email: 'Email',
      edit: 'Modifier',
      cancel: 'Annuler',
      save: 'Enregistrer',
      saving: 'Enregistrement...',
      namePlaceholder: 'Saisissez votre nom',
      nameLength: 'Le nom doit contenir entre 3 et 30 caractères.',
      nameSuccess: 'Nom mis à jour',
      nameFail: 'Impossible de mettre à jour le nom',
      signOut: 'Se déconnecter',
      signedInAs: 'Connecté en tant que',
    },
    billing: {
      title: 'Facturation et crédits',
      subtitle:
        'Consultez vos crédits disponibles et rechargez sans quitter le workspace.',
      currentPlan: 'Formule actuelle',
      freePlan: 'Gratuit',
      credits: 'Crédits disponibles',
      status: 'État',
      manage: 'Gérer la facturation',
      viewAssets: 'Voir les ressources',
      upgrade: 'Mettre à niveau ou recharger',
      refreshed: 'Solde en direct',
    },
  },
  ru: {
    title: 'Аккаунт',
    close: 'Закрыть окно аккаунта',
    loading: 'Загрузка аккаунта...',
    sections: {
      profile: 'Профиль',
      billing: 'Оплата и кредиты',
    },
    profile: {
      title: 'Данные аккаунта',
      subtitle: 'Управляйте профилем, который используется в Vogue AI.',
      avatar: 'Сменить аватар',
      avatarHint: 'PNG, JPG или WEBP.',
      avatarUploading: 'Загрузка...',
      avatarSuccess: 'Аватар обновлен',
      avatarFail: 'Не удалось обновить аватар',
      name: 'Имя пользователя',
      email: 'Email',
      edit: 'Изменить',
      cancel: 'Отмена',
      save: 'Сохранить',
      saving: 'Сохранение...',
      namePlaceholder: 'Введите имя',
      nameLength: 'Имя должно быть от 3 до 30 символов.',
      nameSuccess: 'Имя обновлено',
      nameFail: 'Не удалось обновить имя',
      signOut: 'Выйти',
      signedInAs: 'Вы вошли как',
    },
    billing: {
      title: 'Оплата и кредиты',
      subtitle:
        'Проверяйте доступные кредиты и пополняйте баланс, не выходя из workspace.',
      currentPlan: 'Текущий тариф',
      freePlan: 'Бесплатный',
      credits: 'Доступные кредиты',
      status: 'Статус',
      manage: 'Управлять оплатой',
      viewAssets: 'Открыть ресурсы',
      upgrade: 'Обновить или пополнить',
      refreshed: 'Актуальный баланс',
    },
  },
  pt: {
    title: 'Conta',
    close: 'Fechar janela da conta',
    loading: 'Carregando conta...',
    sections: {
      profile: 'Perfil',
      billing: 'Cobrança e créditos',
    },
    profile: {
      title: 'Informações da conta',
      subtitle: 'Gerencie os dados exibidos no Vogue AI.',
      avatar: 'Alterar avatar',
      avatarHint: 'PNG, JPG ou WEBP.',
      avatarUploading: 'Enviando...',
      avatarSuccess: 'Avatar atualizado',
      avatarFail: 'Não foi possível atualizar o avatar',
      name: 'Nome de usuário',
      email: 'Email',
      edit: 'Editar',
      cancel: 'Cancelar',
      save: 'Salvar',
      saving: 'Salvando...',
      namePlaceholder: 'Digite seu nome',
      nameLength: 'O nome deve ter entre 3 e 30 caracteres.',
      nameSuccess: 'Nome atualizado',
      nameFail: 'Não foi possível atualizar o nome',
      signOut: 'Sair',
      signedInAs: 'Conectado como',
    },
    billing: {
      title: 'Cobrança e créditos',
      subtitle:
        'Confira seus créditos disponíveis e recarregue sem sair da área de trabalho.',
      currentPlan: 'Plano atual',
      freePlan: 'Grátis',
      credits: 'Créditos disponíveis',
      status: 'Status',
      manage: 'Gerenciar cobrança',
      viewAssets: 'Ver ativos',
      upgrade: 'Fazer upgrade ou recarregar',
      refreshed: 'Saldo em tempo real',
    },
  },
  ja: {
    title: 'アカウント',
    close: 'アカウント画面を閉じる',
    loading: 'アカウントを読み込み中...',
    sections: {
      profile: 'プロフィール',
      billing: '請求とクレジット',
    },
    profile: {
      title: 'アカウント情報',
      subtitle: 'Vogue AI で使うプロフィール情報を管理します。',
      avatar: 'アバターを変更',
      avatarHint: 'PNG、JPG、WEBP に対応。',
      avatarUploading: 'アップロード中...',
      avatarSuccess: 'アバターを更新しました',
      avatarFail: 'アバターを更新できませんでした',
      name: 'ユーザー名',
      email: 'メール',
      edit: '編集',
      cancel: 'キャンセル',
      save: '保存',
      saving: '保存中...',
      namePlaceholder: '名前を入力',
      nameLength: '名前は3〜30文字で入力してください。',
      nameSuccess: '名前を更新しました',
      nameFail: '名前を更新できませんでした',
      signOut: 'ログアウト',
      signedInAs: 'ログイン中',
    },
    billing: {
      title: '請求とクレジット',
      subtitle:
        '利用可能なクレジットを確認し、ワークスペースを離れずに追加できます。',
      currentPlan: '現在のプラン',
      freePlan: '無料',
      credits: '利用可能クレジット',
      status: 'ステータス',
      manage: '請求を管理',
      viewAssets: '素材を見る',
      upgrade: 'アップグレードまたは追加',
      refreshed: '現在の残高',
    },
  },
  ko: {
    title: '계정',
    close: '계정 창 닫기',
    loading: '계정 불러오는 중...',
    sections: {
      profile: '프로필',
      billing: '결제 및 크레딧',
    },
    profile: {
      title: '계정 정보',
      subtitle: 'Vogue AI에서 사용할 프로필 정보를 관리합니다.',
      avatar: '아바타 변경',
      avatarHint: 'PNG, JPG 또는 WEBP.',
      avatarUploading: '업로드 중...',
      avatarSuccess: '아바타가 업데이트되었습니다',
      avatarFail: '아바타를 업데이트하지 못했습니다',
      name: '사용자 이름',
      email: '이메일',
      edit: '편집',
      cancel: '취소',
      save: '저장',
      saving: '저장 중...',
      namePlaceholder: '이름 입력',
      nameLength: '이름은 3~30자여야 합니다.',
      nameSuccess: '이름이 업데이트되었습니다',
      nameFail: '이름을 업데이트하지 못했습니다',
      signOut: '로그아웃',
      signedInAs: '로그인 계정',
    },
    billing: {
      title: '결제 및 크레딧',
      subtitle:
        '사용 가능한 크레딧을 확인하고 작업 공간을 떠나지 않고 충전하세요.',
      currentPlan: '현재 플랜',
      freePlan: '무료',
      credits: '사용 가능 크레딧',
      status: '상태',
      manage: '결제 관리',
      viewAssets: '에셋 보기',
      upgrade: '업그레이드 또는 충전',
      refreshed: '실시간 잔액',
    },
  },
} as const satisfies Record<VogueLocale, AccountCopy>;

export function getVogueAccountCopy(locale?: string | null) {
  return ACCOUNT_COPY[normalizeVogueLocale(locale)];
}

export function getVogueAccountSectionFromPath(pathname: string) {
  if (pathname === '/profile') return 'profile' satisfies VogueAccountSection;
  if (pathname === '/billings') return 'billing' satisfies VogueAccountSection;
  return null;
}

function getDisplayName(user?: Partial<VogueAccountUser> | null) {
  return user?.name || user?.email?.split('@')[0] || 'Vogue AI User';
}

export function VogueAccountAvatar({
  user,
  className,
  imageClassName,
}: {
  user?: Partial<VogueAccountUser> | null;
  className?: string;
  imageClassName?: string;
}) {
  const displayName = getDisplayName(user);
  const initial = displayName.charAt(0).toUpperCase();
  const imageUrl = user?.image?.trim() || '';
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const shouldShowImage = imageUrl.length > 0 && failedImageUrl !== imageUrl;

  return (
    <span
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(72,55,44,0.12)] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(241,247,255,0.74))] p-[2px] text-[15px] font-semibold text-slate-700 shadow-[0_8px_20px_rgba(72,55,44,0.08)] ring-1 ring-white/70',
        className
      )}
    >
      {shouldShowImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          onError={() => setFailedImageUrl(imageUrl)}
          className={cn('h-full w-full rounded-full object-cover', imageClassName)}
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#42a5e8,#7c6ff2)] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]"
        >
          {initial}
        </span>
      )}
    </span>
  );
}

function AccountSectionButton({
  section,
  label,
  active,
  onClick,
}: {
  section: VogueAccountSection;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = section === 'profile' ? UserRound : WalletCards;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-[14px] font-semibold transition',
        active
          ? 'bg-[#ebe7e4] text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]'
          : 'text-slate-500 hover:bg-white/70 hover:text-slate-950'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function AccountHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="border-b border-[#ece4df] pb-5">
      <h2 className="text-[22px] font-semibold tracking-normal text-slate-950">
        {title}
      </h2>
      <p className="mt-1 max-w-2xl text-[14px] leading-6 text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

function ProfileSection({
  user,
  copy,
  onRefetch,
  onClose,
}: {
  user: VogueAccountUser;
  copy: AccountCopy;
  onRefetch: () => unknown;
  onClose: () => void;
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(user.name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user.image ?? '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAvatarUpload = async (file: File) => {
    const validation = validateUploadedImageFile(file);
    if (!validation.ok) {
      setError(copy.profile.avatarFail);
      setMessage('');
      return;
    }

    const previousUrl = avatarUrl;
    const tempUrl = URL.createObjectURL(file);
    let updateError = '';
    setAvatarUrl(tempUrl);
    setIsUploadingAvatar(true);
    setError('');
    setMessage('');

    try {
      const { url } = await uploadFileFromBrowser(file, 'avatars');
      await authClient.updateUser(
        { image: url },
        {
          onSuccess: async () => {
            setAvatarUrl(url);
            setMessage(copy.profile.avatarSuccess);
            await onRefetch();
          },
          onError: (ctx) => {
            updateError = ctx.error.message;
          },
        }
      );
      if (updateError) throw new Error(updateError);
    } catch (uploadError) {
      console.error('update avatar error:', uploadError);
      setAvatarUrl(previousUrl);
      setError(copy.profile.avatarFail);
    } finally {
      URL.revokeObjectURL(tempUrl);
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarButtonClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) void handleAvatarUpload(file);
    };
    input.click();
  };

  const handleSaveName = async () => {
    const nextName = draftName.trim();
    if (nextName.length < 3 || nextName.length > 30) {
      setError(copy.profile.nameLength);
      setMessage('');
      return;
    }

    if (nextName === (user.name ?? '')) {
      setIsEditingName(false);
      setError('');
      return;
    }

    let updateError = '';
    setIsSavingName(true);
    setError('');
    setMessage('');
    await authClient.updateUser(
      { name: nextName },
      {
        onSuccess: async () => {
          setIsEditingName(false);
          setMessage(copy.profile.nameSuccess);
          await onRefetch();
        },
        onError: (ctx) => {
          updateError = ctx.error.message;
        },
      }
    );
    setIsSavingName(false);

    if (updateError) {
      setError(updateError || copy.profile.nameFail);
      setMessage('');
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          onClose();
          window.location.assign('/');
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <AccountHeading title={copy.profile.title} subtitle={copy.profile.subtitle} />

      <section className="rounded-[22px] border border-[#ece4df] bg-white/84 p-5 shadow-[0_18px_44px_rgba(72,55,44,0.07)]">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex min-w-0 items-center gap-4">
            <VogueAccountAvatar
              user={{ ...user, image: avatarUrl }}
              className="h-16 w-16"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {copy.profile.name}
              </p>
              <p className="mt-1 truncate text-[20px] font-semibold tracking-normal text-slate-950">
                {getDisplayName(user)}
              </p>
              <p className="mt-1 truncate text-[14px] text-slate-500">{user.email}</p>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAvatarButtonClick}
            disabled={isUploadingAvatar}
            className="h-10 rounded-[14px] bg-slate-950 px-4 text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.12)] hover:bg-slate-800"
          >
            {isUploadingAvatar ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            {isUploadingAvatar ? copy.profile.avatarUploading : copy.profile.avatar}
          </Button>
        </div>
        <p className="mt-3 text-[12px] text-slate-400">{copy.profile.avatarHint}</p>
      </section>

      <section className="space-y-3 rounded-[22px] border border-[#ece4df] bg-white/84 p-5 shadow-[0_18px_44px_rgba(72,55,44,0.06)]">
        <div className="grid grid-cols-[112px_minmax(0,1fr)_auto] items-center gap-3">
          <p className="text-[13px] font-medium text-slate-500">
            {copy.profile.name}
          </p>
          <p className="truncate text-[14px] font-medium text-slate-900">
            {user.name ?? '-'}
          </p>
          <button
            type="button"
            onClick={() => {
              setDraftName(user.name ?? '');
              setIsEditingName(true);
              setError('');
              setMessage('');
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-[12px] border border-[#e7dfda] bg-white px-3 text-[13px] font-semibold text-slate-600 transition hover:border-[#d8ccc4] hover:bg-[#fbf8f6] hover:text-slate-950"
          >
            <PencilLine className="h-3.5 w-3.5" />
            {copy.profile.edit}
          </button>
        </div>

        <div className="grid grid-cols-[112px_minmax(0,1fr)] items-center gap-3">
          <p className="text-[13px] font-medium text-slate-500">
            {copy.profile.email}
          </p>
          <p className="truncate text-[14px] text-slate-500">{user.email}</p>
        </div>

        {isEditingName ? (
          <div className="rounded-[18px] border border-[#ece4df] bg-[#fbf8f6] p-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                placeholder={copy.profile.namePlaceholder}
                className="h-10 min-w-0 flex-1 rounded-[12px] border border-[#dfd5cf] bg-white px-3 text-[14px] text-slate-950 outline-none transition focus:border-slate-950/60"
              />
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingName(false);
                    setDraftName(user.name ?? '');
                    setError('');
                  }}
                  className="h-10 rounded-[12px] border border-[#dfd5cf] bg-white px-4 text-[13px] font-semibold text-slate-600 transition hover:bg-[#f6f0ec]"
                >
                  {copy.profile.cancel}
                </button>
                <button
                  type="button"
                  disabled={isSavingName}
                  onClick={() => void handleSaveName()}
                  className="inline-flex h-10 items-center gap-1.5 rounded-[12px] bg-slate-950 px-4 text-[13px] font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {isSavingName ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isSavingName ? copy.profile.saving : copy.profile.save}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {message ? <p className="text-[13px] text-emerald-700">{message}</p> : null}
        {error ? <p className="text-[13px] text-red-600">{error}</p> : null}
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-[#ece4df] bg-white/84 p-5 shadow-[0_18px_44px_rgba(72,55,44,0.05)]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {copy.profile.signOut}
          </p>
          <p className="mt-2 text-[13px] text-slate-500">
            {copy.profile.signedInAs}: {getDisplayName(user)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="inline-flex h-10 items-center gap-2 rounded-[14px] border border-[#e7dfda] bg-white px-4 text-[13px] font-semibold text-slate-700 transition hover:bg-[#fbf8f6] hover:text-slate-950"
        >
          <LogOut className="h-4 w-4" />
          {copy.profile.signOut}
        </button>
      </section>
    </div>
  );
}

function BillingSection({
  user,
  copy,
  locale,
  onClose,
}: {
  user: VogueAccountUser;
  copy: AccountCopy;
  locale: string;
  onClose: () => void;
}) {
  const { openPricingDialog } = usePricingDialog();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    fetch('/api/user/credits', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload: { currentCredits?: number }) => {
        if (active) setCredits(payload.currentCredits ?? 0);
      })
      .catch(() => {
        if (active) setCredits(0);
      });

    return () => {
      active = false;
    };
  }, [user.id]);

  const planLabel = useMemo(() => {
    const state = user.subscriptionState?.trim();
    return state && state !== 'free' ? state : copy.billing.freePlan;
  }, [copy.billing.freePlan, user.subscriptionState]);

  const handleOpenPricing = () => {
    onClose();
    openPricingDialog();
  };

  return (
    <div className="space-y-6">
      <AccountHeading title={copy.billing.title} subtitle={copy.billing.subtitle} />

      <section className="rounded-[24px] border border-[#e3e9f6] bg-white/88 p-5 shadow-[0_18px_44px_rgba(31,75,140,0.07)]">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {copy.billing.currentPlan}
            </p>
            <h3 className="mt-2 text-[24px] font-semibold tracking-normal text-slate-950">
              {planLabel}
            </h3>
          </div>

          <button
            type="button"
            onClick={handleOpenPricing}
            className="inline-flex h-10 items-center justify-center rounded-[14px] bg-slate-950 px-5 text-[13px] font-semibold text-white shadow-[0_14px_28px_rgba(15,23,42,0.12)] transition hover:bg-slate-800"
          >
            {copy.billing.upgrade}
          </button>
        </div>

        <div className="mt-5 border-t border-[#edf1f8] pt-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {copy.billing.credits}
          </p>
          <div className="mt-2 flex items-center gap-2 text-[34px] font-semibold tracking-normal text-slate-950">
            <Zap className="h-6 w-6 fill-[#ffb7e9] text-[#ffb7e9]" />
            {credits === null ? '...' : credits.toLocaleString()}
          </div>
          <p className="mt-1 text-[13px] text-slate-500">{copy.billing.refreshed}</p>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={getUrlWithLocale('/assets', locale)}
          onClick={onClose}
          className="flex items-center gap-3 rounded-[20px] border border-[#ece4df] bg-white/82 p-4 text-[14px] font-semibold text-slate-700 shadow-[0_14px_34px_rgba(72,55,44,0.06)] transition hover:bg-white hover:text-slate-950"
        >
          <GalleryVerticalEnd className="h-4 w-4" />
          {copy.billing.viewAssets}
        </Link>
        <button
          type="button"
          onClick={handleOpenPricing}
          className="flex items-center gap-3 rounded-[20px] border border-[#d8e3ff] bg-[#f3f7ff] p-4 text-[14px] font-semibold text-[#3f63a8] shadow-[0_14px_34px_rgba(72,92,130,0.06)] transition hover:bg-[#ebf2ff]"
        >
          <WalletCards className="h-4 w-4" />
          {copy.billing.manage}
        </button>
      </div>
    </div>
  );
}

export function VogueAccountDialog({
  open,
  section,
  locale,
  onSectionChange,
  onOpenChange,
}: {
  open: boolean;
  section: VogueAccountSection;
  locale: string;
  onSectionChange: (section: VogueAccountSection) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const copy = getVogueAccountCopy(locale);
  const { data: session, refetch } = authClient.useSession();
  const user = session?.user as VogueAccountUser | undefined;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onOpenChange, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1900] flex items-center justify-center bg-slate-950/36 p-4 backdrop-blur-[3px] sm:p-8"
      role="presentation"
      onMouseDown={() => onOpenChange(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        className="relative grid max-h-[calc(100svh-2rem)] w-full max-w-[980px] overflow-hidden rounded-[30px] border border-[#e8ded8] bg-[linear-gradient(135deg,#fff8f4_0%,#ffffff_50%,#eef4ff_100%)] text-slate-950 shadow-[0_34px_110px_rgba(72,92,130,0.24)] sm:max-h-[calc(100svh-4rem)] lg:grid-cols-[220px_minmax(0,1fr)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label={copy.close}
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e8ded8] bg-white/84 text-slate-500 shadow-[0_12px_28px_rgba(72,55,44,0.08)] transition hover:bg-white hover:text-slate-950"
        >
          <X className="h-4 w-4" />
        </button>

        <aside className="border-b border-[#ece4df] bg-[#f8f4f1]/82 px-5 py-6 lg:border-b-0 lg:border-r lg:py-8">
          <p className="px-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {copy.title}
          </p>
          <div className="mt-4 space-y-2">
            {(Object.keys(copy.sections) as VogueAccountSection[]).map((item) => (
              <AccountSectionButton
                key={item}
                section={item}
                label={copy.sections[item]}
                active={section === item}
                onClick={() => onSectionChange(item)}
              />
            ))}
          </div>
        </aside>

        <div className="min-h-[520px] overflow-y-auto px-5 py-8 sm:px-7 lg:px-8">
          {!user ? (
            <div className="flex min-h-[360px] items-center justify-center text-[14px] font-medium text-slate-500">
              {copy.loading}
            </div>
          ) : section === 'profile' ? (
            <ProfileSection
              key={`${user.id}:${user.name ?? ''}:${user.image ?? ''}`}
              user={user}
              copy={copy}
              onRefetch={refetch}
              onClose={() => onOpenChange(false)}
            />
          ) : (
            <BillingSection
              user={user}
              copy={copy}
              locale={locale}
              onClose={() => onOpenChange(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
