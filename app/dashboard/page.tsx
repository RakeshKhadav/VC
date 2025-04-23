import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();
  
  // Redirect if not logged in
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user.firstName}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-medium mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              href="/reviews/new" 
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
              </svg>
              Write a New Review
            </Link>
            <Link 
              href="/user-profile" 
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
              </svg>
              View Your Profile
            </Link>
            <Link 
              href="/user-profile/reviews" 
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
              </svg>
              Manage Your Reviews
            </Link>
          </div>
        </div>
        
        {/* Recent Activity Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm md:col-span-2">
          <h2 className="text-xl font-medium mb-4">Recent Activity</h2>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="py-4 flex flex-col space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You haven't submitted any reviews yet.
              </p>
              <Link 
                href="/reviews/new" 
                className="text-sm font-medium text-black dark:text-white hover:underline"
              >
                Write your first review →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Popular VCs Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-medium mb-4">Popular VCs</h2>
          <div className="space-y-4">
            {["Sequoia Capital", "Andreessen Horowitz", "Y Combinator", "Accel"].map((vc, index) => (
              <div 
                key={index} 
                className="p-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <span>{vc}</span>
                <Link 
                  href={`/vc/${vc.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-black dark:text-white hover:underline"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Reviews Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Recent Reviews</h2>
            <Link 
              href="/reviews" 
              className="text-sm font-medium text-black dark:text-white hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No reviews available yet. Check back soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}