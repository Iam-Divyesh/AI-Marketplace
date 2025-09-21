import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<AuthMode>('login');
  const { user } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.userType === 'artisan') {
        setLocation('/dashboard');
      } else {
        setLocation('/marketplace');
      }
    }
  }, [user, setLocation]);

  const handleAuthSuccess = (data: { user: any; token: string }) => {
    // Redirect based on user type
    if (data.user.userType === 'artisan') {
      setLocation('/dashboard');
    } else {
      setLocation('/marketplace');
    }
  };

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');
  const switchToForgotPassword = () => setMode('forgot-password');
  const switchToResetPassword = () => setMode('reset-password');

  const renderAuthForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={switchToRegister}
            onSwitchToForgotPassword={switchToForgotPassword}
          />
        );
      case 'register':
        return (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={switchToLogin}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSuccess={switchToLogin}
            onSwitchToLogin={switchToLogin}
          />
        );
      case 'reset-password':
        return (
          <ResetPasswordForm
            onSuccess={switchToLogin}
            onSwitchToLogin={switchToLogin}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-12">
      <div className="w-full max-w-md">
        {renderAuthForm()}
      </div>
    </div>
  );
}
