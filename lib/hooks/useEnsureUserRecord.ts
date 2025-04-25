import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * Hook that ensures the authenticated user's data is stored in our MongoDB database
 * This should be used in layout components or other components that run after sign-in
 * This uses a direct database approach to bypass authentication issues
 */
export function useEnsureUserRecord() {
  const { isLoaded, isSignedIn, user } = useUser();
  
  useEffect(() => {
    // Only run this effect when auth is loaded and user is signed in
    if (!isLoaded || !isSignedIn || !user) return;
    
    // Function to register user data in our database
    async function registerUserData() {
      try {
        if (!user?.id) {
          console.warn('User object is missing ID');
          return;
        }
        
        console.log('Attempting to register user data for:', user.id);
        
        // Call our direct API endpoint to store user data, bypassing auth issues
        console.log('Calling direct store API for user data...');
        const response = await fetch('/api/auth/store-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to store user data in MongoDB:', response.status, errorText);
        } else {
          const data = await response.json();
          console.log('User data successfully stored in MongoDB:', data.userId);
        }
      } catch (error) {
        console.error('Error registering user data:', error);
      }
    }
    
    // Register user data when component mounts
    registerUserData();
  }, [isLoaded, isSignedIn, user]);
}