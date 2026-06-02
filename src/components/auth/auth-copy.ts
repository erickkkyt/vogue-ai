'use client';

import { usePathname } from 'next/navigation';

const LOCALES = ['en', 'zh', 'fr', 'ru', 'pt', 'ja', 'ko'] as const;

type Locale = (typeof LOCALES)[number];

export type AuthShowcaseSlideCopy = {
  title: string;
  ariaLabel: string;
};

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
  showcaseSlides: readonly [
    AuthShowcaseSlideCopy,
    AuthShowcaseSlideCopy,
    AuthShowcaseSlideCopy,
  ];
};

const AUTH_COPY = {
  en: {
    modalTitle: 'Sign up and generate for free',
    continueWithGoogle: 'Continue with Google',
    continueWithEmail: 'Continue with Email',
    orContinueWithEmail: 'Or continue with email',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    signIn: 'Sign in',
    signUp: 'Sign up',
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
    forgotPasswordTitle: 'Forgot password',
    resetPasswordTitle: 'Reset password',
    authErrorTitle: 'Authentication error',
    authErrorTryAgain: 'Please try signing in again.',
    backToLogin: 'Back to login',
    sendResetLink: 'Send reset link',
    resetEmailSent: 'If this email exists, check your inbox for the reset link.',
    newPassword: 'New password',
    resetPassword: 'Reset password',
    showcaseSlides: [
      {
        title: 'Editorial images with clean product logic',
        ariaLabel: 'Show GPT Image 2 showcase',
      },
      {
        title: 'Consistent fashion portraits and remixes',
        ariaLabel: 'Show Nano Banana showcase',
      },
      {
        title: 'High-texture art direction for first drafts',
        ariaLabel: 'Show Midjourney showcase',
      },
    ],
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
    showcaseSlides: [
      {
        title: '带产品逻辑的高级编辑图像',
        ariaLabel: '查看 GPT Image 2 展示',
      },
      {
        title: '稳定一致的时尚人像和改图',
        ariaLabel: '查看 Nano Banana 展示',
      },
      {
        title: '适合初稿的高质感艺术指导',
        ariaLabel: '查看 Midjourney 展示',
      },
    ],
  },
  fr: {
    modalTitle: 'Inscrivez-vous et générez gratuitement',
    continueWithGoogle: 'Continuer avec Google',
    continueWithEmail: 'Continuer avec un e-mail',
    orContinueWithEmail: 'Ou continuer par e-mail',
    name: 'Nom',
    email: 'E-mail',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    signIn: 'Connexion',
    signUp: "S'inscrire",
    signUpHint: "Pas encore de compte ? S'inscrire",
    signInHint: 'Vous avez déjà un compte ? Connexion',
    processing: 'Traitement...',
    namePlaceholder: 'nom',
    emailPlaceholder: 'name@example.com',
    passwordPlaceholder: '******',
    showPassword: 'Afficher le mot de passe',
    hidePassword: 'Masquer le mot de passe',
    modalTermsPrefix: 'En continuant, j’accepte les',
    modalTermsLink: 'Conditions d’utilisation',
    modalTermsAnd: 'et la',
    modalPrivacyLink: 'Politique de confidentialité',
    loginFailed: 'La connexion a échoué.',
    signUpFailed: "L’inscription a échoué.",
    checkEmail: 'Vérifiez votre boîte e-mail pour le lien de validation.',
    googleFailed: 'La connexion Google a échoué.',
    forgotPasswordTitle: 'Mot de passe oublié',
    resetPasswordTitle: 'Réinitialiser le mot de passe',
    authErrorTitle: 'Erreur d’authentification',
    authErrorTryAgain: 'Veuillez réessayer de vous connecter.',
    backToLogin: 'Retour à la connexion',
    sendResetLink: 'Envoyer le lien',
    resetEmailSent: 'Si cet e-mail existe, vérifiez votre boîte de réception.',
    newPassword: 'Nouveau mot de passe',
    resetPassword: 'Réinitialiser le mot de passe',
    showcaseSlides: [
      {
        title: 'Images éditoriales avec une logique produit claire',
        ariaLabel: 'Afficher la vitrine GPT Image 2',
      },
      {
        title: 'Portraits mode cohérents et remixes',
        ariaLabel: 'Afficher la vitrine Nano Banana',
      },
      {
        title: 'Direction artistique riche en texture pour les premiers jets',
        ariaLabel: 'Afficher la vitrine Midjourney',
      },
    ],
  },
  ru: {
    modalTitle: 'Зарегистрируйтесь и генерируйте бесплатно',
    continueWithGoogle: 'Продолжить с Google',
    continueWithEmail: 'Продолжить по e-mail',
    orContinueWithEmail: 'Или продолжить по e-mail',
    name: 'Имя',
    email: 'E-mail',
    password: 'Пароль',
    forgotPassword: 'Забыли пароль?',
    signIn: 'Войти',
    signUp: 'Зарегистрироваться',
    signUpHint: 'Нет аккаунта? Зарегистрироваться',
    signInHint: 'Уже есть аккаунт? Войти',
    processing: 'Обработка...',
    namePlaceholder: 'имя',
    emailPlaceholder: 'name@example.com',
    passwordPlaceholder: '******',
    showPassword: 'Показать пароль',
    hidePassword: 'Скрыть пароль',
    modalTermsPrefix: 'Продолжая, я принимаю',
    modalTermsLink: 'Условия обслуживания',
    modalTermsAnd: 'и',
    modalPrivacyLink: 'Политику конфиденциальности',
    loginFailed: 'Не удалось войти.',
    signUpFailed: 'Не удалось зарегистрироваться.',
    checkEmail: 'Проверьте почту: мы отправили ссылку подтверждения.',
    googleFailed: 'Не удалось войти через Google.',
    forgotPasswordTitle: 'Забыли пароль',
    resetPasswordTitle: 'Сброс пароля',
    authErrorTitle: 'Ошибка аутентификации',
    authErrorTryAgain: 'Попробуйте войти еще раз.',
    backToLogin: 'Вернуться ко входу',
    sendResetLink: 'Отправить ссылку',
    resetEmailSent: 'Если e-mail существует, проверьте входящие.',
    newPassword: 'Новый пароль',
    resetPassword: 'Сбросить пароль',
    showcaseSlides: [
      {
        title: 'Редакционные изображения с четкой логикой продукта',
        ariaLabel: 'Показать витрину GPT Image 2',
      },
      {
        title: 'Стабильные fashion-портреты и ремиксы',
        ariaLabel: 'Показать витрину Nano Banana',
      },
      {
        title: 'Фактурное арт-направление для первых черновиков',
        ariaLabel: 'Показать витрину Midjourney',
      },
    ],
  },
  pt: {
    modalTitle: 'Cadastre-se e gere de graça',
    continueWithGoogle: 'Continuar com Google',
    continueWithEmail: 'Continuar com e-mail',
    orContinueWithEmail: 'Ou continuar com e-mail',
    name: 'Nome',
    email: 'E-mail',
    password: 'Senha',
    forgotPassword: 'Esqueceu a senha?',
    signIn: 'Entrar',
    signUp: 'Cadastrar',
    signUpHint: 'Não tem conta? Cadastre-se',
    signInHint: 'Já tem conta? Entrar',
    processing: 'Processando...',
    namePlaceholder: 'nome',
    emailPlaceholder: 'name@example.com',
    passwordPlaceholder: '******',
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha',
    modalTermsPrefix: 'Ao continuar, eu aceito os',
    modalTermsLink: 'Termos de Serviço',
    modalTermsAnd: 'e a',
    modalPrivacyLink: 'Política de Privacidade',
    loginFailed: 'Falha ao entrar.',
    signUpFailed: 'Falha ao cadastrar.',
    checkEmail: 'Verifique sua caixa de entrada para o link de confirmação.',
    googleFailed: 'Falha ao entrar com Google.',
    forgotPasswordTitle: 'Esqueceu a senha',
    resetPasswordTitle: 'Redefinir senha',
    authErrorTitle: 'Erro de autenticação',
    authErrorTryAgain: 'Tente entrar novamente.',
    backToLogin: 'Voltar para login',
    sendResetLink: 'Enviar link',
    resetEmailSent: 'Se este e-mail existir, verifique sua caixa de entrada.',
    newPassword: 'Nova senha',
    resetPassword: 'Redefinir senha',
    showcaseSlides: [
      {
        title: 'Imagens editoriais com lógica clara de produto',
        ariaLabel: 'Mostrar vitrine do GPT Image 2',
      },
      {
        title: 'Retratos de moda consistentes e remixes',
        ariaLabel: 'Mostrar vitrine do Nano Banana',
      },
      {
        title: 'Direção de arte com textura para primeiros rascunhos',
        ariaLabel: 'Mostrar vitrine do Midjourney',
      },
    ],
  },
  ja: {
    modalTitle: '無料登録して生成を開始',
    continueWithGoogle: 'Google で続ける',
    continueWithEmail: 'メールで続ける',
    orContinueWithEmail: 'またはメールで続ける',
    name: '名前',
    email: 'メール',
    password: 'パスワード',
    forgotPassword: 'パスワードをお忘れですか？',
    signIn: 'ログイン',
    signUp: '登録',
    signUpHint: 'アカウントがありませんか？登録',
    signInHint: 'すでにアカウントがありますか？ログイン',
    processing: '処理中...',
    namePlaceholder: '名前',
    emailPlaceholder: 'name@example.com',
    passwordPlaceholder: '******',
    showPassword: 'パスワードを表示',
    hidePassword: 'パスワードを非表示',
    modalTermsPrefix: '続行すると、',
    modalTermsLink: '利用規約',
    modalTermsAnd: 'および',
    modalPrivacyLink: 'プライバシーポリシー',
    loginFailed: 'ログインに失敗しました。',
    signUpFailed: '登録に失敗しました。',
    checkEmail: '確認リンクをメールで確認してください。',
    googleFailed: 'Google ログインに失敗しました。',
    forgotPasswordTitle: 'パスワードを忘れた場合',
    resetPasswordTitle: 'パスワードをリセット',
    authErrorTitle: '認証エラー',
    authErrorTryAgain: 'もう一度ログインしてください。',
    backToLogin: 'ログインに戻る',
    sendResetLink: 'リセットリンクを送信',
    resetEmailSent: 'このメールが存在する場合、受信箱を確認してください。',
    newPassword: '新しいパスワード',
    resetPassword: 'パスワードをリセット',
    showcaseSlides: [
      {
        title: '商品ロジックまで整ったエディトリアル画像',
        ariaLabel: 'GPT Image 2 のショーケースを表示',
      },
      {
        title: '一貫したファッションポートレートとリミックス',
        ariaLabel: 'Nano Banana のショーケースを表示',
      },
      {
        title: '初稿に使える高密度なアートディレクション',
        ariaLabel: 'Midjourney のショーケースを表示',
      },
    ],
  },
  ko: {
    modalTitle: '무료로 가입하고 생성하기',
    continueWithGoogle: 'Google로 계속하기',
    continueWithEmail: '이메일로 계속하기',
    orContinueWithEmail: '또는 이메일로 계속하기',
    name: '이름',
    email: '이메일',
    password: '비밀번호',
    forgotPassword: '비밀번호를 잊으셨나요?',
    signIn: '로그인',
    signUp: '가입',
    signUpHint: '계정이 없나요? 가입',
    signInHint: '이미 계정이 있나요? 로그인',
    processing: '처리 중...',
    namePlaceholder: '이름',
    emailPlaceholder: 'name@example.com',
    passwordPlaceholder: '******',
    showPassword: '비밀번호 표시',
    hidePassword: '비밀번호 숨기기',
    modalTermsPrefix: '계속하면',
    modalTermsLink: '서비스 약관',
    modalTermsAnd: '및',
    modalPrivacyLink: '개인정보 처리방침',
    loginFailed: '로그인에 실패했습니다.',
    signUpFailed: '가입에 실패했습니다.',
    checkEmail: '확인 링크를 이메일 받은편지함에서 확인하세요.',
    googleFailed: 'Google 로그인에 실패했습니다.',
    forgotPasswordTitle: '비밀번호 찾기',
    resetPasswordTitle: '비밀번호 재설정',
    authErrorTitle: '인증 오류',
    authErrorTryAgain: '다시 로그인해 주세요.',
    backToLogin: '로그인으로 돌아가기',
    sendResetLink: '재설정 링크 보내기',
    resetEmailSent: '해당 이메일이 있으면 받은편지함을 확인하세요.',
    newPassword: '새 비밀번호',
    resetPassword: '비밀번호 재설정',
    showcaseSlides: [
      {
        title: '제품 로직이 분명한 에디토리얼 이미지',
        ariaLabel: 'GPT Image 2 쇼케이스 보기',
      },
      {
        title: '일관된 패션 인물 사진과 리믹스',
        ariaLabel: 'Nano Banana 쇼케이스 보기',
      },
      {
        title: '초안에 적합한 고밀도 아트 디렉션',
        ariaLabel: 'Midjourney 쇼케이스 보기',
      },
    ],
  },
} as const satisfies Record<Locale, AuthCopy>;

export function getLocalePrefix(pathname: string | null) {
  const firstSegment = pathname?.split('/').filter(Boolean)[0];

  return LOCALES.includes(firstSegment as Locale) ? `/${firstSegment}` : '';
}

function getAuthLocale(pathname: string | null): Locale {
  const firstSegment = pathname?.split('/').filter(Boolean)[0];

  return LOCALES.includes(firstSegment as Locale)
    ? (firstSegment as Locale)
    : 'en';
}

export function useAuthCopy() {
  const pathname = usePathname();
  const localePrefix = getLocalePrefix(pathname);
  const locale = getAuthLocale(pathname);

  return { copy: AUTH_COPY[locale], localePrefix };
}
