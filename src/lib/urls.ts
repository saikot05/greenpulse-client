/**
 * Dynamic URL selector helper.
 * Resolves frontend and backend base URLs dynamically based on runtime context.
 */

// 1. Resolve Frontend URL (App Base URL)
export function getAppBaseUrl(): string {
  // If we are in the browser, always trust window.location.origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Server-side (SSR / SSG / Route Handlers)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

// 2. Resolve Backend API URL
export function getApiBaseUrl(): string {
  // If we are in the browser
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If running frontend locally, default to local backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api/v1';
    }
    // Production frontend on Vercel points to production backend on Vercel
    return 'https://greenpulse-server.vercel.app/api/v1';
  }

  // Server-side default
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'https://greenpulse-server.vercel.app/api/v1';
}
