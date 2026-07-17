/**
 * Catch-all Next.js App Router handler for Better Auth.
 * Docs: https://www.better-auth.com/docs/installation#mount-handler
 *
 * Handles every request under /api/auth/* including:
 *   POST /api/auth/sign-in/email
 *   POST /api/auth/sign-up/email
 *   GET  /api/auth/callback/google
 *   GET  /api/auth/get-session
 *   POST /api/auth/sign-out
 *   ...and all other Better Auth endpoints
 */
import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth);
