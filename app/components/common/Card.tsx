"use client";

import { ReactNode } from 'react';

interface CardProps {
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  title,
  subtitle,
  footer,
  className = '',
  padding = 'md',
  children
}: CardProps) {
  // Padding styles
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 dark:border-gray-700 ${paddingStyles[padding]}`}>
          {title && (
            typeof title === 'string' 
              ? <h3 className="text-xl font-medium">{title}</h3>
              : title
          )}
          {subtitle && (
            typeof subtitle === 'string'
              ? <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
              : subtitle
          )}
        </div>
      )}
      
      <div className={paddingStyles[padding]}>
        {children}
      </div>
      
      {footer && (
        <div className={`border-t border-gray-200 dark:border-gray-700 ${paddingStyles[padding]}`}>
          {footer}
        </div>
      )}
    </div>
  );
}