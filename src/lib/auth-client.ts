import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';
import { getAppBaseUrl } from './urls';

/**
 * Better Auth client instance.
 * Docs: https://www.better-auth.com/docs/installation#create-client-instance
 */
export const authClient = createAuthClient({
  baseURL: getAppBaseUrl(),
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
