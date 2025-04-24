"use client";

import Link from 'next/link';
import DashboardCard from './DashboardCard';

interface QuickAction {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export default function QuickActions() {
  const actions: QuickAction[] = [
    {
      href: '/reviews/new',
      icon: (
        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
        </svg>
      ),
      label: 'Write a New Review'
    },
    {
      href: '/user-profile',
      icon: (
        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
        </svg>
      ),
      label: 'View Your Profile'
    },
    {
      href: '/user-profile?tab=reviews',
      icon: (
        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
        </svg>
      ),
      label: 'Manage Your Reviews'
    }
  ];

  return (
    <DashboardCard title="Quick Actions">
      <div className="space-y-3">
        {actions.map((action) => (
          <Link 
            key={action.href}
            href={action.href} 
            className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {action.icon}
            {action.label}
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}