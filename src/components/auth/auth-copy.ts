'use client';

import { usePathname } from 'next/navigation';

const LOCALES = ['en', 'zh', 'fr', 'ru', 'pt', 'ja', 'ko'] as const;

type Locale = (typeof LOCALES)[number];

type AuthCopy = {
  modalTitle: string;
  continueWithGoogle: string;
  continueWithEmail: string;
  orContinueWithEmail: string;
  name: string;
  email: string;
  password: string;
  forgotPassword: string;
  signIn: string;
  signUp: string;
  signUpHint: string;
  signInHint: string;
  processing: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  showPassword: string;
  hidePassword: string;
  modalTermsPrefix: string;
  modalTermsLink: string;
  modalTermsAnd: string;
  modalPrivacyLink: string;
  loginFailed: string;
  signUpFailed: string;
  checkEmail: string;
  googleFailed: string;
  forgotPasswordTitle: string;
  resetPasswordTitle: string;
  authErrorTitle: string;
  authErrorTryAgain: string;
  backToLogin: string;
  sendResetLink: string;
  resetEmailSent: string;
  newPassword: string;
  resetPassword: string;
};

const AUTH_COPY: Record<'en' | 'zh', AuthCopy> = {
  en: {
    modalTitle: 'Sign up and generate for free',
    continueWithGoogle: 'Continue with Google',
    continueWithEmail: 'Continue with Email',
    orContinueWithEmail: 'Or Continue With Email',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signUpHint: "Don't have an account? Sign up",
    signInHint: 'Already have an account? Sign in',
    processing: 'Processing...',
    namePlaceholder: 'name',
    emailPlaceholder: 'name@example.com',
    passwordPlaceholder: '******',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    modalTermsPrefix: 'By continuing, I acknowledge the',
    modalTermsLink: 'Terms of Service',
    modalTermsAnd: 'and',
    modalPrivacyLink: 'Privacy Policy',
    loginFailed: 'Sign in failed.',
    signUpFailed: 'Sign up failed.',
    checkEmail: 'Please check your email inbox for the verification link.',
    googleFailed: 'Google sign in failed.',
    forgotPasswordTitle: 'Forgot Password',
    resetPasswordTitle: 'Reset Password',
    authErrorTitle: 'Authentication Error',
    authErrorTryAgain: 'Please try signing in again.',
    backToLogin: 'Back to login',
    sendResetLink: 'Send reset link',
    resetEmailSent: 'If this email exists, check your inbox for the reset link.',
    newPassword: 'New password',
    resetPassword: 'Reset password',
  },
  zh: {
    modalTitle: '免费注册并生成',
    continueWithGoogle: '使用 Google 继续',
    continueWithEmail: '使用邮箱继续',
    orContinueWithEmail: '或使用邮箱继续',
    name: '姓名',
    email: '邮箱',
    password: '密码',
    forgotPassword: '忘记密码？',
    signIn: '登录',
    signUp: '注册',
    signUpHint: '没有账户？注册',
    signInHint: '已有账户？登录',
    processing: '处理中...',
    namePlaceholder: '你的名字',
    emailPlaceholder: 'name@example.com',
    passwordPlaceholder: '******',
    showPassword: '显示密码',
    hidePassword: '隐藏密码',
    modalTermsPrefix: '继续即表示我同意',
    modalTermsLink: '服务条款',
    modalTermsAnd: '和',
    modalPrivacyLink: '隐私政策',
    loginFailed: '登录失败。',
    signUpFailed: '注册失败。',
    checkEmail: '请检查邮箱收件箱中的验证链接。',
    googleFailed: 'Google 登录失败。',
    forgotPasswordTitle: '忘记密码',
    resetPasswordTitle: '重置密码',
    authErrorTitle: '认证错误',
    authErrorTryAgain: '请重新登录再试。',
    backToLogin: '返回登录',
    sendResetLink: '发送重置链接',
    resetEmailSent: '如果该邮箱存在，请查看收件箱中的重置链接。',
    newPassword: '新密码',
    resetPassword: '重置密码',
  },
};

export function getLocalePrefix(pathname: string | null) {
  const firstSegment = pathname?.split('/').filter(Boolean)[0];

  return LOCALES.includes(firstSegment as Locale) ? `/${firstSegment}` : '';
}

export function useAuthCopy() {
  const pathname = usePathname();
  const localePrefix = getLocalePrefix(pathname);
  const locale = localePrefix.replace('/', '') as Locale;
  const copy = locale === 'zh' ? AUTH_COPY.zh : AUTH_COPY.en;

  return { copy, localePrefix };
}
