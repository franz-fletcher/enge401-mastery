import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Extend the built-in session types
declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's unique ID */
      id: string;
      /** The user's anonymous identifier */
      anonymousId: string;
    } & DefaultSession['user'];
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends DefaultUser {
    /** The user's unique ID */
    id: string;
    /** The user's anonymous identifier */
    anonymousId: string;
    /** When the user was created */
    createdAt?: Date;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** The user's unique ID */
    id?: string;
    /** The user's anonymous identifier */
    anonymousId?: string;
  }
}
