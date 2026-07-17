'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@heroui/react';
import { Person, Eye, EyeSlash, ArrowRight, CircleCheck } from '@gravity-ui/icons';
import { signIn } from '@/lib/auth-client';

/** Google SVG brand icon — not available in @gravity-ui/icons */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/** Inline spinner so we avoid unsupported isLoading prop on HeroUI v3 Button */
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? 'h-4 w-4'}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

/**
 * Login page — email/password + Google OAuth.
 * Demo credentials auto-fill for reviewer convenience.
 */
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const DEMO_EMAIL = 'manager@greenpulse.ai';
  const DEMO_PASSWORD = 'password123';

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn.email(
        { email, password },
        {
          onSuccess: () => {
            router.push('/');
            router.refresh();
          },
          onError: (ctx) => {
            setError(ctx.error.message ?? 'Invalid credentials. Please try again.');
          },
        }
      );

      if (result?.error) {
        setError(result.error.message ?? 'Sign in failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await signIn.social({ provider: 'google', callbackURL: '/' });
    } catch {
      setError('Google sign-in failed. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl shadow-neutral-900/5 dark:shadow-black/20 p-8">

        {/* Heading */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 mb-4">
            <Person className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Sign in to your GreenPulse AI account
          </p>
        </div>

        {/* Demo login banner */}
        <button
          type="button"
          onClick={fillDemo}
          className="w-full mb-5 flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors duration-200 text-left group cursor-pointer"
        >
          <CircleCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Demo Account — Click to auto-fill
            </p>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70 truncate">
              {DEMO_EMAIL} · password123
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-emerald-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full mb-4 h-11 flex items-center justify-center gap-2.5 font-medium border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-xl shadow-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isGoogleLoading ? (
            <Spinner className="h-5 w-5 text-neutral-400" />
          ) : (
            <GoogleIcon className="h-5 w-5 shrink-0" />
          )}
          <span>{isGoogleLoading ? 'Redirecting…' : 'Continue with Google'}</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center mb-4">
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
          <span className="px-3 text-xs text-neutral-400 dark:text-neutral-600">or continue with email</span>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Email address
            </label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 text-sm text-red-700 dark:text-red-400"
            >
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 flex items-center justify-center gap-2 font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white rounded-xl shadow-md shadow-emerald-500/20 transition-colors duration-200 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? <Spinner /> : null}
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
