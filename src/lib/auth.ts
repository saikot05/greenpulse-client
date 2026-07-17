/**
 * Better Auth server instance -- follows the official docs exactly.
 * https://www.better-auth.com/docs/installation
 *
 * Uses `better-auth/minimal` (recommended for adapter users) to reduce
 * Next.js bundle size vs the full `better-auth` import.
 */
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

// MongoDB client
// The MONGODB_URI must include the database name, e.g.:
//   mongodb+srv://user:pass@cluster/greenpulse?...
// client.db() reads the db name from the URI automatically.
const client = new MongoClient(process.env.MONGODB_URI!);

// Auth instance
export const auth = betterAuth({
  // Docs: https://www.better-auth.com/docs/adapters/mongodb
  database: mongodbAdapter(client.db(), { client }),

  // Required: used for JWT signing and cookie encryption
  secret: process.env.BETTER_AUTH_SECRET!,

  // Required: base URL must match the domain that runs /api/auth/*
  // Set BETTER_AUTH_URL in .env.local to avoid redirect_uri_mismatch with Google
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',

  // Email / Password
  // Docs: https://www.better-auth.com/docs/authentication/email-password
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Flip to true in production
  },

  // Social Providers
  // Docs: https://www.better-auth.com/docs/authentication/social-sign-on/google
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Always show the Google account chooser -- prevents silent re-use of
      // a cached session when users want to switch/link a different account.
      prompt: 'select_account',
    },
  },

  // Account Linking
  // Docs: https://www.better-auth.com/docs/concepts/users-accounts#account-linking
  //
  // Without this, signing in with Google when the email already exists as an
  // email/password account throws `account_not_linked`.
  // Setting trustedProviders: ['google'] means Better Auth accepts Google's
  // verified email claim and links automatically -- no extra step for the user.
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
    },
  },

  // Session
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,      // Refresh session cookie if older than 24 h
  },

  // User extra fields
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'facility_manager',
      },
    },
  },
});

export type Auth = typeof auth;
