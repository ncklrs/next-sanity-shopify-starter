"use client";

import { forwardRef, useState, type HTMLAttributes } from "react";
import StarRating from "@/components/ui/star-rating";
import Badge from "@/components/ui/Badge";
import { CheckIcon, ImageIcon } from "@/components/icons";
import type { Review } from "@/lib/reviews/types";

interface ReviewCardProps extends HTMLAttributes<HTMLDivElement> {
  review: Review;
  onHelpful?: (reviewId: string) => void;
}

const ReviewCard = forwardRef<HTMLDivElement, ReviewCardProps>(
  ({ review, onHelpful, className = "", ...props }, ref) => {
    const [isHelpful, setIsHelpful] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    const handleHelpfulClick = () => {
      if (!isHelpful) {
        setIsHelpful(true);
        onHelpful?.(review.id);
      }
    };

    const formatDate = (date: Date | string): string => {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(dateObj);
    };

    const getInitials = (): string => {
      if (review.authorInitials) {
        return review.authorInitials;
      }
      const names = review.authorName.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return review.authorName.slice(0, 2).toUpperCase();
    };

    return (
      <>
        <div
          ref={ref}
          className={`card hover:transform-none ${className}`}
          {...props}
        >
          {/* Header: Avatar, Name, Date */}
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar */}
            {review.authorAvatar ? (
              <img
                src={review.authorAvatar}
                alt={review.authorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-[var(--border)]"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-violet)] text-white"
                aria-label={review.authorName}
              >
                {getInitials()}
              </div>
            )}

            {/* Name, Date, Verified Badge */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-[var(--foreground)]">
                  {review.authorName}
                </h4>
                {review.verifiedPurchase && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckIcon className="w-3 h-3" />
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <p className="text-sm text-[var(--foreground-muted)] mt-1">
                {formatDate(review.date)}
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <StarRating rating={review.rating} size="md" className="mb-3" />

          {/* Review Title */}
          {review.title && (
            <h5 className="font-semibold text-[var(--foreground)] mb-2">
              {review.title}
            </h5>
          )}

          {/* Review Body */}
          <p className="text-[var(--foreground-muted)] leading-relaxed mb-4">
            {review.body}
          </p>

          {/* Review Photos */}
          {review.photos && review.photos.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {review.photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo.url)}
                  className="group relative w-20 h-20 rounded-lg overflow-hidden border border-[var(--border)] hover:border-[var(--accent-violet)] transition-all hover:scale-105"
                  aria-label="View photo"
                >
                  <img
                    src={photo.thumbnail || photo.url}
                    alt={photo.alt || "Review photo"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Helpful Button */}
          <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
            <button
              onClick={handleHelpfulClick}
              disabled={isHelpful}
              className={`text-sm font-medium transition-colors ${
                isHelpful
                  ? "text-[var(--accent-violet)] cursor-default"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {isHelpful ? "Thanks for your feedback!" : "Was this helpful?"}
            </button>
            {review.helpfulCount !== undefined && review.helpfulCount > 0 && (
              <span className="text-sm text-[var(--foreground-muted)]">
                {review.helpfulCount + (isHelpful ? 1 : 0)} people found this helpful
              </span>
            )}
          </div>
        </div>

        {/* Photo Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-pointer"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <img
                src={selectedPhoto}
                alt="Review photo enlarged"
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Close photo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
);

ReviewCard.displayName = "ReviewCard";

export default ReviewCard;
