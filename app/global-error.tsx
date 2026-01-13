"use client";
import React from 'react';

// Global error boundary - catches errors in root layout
export default function GlobalError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }
  reset: () => void 
}) {
  React.useEffect(() => {
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center p-8 bg-red-50">
        <div className="max-w-md w-full space-y-4 text-center">
          <div className="text-6xl">💥</div>
          <h1 className="text-2xl font-bold text-red-800">
            Critical Error
          </h1>
          <p className="text-sm text-red-700 opacity-80">
            {error.message || 'A critical error occurred in the application'}
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
        </div>
      </body>
    </html>
  );
}
