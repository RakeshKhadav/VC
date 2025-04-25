"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  // Always redirect to reviews page after a short animation
  useEffect(() => {
    // Set a timer for the animation duration before redirecting
    const redirectTimer = setTimeout(() => {
      router.push('/reviews');
    }, 500); // Short animation before redirect
    
    return () => {
      clearTimeout(redirectTimer);
    };
  }, [router]);

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