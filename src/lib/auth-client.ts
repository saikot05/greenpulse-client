import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';

/**
 * Better Auth client instance.
 * Docs: https://www.better-auth.com/docs/installation#create-client-instance
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
  plugins: [
    jwtClient(),
  ],
});

/**
 * Convenience named exports — import these directly in components.
 *
 * @example
 *   const { data: session } = useSession();
 *   await signIn.email({ email, password });
 *   await signIn.social({ provider: 'google', callbackURL: '/' });
 *   await signUp.email({ name, email, password });
 *   await signOut();
 */
export const { signIn, signUp, signOut, useSession } = authClient;
