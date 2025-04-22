import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-sm">
      <div className="flex items-center">
        <Link href="/" className="font-medium text-lg mr-8">Backchannel</Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
            Home
          </Link>
          <Link href="/reviews" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
            Explore Reviews
          </Link>
          <Link href="/about" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
            About
          </Link>
          <Link href="/faq" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
            FAQ
          </Link>
        </nav>
      </div>
      
      <div className="flex items-center gap-3">
        <SignedIn>
          <Link href="/reviews/new" className="hidden md:block text-sm px-4 py-2 rounded-md bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            Write Review
          </Link>
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
              <Link href="/user-profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Your Profile
              </Link>
              <Link href="/user-profile/reviews" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Your Reviews
              </Link>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Settings
              </Link>
            </div>
          </div>
        </SignedIn>
        
        <SignedOut>
          <Link href="/reviews" className="hidden md:block text-sm px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
            Explore Reviews
          </Link>
          <Link href="/sign-in" className="text-sm px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Sign in
          </Link>
          <Link href="/sign-up" className="text-sm px-4 py-2 rounded-md bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            Sign up
          </Link>
        </SignedOut>
        
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