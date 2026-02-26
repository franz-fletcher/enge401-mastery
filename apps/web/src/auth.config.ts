import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// This is the Edge-compatible auth configuration
// It does NOT include the Drizzle adapter (which requires Node.js fs module)
// The adapter is added in auth.ts for Node.js runtime only

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      id: 'anonymous',
      name: 'Anonymous',
      credentials: {
        anonymousId: { label: 'Anonymous ID', type: 'text', optional: true },
      },
      // authorize is handled in auth.ts with database access
      authorize: async () => null,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.anonymousId = user.anonymousId;
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.anonymousId = token.anonymousId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
} satisfies NextAuthConfig;
