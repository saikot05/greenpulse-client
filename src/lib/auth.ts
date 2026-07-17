import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

/**
 * Singleton MongoDB client for Better Auth adapter.
 * Uses the native MongoDB driver as required by better-auth/adapters/mongodb.
 */
const client = new MongoClient(process.env.MONGODB_URI!);

/**
 * Better Auth server instance.
 * Configures email/password and Google OAuth providers backed by MongoDB Atlas.
 */
export const auth = betterAuth({
  database: mongodbAdapter(client.db()),

  secret: process.env.BETTER_AUTH_SECRET!,

  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disable for development; enable in production
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,      // Refresh if older than 24h
  },

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
