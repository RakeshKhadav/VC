"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    if (!isLoaded) {
      return; // Wait for auth to load before proceeding
    }
    
    // Set a timer for the animation duration before redirecting
    const redirectTimer = setTimeout(() => {
      setAnimationComplete(true);
      
      // Redirect to reviews page if user is logged in, otherwise to sign-up page
      if (isSignedIn) {
        router.push('/reviews');
      } else {
        router.push('/sign-up');
      }
    }, 5000); // 5 seconds animation before redirect
    
    return () => clearTimeout(redirectTimer);
  }, [router, isLoaded, isSignedIn]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black transition-all duration-500">
      <div className="text-center">
        {/* Animated logo */}
        <div className="mb-6 transition-all duration-500 transform hover:scale-105">
          <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-400 animate-pulse">
            Backchannel
          </div>
        </div>
        
        {/* Loading indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {[0, 1, 2].map((i) => (
            <div 
              key={i}
              className="w-2 h-2 rounded-full bg-black dark:bg-white"
              style={{
                animation: `bounce 1.4s infinite ease-in-out both`,
                animationDelay: `${i * 0.16}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Tagline */}
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Bringing transparency to venture capital
        </p>
        
        {/* Optional status message showing where the user will be redirected */}
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
          {isLoaded ? (isSignedIn ? 'Redirecting to reviews...' : 'Redirecting to sign up...') : 'Loading...'}
        </p>
      </div>
      
      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          } 
          40% { 
            transform: scale(1.0);
          }
        }
      `}</style>
    </div>
  );
}