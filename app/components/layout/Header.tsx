"use client";

import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
  useUser
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import Logo from "@/app/components/common/Logo";
import NavigationLink from "./NavigationLink";

export default function Header() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  
  // Function to handle navigation for protected routes
  const handleProtectedNav = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isSignedIn) {
      e.preventDefault();
      router.push("/sign-up");
    }
  };
  
  return (
    <header className="sticky top-0 z-30 flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-sm">
      <div className="flex items-center">
        <Logo className="font-medium text-lg mr-8" />
        <nav className="hidden md:flex space-x-6">
          <NavigationLink href="/">Home</NavigationLink>

          {/* Show different navigation based on auth state */}
          <SignedIn>
            <NavigationLink href="/reviews">Explore Reviews</NavigationLink>
            <NavigationLink href="/about">About</NavigationLink>
            <NavigationLink href="/faq">FAQ</NavigationLink>
          </SignedIn>
          
          <SignedOut>
            <NavigationLink 
              href="/sign-up" 
              onClick={(e) => handleProtectedNav(e)}
            >
              Explore Reviews
            </NavigationLink>
            <NavigationLink href="/about">About</NavigationLink>
            <NavigationLink href="/faq">FAQ</NavigationLink>
          </SignedOut>
        </nav>
      </div>
      
      <div className="flex items-center gap-3">
        {!isLoaded ? (
          // Loading state if needed
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        ) : isSignedIn ? (
          // User is signed in
          <>
            <NavigationLink 
              href="/dashboard" 
              className="hidden md:block text-sm px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Dashboard
            </NavigationLink>
            <NavigationLink 
              href="/reviews/new" 
              className="hidden md:block text-sm px-4 py-2 rounded-md bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Write Review
            </NavigationLink>
            <div className="relative group">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                  }
                }}
                afterSignOutUrl="/"
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                <NavigationLink 
                  href="/dashboard" 
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Dashboard
                </NavigationLink>
                <NavigationLink 
                  href="/user-profile" 
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Your Profile
                </NavigationLink>
                <NavigationLink 
                  href="/user-profile" 
                  onClick={() => (document.querySelector('button[aria-label="My Reviews"]') as HTMLElement)?.click()}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Your Reviews
                </NavigationLink>
              </div>
            </div>
          </>
        ) : (
          // User is signed out
          <>
            <SignInButton mode="modal">
              <button className="text-sm px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-sm px-4 py-2 rounded-md bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                Sign up
              </button>
            </SignUpButton>
          </>
        )}
        
        {/* Mobile menu button - would implement with state in a real app */}
        <button className="md:hidden text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}