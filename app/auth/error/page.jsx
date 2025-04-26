'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errors = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The sign in link is no longer valid.',
    Default: 'Unable to sign in.',
  };

  const errorMessage = errors[error] || errors.Default;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
      <p className="text-center mb-6">{errorMessage}</p>
      <Link 
        href="/signin" 
        className="px-4 py-2 bg-[var(--accent)] text-[var(--background)] rounded-lg hover:opacity-90 transition-opacity"
      >
        Try Again
      </Link>
    </div>
  );
}
