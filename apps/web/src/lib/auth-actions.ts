'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Get the current authenticated user from the session
 * Works in Server Components and Server Actions
 */
export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    anonymousId: session.user.anonymousId,
  };
}

/**
 * Get the current user ID from the session
 * Returns null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user?.id;
}

/**
 * Update user's last active timestamp
 */
export async function updateLastActive() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  await db
    .update(users)
    .set({ lastActiveAt: new Date() })
    .where(eq(users.id, userId));

  revalidatePath('/');

  return { success: true };
}

/**
 * Get full user details from database
 */
export async function getUserDetails() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  return user ?? null;
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in server actions that require a logged-in user
 */
export async function requireAuth() {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error('Authentication required');
  }

  return userId;
}
