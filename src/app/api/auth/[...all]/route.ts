import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/lib/auth';

/**
 * Catch-all API route for Better Auth.
 * Handles all authentication endpoints under /api/auth/*
 * e.g. /api/auth/sign-in, /api/auth/sign-up, /api/auth/callback/google, etc.
 */
export const { GET, POST } = toNextJsHandler(auth);
