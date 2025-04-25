"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

/**
 * This component constantly checks if a user is authenticated and redirects to sign-in 
 * when a user logs out from anywhere in the application.
 */
export default function AuthRedirector() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  // Effect to check auth status and redirect if not signed in
  useEffect(() => {
    // Only run after Clerk is loaded
    if (!isLoaded) return;
    
    // Immediately redirect if not signed in
    if (!isSignedIn) {
      console.log('User not authenticated. Redirecting to sign-in...');
      router.replace('/sign-in');
      return;
    }
    
    // Create a periodic checker to continuously monitor auth state
    const checkInterval = setInterval(() => {
      if (!isSignedIn) {
        console.log('Auth state changed: User logged out. Redirecting to sign-in...');
        router.replace('/sign-in');
        clearInterval(checkInterval);
      }
    }, 1000); // Check every second
    
    // Clean up interval on component unmount
    return () => clearInterval(checkInterval);
  }, [isLoaded, isSignedIn, router]);
  
  // This component doesn't render anything visible
  return null;
}