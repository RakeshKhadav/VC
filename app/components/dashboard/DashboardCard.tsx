"use client";

import Link from 'next/link';
import { ReactNode } from 'react';
import Card from '@/app/components/common/Card';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  viewAllLink?: string;
  className?: string;
}

export default function DashboardCard({
  title,
  children,
  viewAllLink,
  className = ''
}: DashboardCardProps) {
  return (
    <Card className={className} padding="md">
      <div className={`flex justify-between items-center ${viewAllLink ? 'mb-4' : 'mb-0'}`}>
        <h2 className="text-xl font-medium">{title}</h2>
        
        {viewAllLink && (
          <Link 
            href={viewAllLink} 
            className="text-sm font-medium text-black dark:text-white hover:underline"
          >
            View all
          </Link>
        )}
      </div>
      
      {viewAllLink && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="pt-4">
            {children}
          </div>
        </div>
      )}
      
      {!viewAllLink && children}
    </Card>
  );
}