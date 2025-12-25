// src/components/common/RatingStars.tsx

import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  color?: string;
}

const sizeClasses = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export default function RatingStars({
  rating,
  size = "md",
  color = "text-yellow-400",
}: RatingStarsProps) {
  const floorRating = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const renderStars = () =>
    Array.from({ length: 5 }).map((_, i) => {
      if (i < floorRating) {
        // Full Star
        return <FaStar key={i} className={`${sizeClasses[size]} ${color}`} />;
      } else if (i === floorRating && hasHalfStar) {
        // You only imported FaStar and FaRegStar, so we'll simulate a half star with a full star for simplicity/consistency with the original intent.
        // For a real half star, you would use something like FaStarHalfAlt
        return <FaStar key={i} className={`${sizeClasses[size]} ${color}`} />;
      } else {
        // Empty Star
        return <FaRegStar key={i} className={`${sizeClasses[size]} ${color}`} />;
      }
    });

  return (
    <div className="flex items-center space-x-0.5">
      {renderStars()}
    </div>
  );
}