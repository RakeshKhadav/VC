"use client";

import React, { useState } from 'react';
import ReactStars from 'react-stars';

interface StarRatingProps {
  count?: number;
  size?: number;
  value?: number;
  color1?: string;  // Color of inactive stars
  color2?: string;  // Color of active stars
  half?: boolean;
  edit?: boolean;
  onChange?: (newRating: number) => void;
}

export default function StarRating({
  count = 5,
  size = 24,
  value = 0,
  color1 = '#e4e5e9',  // Gray for inactive stars
  color2 = '#ffd700',  // Gold for active stars
  half = true,
  edit = true,
  onChange
}: StarRatingProps) {
  const [rating, setRating] = useState<number>(value);
  
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (onChange) {
      onChange(newRating);
    }
  };

  return (
    <div className="star-rating">
      <ReactStars
        count={count}
        value={rating}
        onChange={handleRatingChange}
        size={size}
        color1={color1}
        color2={color2}
        half={half}
        edit={edit}
      />
      {!edit && rating > 0 && (
        <span className="text-sm text-gray-500 ml-2 inline-block align-middle">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}