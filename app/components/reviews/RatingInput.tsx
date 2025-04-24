"use client";

import StarRating from "@/app/components/ui/StarRating";

interface RatingInputProps {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
}

export default function RatingInput({
  label,
  description,
  value,
  onChange,
  required = false
}: RatingInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {description && (
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            ({description})
          </span>
        )}
      </label>
      <div className="flex items-center">
        <StarRating 
          value={value}
          onChange={onChange} 
        />
        <input 
          type="hidden" 
          value={value}
          required={required}
        />
        {value > 0 && (
          <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
            {value.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}