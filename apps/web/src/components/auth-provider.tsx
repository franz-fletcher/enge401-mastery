'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

// Auto-authenticate anonymous users
function AnonymousAuthHandler() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // If not authenticated and not loading, sign in anonymously
    if (status === 'unauthenticated') {
      // Check if we have a stored anonymous ID
      const storedAnonymousId = localStorage.getItem('anonymousId');

      signIn('anonymous', {
        anonymousId: storedAnonymousId || undefined,
        redirect: false,
      });
    }

    // If authenticated, store the anonymous ID
    if (status === 'authenticated' && session?.user?.anonymousId) {
      localStorage.setItem('anonymousId', session.user.anonymousId);
    }
  }, [status, session]);

  return null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true}
    >
      <AnonymousAuthHandler />
      {children}
    </SessionProvider>
  );
}
