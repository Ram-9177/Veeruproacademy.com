"use client";
import React from 'react';

// Error boundary for App Router (route-level errors)
export default function Error({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }
  reset: () => void 
}) {
  React.useEffect(() => {
    // Log error to console for debugging
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-red-50">
      <div className="max-w-md w-full space-y-4 text-center">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-2xl font-bold text-red-800">
          Something went wrong
        </h1>
        <p className="text-sm text-red-700 opacity-80">
          {error.message || 'An unexpected error occurred'}
        </p>
        {error.digest && (
          <p className="text-xs text-red-600 opacity-60">
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-semibold"
        >
          Try again
        </button>
        <a 
          href="/"
          className="block text-sm text-red-700 hover:underline"
        >
          Return to home
        </a>
      </div>
    </div>
  );
}
