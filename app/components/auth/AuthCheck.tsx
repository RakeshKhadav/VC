"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

interface AuthCheckProps {
  redirectUrl: string; 
  redirectDelay?: number; // in milliseconds
}

/**
 * Component to check if a user is authenticated and redirect if not
 * Used for pages that require authentication
 */
export default function AuthCheck({ redirectUrl, redirectDelay = 5000 }: AuthCheckProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // Wait until auth is loaded

    let redirectTimer: NodeJS.Timeout | null = null;

    // If user is not signed in, set up redirection
    if (!isSignedIn) {
      redirectTimer = setTimeout(() => {
        console.log(`User not authenticated. Redirecting to ${redirectUrl}...`);
        router.push(redirectUrl);
      }, redirectDelay);
    }

    // Clean up timer if component unmounts
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [isLoaded, isSignedIn, redirectUrl, redirectDelay, router]);

  // Only render a warning if user is not signed in
  if (isLoaded && !isSignedIn) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-200">
              Authentication required. You will be redirected to sign up in {redirectDelay/1000} seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Return null if user is authenticated or auth is still loading
  return null;
}