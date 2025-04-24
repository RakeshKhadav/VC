"use client";

import { ReactNode, useState } from "react";
import { useUser } from "@/lib/hooks/useUser";

interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RequireAuth({ children, fallback }: RequireAuthProps) {
  const { isLoading, canViewReview, upgradeRequired, upgradeUser } = useUser();
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Handle the upgrade process
  const handleUpgrade = async () => {
    setIsUpgrading(true);
    const success = await upgradeUser();
    setIsUpgrading(false);
    
    // In a real app, you'd redirect to a payment page here
    // This is just a simulation for the demo
    if (success) {
      // Show success message or trigger confetti, etc.
      console.log("Upgrade successful!");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user can view, show the protected content
  if (canViewReview) {
    return <>{children}</>;
  }

  // If upgrade is required, show the upgrade prompt
  if (upgradeRequired) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4 mt-8">
        <div className="text-xl font-medium text-black">Upgrade Required</div>
        <p className="text-gray-500 text-center">
          You&apos;ve reached your limit of 6 reviews this month.
          Upgrade to premium for unlimited access to all reviews!
        </p>
        
        <div className="border-t border-gray-200 w-full my-4"></div>
        
        <div className="bg-blue-50 p-4 rounded-lg w-full">
          <h3 className="font-bold text-blue-800">Premium Benefits</h3>
          <ul className="list-disc list-inside text-sm mt-2 text-blue-700">
            <li>Unlimited review access</li>
            <li>Early access to new features</li>
            <li>Priority support</li>
          </ul>
        </div>
        
        <button
          onClick={handleUpgrade}
          disabled={isUpgrading}
          className={`px-4 py-2 rounded-md text-white font-medium w-full ${
            isUpgrading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUpgrading ? "Upgrading..." : "Upgrade to Premium"}
        </button>
      </div>
    );
  }

  // Fallback for other cases (shouldn't reach here normally)
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
      <p className="text-yellow-700">
        There was an error checking your access. Please try again.
      </p>
    </div>
  );
}