"use client";

import AuthCheck from "@/app/components/auth/AuthCheck";

export default function ExploreClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthCheck 
        redirectUrl="/sign-up" 
        redirectDelay={5000}
      />
      {children}
    </>
  );
}