"use client";

import Image from 'next/image';
import { UserResource } from '@clerk/types';

interface UserProfileHeaderProps {
  user: UserResource;
}

export default function UserProfileHeader({ user }: UserProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-4">
        {user.imageUrl ? (
          <div className="relative w-full h-full">
            <Image 
              src={user.imageUrl} 
              alt={user.firstName || 'Profile'} 
              fill
              sizes="(max-width: 768px) 96px, 96px"
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-2xl">
            {(user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '')}
          </div>
        )}
      </div>
      <h2 className="text-xl font-medium">
        {user.firstName} {user.lastName}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
        {user.emailAddresses[0]?.emailAddress}
      </p>
    </div>
  );
}