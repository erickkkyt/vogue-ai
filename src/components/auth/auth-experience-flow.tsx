'use client';

import { useState } from 'react';
import { AuthExperienceShell } from './auth-experience-shell';
import { LoginForm } from './login-form';

interface AuthExperienceFlowProps {
  initialMode?: 'login' | 'register';
  callbackUrl?: string;
  onAuthenticated?: () => void;
}

export function AuthExperienceFlow({
  initialMode = 'login',
  callbackUrl,
  onAuthenticated,
}: AuthExperienceFlowProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  return (
    <AuthExperienceShell>
      <LoginForm
        callbackUrl={callbackUrl}
        mode={mode}
        onAuthenticated={onAuthenticated}
        onSwitchMode={() =>
          setMode((current) => (current === 'login' ? 'register' : 'login'))
        }
      />
    </AuthExperienceShell>
  );
}
