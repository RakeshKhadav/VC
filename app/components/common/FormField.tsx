"use client";

import { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

export default function FormField({
  id,
  label,
  description,
  required = false,
  error,
  className = '',
  children
}: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {description && (
          <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-1">
            {description}
          </span>
        )}
      </label>
      
      {children}
      
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}