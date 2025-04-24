"use client";

import { useAuth, useSession } from "@clerk/nextjs";
import { useEffect } from "react";

// This component actively checks and refreshes Clerk sessions
// It's designed to be included in pages where authentication is required
export default function SessionCheck() {
  const { getToken, isSignedIn } = useAuth();
  const { session } = useSession();

  // Effect to periodically validate and refresh the session token
  useEffect(() => {
    if (!isSignedIn || !session) return;

    // Check token validity and refresh it if needed
    const validateSession = async () => {
      try {
        // Simply request the token to ensure it's valid and refreshed
        await getToken();
      } catch (error) {
        console.error("Session validation error:", error);
      }
    };

    // Initial validation
    validateSession();

    // Set up periodic validation (every 5 minutes)
    const intervalId = setInterval(validateSession, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [getToken, isSignedIn, session]);

  // This component doesn't render anything visible
  return null;
}