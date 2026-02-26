import NextAuth from 'next-auth';
import type { Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { authConfig } from '@/auth.config';

// Anonymous ID generator - creates a unique anonymous identifier
function generateAnonymousId(): string {
  return `anon_${crypto.randomUUID()}`;
}

// Create a new anonymous user in the database
async function createAnonymousUser() {
  const anonymousId = generateAnonymousId();
  const now = new Date();

  const [user] = await db
    .insert(users)
    .values({
      anonymousId,
      createdAt: now,
      lastActiveAt: now,
    })
    .returning();

  return user;
}

// Find or create anonymous user
async function getOrCreateAnonymousUser(anonymousId?: string | null) {
  if (anonymousId) {
    // Try to find existing user
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.anonymousId, anonymousId))
      .limit(1);

    if (existingUser) {
      // Update last active timestamp
      await db
        .update(users)
        .set({ lastActiveAt: new Date() })
        .where(eq(users.id, existingUser.id));

      return existingUser;
    }
  }

  // Create new anonymous user
  return createAnonymousUser();
}

// Merge the Edge-compatible config with Node.js-specific settings
const nextAuth = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: 'anonymous',
      name: 'Anonymous',
      credentials: {
        anonymousId: { label: 'Anonymous ID', type: 'text', optional: true },
      },
      authorize: async (credentials) => {
        // Create or retrieve anonymous user
        const user = await getOrCreateAnonymousUser(
          credentials?.anonymousId as string | undefined
        );

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          anonymousId: user.anonymousId,
          createdAt: user.createdAt,
        };
      },
    }),
  ],
  events: {
    signIn: async ({ user, isNewUser }) => {
      console.log(
        `[Auth] User signed in: ${user.id}, isNewUser: ${isNewUser}`
      );
    },
  },
});

// Export auth functions with explicit type annotations
export const handlers = nextAuth.handlers;
export const auth: () => Promise<Session | null> = nextAuth.auth;
export const signIn: typeof nextAuth.signIn = nextAuth.signIn;
export const signOut: typeof nextAuth.signOut = nextAuth.signOut;
export const { GET, POST } = handlers;
