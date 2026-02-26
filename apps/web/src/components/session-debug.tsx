'use client';

import { useSession } from 'next-auth/react';

export function SessionDebug() {
  const { data: session, status } = useSession();

  return (
    <div className="rounded-lg bg-gray-100 p-4 text-sm">
      <h3 className="mb-2 font-semibold">Session Status (Client)</h3>
      <div className="space-y-1">
        <p>
          <span className="font-medium">Status:</span>{' '}
          <span
            className={
              status === 'authenticated'
                ? 'text-green-600'
                : status === 'loading'
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }
          >
            {status}
          </span>
        </p>
        {session?.user && (
          <>
            <p>
              <span className="font-medium">User ID:</span> {session.user.id}
            </p>
            <p>
              <span className="font-medium">Anonymous ID:</span>{' '}
              {session.user.anonymousId}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
