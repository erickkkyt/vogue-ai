import { DEFAULT_LOCALE, LOCALES } from '@/i18n/routing';
import type { Metadata } from 'next';

type Locale = (typeof LOCALES)[number];
type AuthPageKind = 'login' | 'register' | 'forgotPassword' | 'resetPassword' | 'error';

export type LocalizedAuthPageProps = {
  params: Promise<{ locale: string }>;
};

const AUTH_PAGE_TITLES: Record<Locale, Record<AuthPageKind, string>> = {
  en: {
    login: 'Sign in - Vogue AI',
    register: 'Register - Vogue AI',
    forgotPassword: 'Forgot password - Vogue AI',
    resetPassword: 'Reset password - Vogue AI',
    error: 'Authentication error - Vogue AI',
  },
  zh: {
    login: '登录 - Vogue AI',
    register: '注册 - Vogue AI',
    forgotPassword: '忘记密码 - Vogue AI',
    resetPassword: '重置密码 - Vogue AI',
    error: '认证错误 - Vogue AI',
  },
  fr: {
    login: 'Connexion - Vogue AI',
    register: 'Inscription - Vogue AI',
    forgotPassword: 'Mot de passe oublié - Vogue AI',
    resetPassword: 'Réinitialiser le mot de passe - Vogue AI',
    error: 'Erreur d’authentification - Vogue AI',
  },
  ru: {
    login: 'Войти - Vogue AI',
    register: 'Регистрация - Vogue AI',
    forgotPassword: 'Забыли пароль - Vogue AI',
    resetPassword: 'Сброс пароля - Vogue AI',
    error: 'Ошибка аутентификации - Vogue AI',
  },
  pt: {
    login: 'Entrar - Vogue AI',
    register: 'Cadastro - Vogue AI',
    forgotPassword: 'Esqueceu a senha - Vogue AI',
    resetPassword: 'Redefinir senha - Vogue AI',
    error: 'Erro de autenticação - Vogue AI',
  },
  ja: {
    login: 'ログイン - Vogue AI',
    register: '登録 - Vogue AI',
    forgotPassword: 'パスワードを忘れた場合 - Vogue AI',
    resetPassword: 'パスワードをリセット - Vogue AI',
    error: '認証エラー - Vogue AI',
  },
  ko: {
    login: '로그인 - Vogue AI',
    register: '가입 - Vogue AI',
    forgotPassword: '비밀번호 찾기 - Vogue AI',
    resetPassword: '비밀번호 재설정 - Vogue AI',
    error: '인증 오류 - Vogue AI',
  },
};

function resolveLocale(locale: string): Locale {
  return LOCALES.includes(locale as Locale) ? (locale as Locale) : DEFAULT_LOCALE;
}

export async function getAuthPageMetadata(
  kind: AuthPageKind,
  params: LocalizedAuthPageProps['params']
): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);

  return {
    title: AUTH_PAGE_TITLES[resolvedLocale][kind],
    robots: {
      index: false,
      follow: true,
    },
  };
}
