"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { StarIcon } from "@/components/icons";

type StarSize = "sm" | "md" | "lg";

interface StarRatingProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  rating: number; // 0-5, supports decimals for half stars
  size?: StarSize;
  showValue?: boolean;
  maxStars?: number;
}

const StarRating = forwardRef<HTMLDivElement, StarRatingProps>(
  (
    {
      rating,
      size = "md",
      showValue = false,
      maxStars = 5,
      className = "",
      ...props
    },
    ref
  ) => {
    // Clamp rating between 0 and maxStars
    const clampedRating = Math.max(0, Math.min(maxStars, rating));

    const sizeClasses: Record<StarSize, string> = {
      sm: "w-3 h-3",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const textSizeClasses: Record<StarSize, string> = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    const getStarType = (index: number): "full" | "half" | "empty" => {
      const starValue = index + 1;
      if (clampedRating >= starValue) {
        return "full";
      } else if (clampedRating >= starValue - 0.5) {
        return "half";
      }
      return "empty";
    };

    return (
      <div
        ref={ref}
        className={`flex items-center gap-1 ${className}`}
        aria-label={`Rating: ${rating.toFixed(1)} out of ${maxStars} stars`}
        {...props}
      >
        <div className="flex gap-0.5">
          {Array.from({ length: maxStars }).map((_, index) => {
            const starType = getStarType(index);

            return (
              <div
                key={index}
                className="relative"
                style={{ width: sizeClasses[size].split(" ")[0].replace("w-", "") }}
              >
                {starType === "full" && (
                  <StarIcon
                    className={`${sizeClasses[size]} text-[var(--accent-amber)] transition-colors`}
                    aria-hidden="true"
                  />
                )}
                {starType === "half" && (
                  <>
                    <StarIcon
                      className={`${sizeClasses[size]} text-[var(--foreground-subtle)] opacity-30 transition-colors`}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                      <StarIcon
                        className={`${sizeClasses[size]} text-[var(--accent-amber)] transition-colors`}
                        aria-hidden="true"
                      />
                    </div>
                  </>
                )}
                {starType === "empty" && (
                  <StarIcon
                    className={`${sizeClasses[size]} text-[var(--foreground-subtle)] opacity-30 transition-colors`}
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>

        {showValue && (
          <span
            className={`${textSizeClasses[size]} font-medium text-[var(--foreground-muted)] ml-1`}
          >
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    );
  }
);

StarRating.displayName = "StarRating";

export default StarRating;
