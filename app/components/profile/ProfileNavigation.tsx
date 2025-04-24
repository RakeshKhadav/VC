"use client";

import Link from 'next/link';

interface ProfileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ProfileNavigation({ activeTab, onTabChange }: ProfileNavigationProps) {
  const navItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
        </svg>
      )
    },
    {
      id: 'reviews',
      label: 'My Reviews',
      icon: (
        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex w-full items-center py-2 px-3 rounded-md ${
              activeTab === item.id 
                ? 'bg-gray-100 dark:bg-gray-900' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
        
        <Link href="/reviews/new" className="flex items-center py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md">
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
          </svg>
          Write New Review
        </Link>
      </nav>
    </div>
  );
}