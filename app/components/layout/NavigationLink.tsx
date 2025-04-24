"use client";

import Link from 'next/link';
import { ReactNode } from 'react';

interface NavigationLinkProps {
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  children: ReactNode;
}

export default function NavigationLink({
  href,
  onClick,
  className = "text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white",
  children
}: NavigationLinkProps) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={className}
    >
      {children}
    </Link>
  );
}