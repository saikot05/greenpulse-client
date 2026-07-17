'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@heroui/react';
import { Person, Eye, EyeSlash, CircleCheck } from '@gravity-ui/icons';
import { signUp } from '@/lib/auth-client';

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

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = (): string | null => {
    if (!name.trim()) return 'Full name is required.';
    if (!email.trim()) return 'Email address is required.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await signUp.email(
        { name: name.trim(), email: email.trim(), password },
        {
          onSuccess: () => {
            setSuccess(true);
            setTimeout(() => {
              router.push('/');
              router.refresh();
            }, 1500);
          },
          onError: (ctx) => {
            setError(ctx.error.message ?? 'Registration failed. Please try again.');
          },
        }
      );
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl p-10 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 mb-4">
            <CircleCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Account created!
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Welcome to GreenPulse AI. Redirecting you now…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl shadow-neutral-900/5 dark:shadow-black/20 p-8">

        {/* Heading */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 mb-4">
            <Person className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Start your sustainability journey with GreenPulse AI
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="reg-name"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Full name
            </label>
            <Input
              id="reg-name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="reg-email"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Work email
            </label>
            <Input
              id="reg-email"
              type="email"
              autoComplete="email"
              placeholder="jane@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="reg-password"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Password
              <span className="ml-1 text-xs text-neutral-400 font-normal">(min 8 chars)</span>
            </label>
            <div className="relative">
              <Input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="reg-confirm"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Confirm password
            </label>
            <Input
              id="reg-confirm"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full"
            />
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
            {isLoading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        {/* Terms */}
        <p className="mt-4 text-center text-xs text-neutral-400 dark:text-neutral-600">
          By creating an account you agree to our{' '}
          <Link href="/terms" className="underline hover:text-neutral-600 dark:hover:text-neutral-400">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-neutral-600 dark:hover:text-neutral-400">
            Privacy Policy
          </Link>
          .
        </p>

        {/* Login link */}
        <p className="mt-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
