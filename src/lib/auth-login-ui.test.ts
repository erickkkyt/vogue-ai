import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

test('Vogue login modal uses a compact split auth layout size', () => {
  const wrapperSource = readFileSync(
    join(process.cwd(), 'src/components/auth/login-wrapper.tsx'),
    'utf8'
  );
  const shellSource = readFileSync(
    join(process.cwd(), 'src/components/auth/auth-experience-shell.tsx'),
    'utf8'
  );

  assert.match(wrapperSource, /sm:max-w-\[1040px\]/);
  assert.match(wrapperSource, /maxWidth: 1040/);
  assert.match(
    shellSource,
    /lg:grid-cols-\[minmax\(0,0\.82fr\)_minmax\(0,1fr\)\]/
  );
  assert.match(shellSource, /gridTemplateColumns: 'minmax\(0, 0\.82fr\) minmax\(0, 1fr\)'/);
});

test('Vogue login card swaps only the brand identity from gptimg', () => {
  const loginSource = readFileSync(
    join(process.cwd(), 'src/components/auth/login-form.tsx'),
    'utf8'
  );
  const panelSource = readFileSync(
    join(process.cwd(), 'src/components/auth/auth-showcase-panel.tsx'),
    'utf8'
  );
  const brandSource = readFileSync(
    join(process.cwd(), 'src/components/common/VogueBrand.tsx'),
    'utf8'
  );

  assert.match(loginSource, /VogueBrandLockup/);
  assert.match(brandSource, /\/logo\/logo\.png/);
  assert.match(loginSource, /text-\[36px\]/);
  assert.match(panelSource, /VogueBrandWord/);
  assert.doesNotMatch(loginSource, /GPTIMG2 AI/);
  assert.doesNotMatch(panelSource, /GPTIMG2 AI/);
});

test('Vogue visible brand surfaces use the shared script brand components', () => {
  const brandSource = readFileSync(
    join(process.cwd(), 'src/components/common/VogueBrand.tsx'),
    'utf8'
  );
  const footerSource = readFileSync(
    join(process.cwd(), 'src/components/common/Footer.tsx'),
    'utf8'
  );
  const visibleBrandSurfacePaths = [
    'src/components/app/VogueSidebarShell.tsx',
    'src/components/common/Footer.tsx',
    'src/components/auth/login-form.tsx',
    'src/components/auth/auth-simple-card.tsx',
    'src/components/auth/auth-showcase-panel.tsx',
    'src/components/blog/VogueBlogIndex.tsx',
  ];

  assert.match(brandSource, /export function VogueBrandWord/);
  assert.match(brandSource, /export function VogueBrandLockup/);
  assert.match(brandSource, /vogue-brand-word/);
  assert.doesNotMatch(footerSource, /Vogue AI Prompt Gallery/);
  assert.doesNotMatch(footerSource, /tagline="AI Prompt Gallery"/);

  for (const surfacePath of visibleBrandSurfacePaths) {
    const source = readFileSync(join(process.cwd(), surfacePath), 'utf8');
    assert.match(source, /VogueBrand(?:Word|Lockup)/, surfacePath);
    assert.doesNotMatch(source, />\s*VOGUE AI\s*</, surfacePath);
  }
});

test('Vogue login modal uses a three-model image showcase carousel', () => {
  const loginSource = readFileSync(
    join(process.cwd(), 'src/components/auth/login-form.tsx'),
    'utf8'
  );
  const panelSource = readFileSync(
    join(process.cwd(), 'src/components/auth/auth-showcase-panel.tsx'),
    'utf8'
  );

  assert.match(panelSource, /AUTH_SHOWCASE_SLIDES/);
  assert.match(panelSource, /GPT Image 2/);
  assert.match(panelSource, /Nano Banana/);
  assert.match(panelSource, /Midjourney/);
  assert.match(panelSource, /setInterval/);
  assert.match(panelSource, /6000/);
  assert.match(panelSource, /showcaseSlides\[index\]\?\.ariaLabel/);
  assert.doesNotMatch(panelSource, /eyebrow:/);
  assert.doesNotMatch(panelSource, /description:/);
  assert.doesNotMatch(panelSource, /activeSlide\.eyebrow/);
  assert.doesNotMatch(panelSource, /activeSlide\.description/);
  assert.doesNotMatch(panelSource, /border border-white\/24 bg-white\/15/);
  assert.match(loginSource, /max-w-\[300px\]/);
  assert.match(loginSource, /text-balance/);
});

test('Vogue login starts with Google and email choices before showing the email form', () => {
  const loginSource = readFileSync(
    join(process.cwd(), 'src/components/auth/login-form.tsx'),
    'utf8'
  );
  const copySource = readFileSync(
    join(process.cwd(), 'src/components/auth/auth-copy.ts'),
    'utf8'
  );

  assert.match(copySource, /continueWithEmail/);
  assert.match(loginSource, /emailAuthVisible/);
  assert.match(loginSource, /setEmailAuthVisible\(true\)/);
  assert.match(loginSource, /MailIcon/);
  assert.match(loginSource, /!emailAuthVisible \? \(/);
  assert.match(loginSource, /copy\.orContinueWithEmail/);
  assert.match(loginSource, /min-h-\[308px\]/);
  assert.match(loginSource, /maxWidth: 356/);
  assert.match(loginSource, /h-\[52px\]/);
  assert.match(loginSource, /copy\.continueWithEmail/);
  assert.match(loginSource, /aria-label=\{copy\.backToLogin\}/);
  assert.doesNotMatch(loginSource, /const \[name, setName\]/);
  assert.doesNotMatch(loginSource, /copy\.name/);
  assert.doesNotMatch(loginSource, /copy\.namePlaceholder/);
});

test('Vogue auth copy covers every public locale', () => {
  const copySource = readFileSync(
    join(process.cwd(), 'src/components/auth/auth-copy.ts'),
    'utf8'
  );

  for (const locale of ['en', 'zh', 'fr', 'ru', 'pt', 'ja', 'ko']) {
    assert.match(copySource, new RegExp(`\\b${locale}: \\{`), locale);
  }

  assert.doesNotMatch(copySource, /Record<'en' \| 'zh'/);
  assert.doesNotMatch(
    copySource,
    /locale === 'zh' \? AUTH_COPY\.zh : AUTH_COPY\.en/
  );
});

test('Vogue auth showcase uses locale-aware copy instead of hardcoded English', () => {
  const shellSource = readFileSync(
    join(process.cwd(), 'src/components/auth/auth-experience-shell.tsx'),
    'utf8'
  );
  const panelSource = readFileSync(
    join(process.cwd(), 'src/components/auth/auth-showcase-panel.tsx'),
    'utf8'
  );

  assert.match(shellSource, /useAuthCopy/);
  assert.match(shellSource, /showcaseSlides=\{copy\.showcaseSlides\}/);
  assert.match(panelSource, /showcaseSlides/);
  assert.doesNotMatch(panelSource, /Editorial images with clean product logic/);
  assert.doesNotMatch(panelSource, /Consistent fashion portraits and remixes/);
  assert.doesNotMatch(panelSource, /High-texture art direction/);
});

test('localized auth routes use localized metadata titles', () => {
  const localizedLoginPage = readFileSync(
    join(process.cwd(), 'src/app/[locale]/auth/login/page.tsx'),
    'utf8'
  );
  const localizedLoginAlias = readFileSync(
    join(process.cwd(), 'src/app/[locale]/login/page.tsx'),
    'utf8'
  );

  assert.match(localizedLoginPage, /generateMetadata/);
  assert.match(localizedLoginPage, /getAuthPageMetadata/);
  assert.match(localizedLoginAlias, /generateMetadata/);
  assert.doesNotMatch(localizedLoginPage, /title: 'Login - Vogue AI'/);
  assert.doesNotMatch(localizedLoginAlias, /login\/layout/);
});

test('Vogue routes and sidebar use the shared auth experience flow', () => {
  const loginPage = readFileSync(
    join(process.cwd(), 'src/app/login/page.tsx'),
    'utf8'
  );
  const sidebarSource = readFileSync(
    join(process.cwd(), 'src/components/app/VogueSidebarShell.tsx'),
    'utf8'
  );

  assert.match(loginPage, /AuthExperienceFlow/);
  assert.match(sidebarSource, /LoginWrapper mode="modal"/);
  assert.match(sidebarSource, /isAuthShellPath/);
});

test('Vogue exposes the same gptimg auth route family', () => {
  const authRoutes = [
    'src/app/auth/login/page.tsx',
    'src/app/auth/register/page.tsx',
    'src/app/auth/forgot-password/page.tsx',
    'src/app/auth/reset-password/page.tsx',
    'src/app/auth/error/page.tsx',
    'src/app/[locale]/auth/login/page.tsx',
    'src/app/[locale]/auth/register/page.tsx',
    'src/app/[locale]/auth/forgot-password/page.tsx',
    'src/app/[locale]/auth/reset-password/page.tsx',
    'src/app/[locale]/auth/error/page.tsx',
  ];

  for (const route of authRoutes) {
    assert.doesNotThrow(() => readFileSync(join(process.cwd(), route), 'utf8'));
  }

  const routesSource = readFileSync(join(process.cwd(), 'src/routes.ts'), 'utf8');
  assert.match(routesSource, /Login = '\/auth\/login'/);
  assert.match(routesSource, /Register = '\/auth\/register'/);
  assert.match(routesSource, /ForgotPassword = '\/auth\/forgot-password'/);
  assert.match(routesSource, /ResetPassword = '\/auth\/reset-password'/);
  assert.match(routesSource, /AuthError = '\/auth\/error'/);
});

test('Vogue auth API config matches gptimg auth capabilities', () => {
  const authSource = readFileSync(join(process.cwd(), 'src/lib/auth.ts'), 'utf8');
  const clientSource = readFileSync(
    join(process.cwd(), 'src/lib/auth-client.ts'),
    'utf8'
  );
  const loginSource = readFileSync(
    join(process.cwd(), 'src/components/auth/login-form.tsx'),
    'utf8'
  );

  assert.match(authSource, /sendResetPassword/);
  assert.match(authSource, /sendVerificationEmail/);
  assert.match(authSource, /accountLinking/);
  assert.match(authSource, /oneTap\(\)/);
  assert.match(authSource, /errorURL: '\/auth\/error'/);
  assert.match(clientSource, /adminClient\(\)/);
  assert.match(clientSource, /inferAdditionalFields<typeof auth>\(\)/);
  assert.match(clientSource, /oneTapClient/);
  assert.match(clientSource, /timeout: 12000/);
  assert.match(loginSource, /GoogleOneTap/);
  assert.match(loginSource, /\/auth\/forgot-password/);
});
