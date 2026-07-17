import { createAuthClient } from 'better-auth/react';

/**
 * Client-side Better Auth instance.
 * Provides hooks and helpers for use in React Client Components.
 *
 * baseURL defaults to the current window origin in browser environments.
 * In SSR or server components, pass the full URL explicitly.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
});

/**
 * Named exports for convenience — mirrors the pattern used by next-auth.
 * Use these directly in components instead of importing the full authClient.
 *
 * @example
 *   const { data: session } = useSession();
 *   await signIn.email({ email, password });
 *   await signIn.social({ provider: 'google' });
 *   await signOut();
 */
export const { signIn, signUp, signOut, useSession } = authClient;
