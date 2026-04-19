"use client";

import { useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            An unexpected error occurred.
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 border border-black dark:border-white"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black"
            >
              <Home className="w-4 h-4" />
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}