"use client";

import { useState, useMemo, type HTMLAttributes } from "react";
import StarRating from "@/components/ui/star-rating";
import Button from "@/components/ui/Button";
import ReviewCard from "@/components/ReviewCard";
import { ChevronDownIcon } from "@/components/icons";
import type { Review, ReviewSummary, ReviewSortOption } from "@/lib/reviews/types";

interface ProductReviewsProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  reviews: Review[];
  summary: ReviewSummary;
  reviewsPerPage?: number;
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
}

export default function ProductReviews({
  reviews: initialReviews,
  summary,
  reviewsPerPage = 6,
  title = "Customer Reviews",
  subtitle,
  backgroundColor,
  className = "",
  ...props
}: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState<ReviewSortOption>("newest");
  const [visibleCount, setVisibleCount] = useState(reviewsPerPage);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());

  // Sort reviews based on selected option
  const sortedReviews = useMemo(() => {
    const reviewsCopy = [...initialReviews];

    switch (sortBy) {
      case "newest":
        return reviewsCopy.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
      case "highest":
        return reviewsCopy.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return reviewsCopy.sort((a, b) => a.rating - b.rating);
      case "helpful":
        return reviewsCopy.sort((a, b) => {
          const helpfulA = (a.helpfulCount || 0) + (helpfulReviews.has(a.id) ? 1 : 0);
          const helpfulB = (b.helpfulCount || 0) + (helpfulReviews.has(b.id) ? 1 : 0);
          return helpfulB - helpfulA;
        });
      default:
        return reviewsCopy;
    }
  }, [initialReviews, sortBy, helpfulReviews]);

  const visibleReviews = sortedReviews.slice(0, visibleCount);
  const hasMoreReviews = visibleCount < sortedReviews.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + reviewsPerPage);
  };

  const handleHelpful = (reviewId: string) => {
    setHelpfulReviews((prev) => new Set(prev).add(reviewId));
  };

  const getBackgroundStyle = (): React.CSSProperties | undefined => {
    if (!backgroundColor) return undefined;
    const colorMap: Record<string, string> = {
      white: "var(--background)",
      default: "var(--background)",
      gray: "var(--background-secondary)",
      secondary: "var(--background-secondary)",
      primary: "var(--background-tertiary)",
      tertiary: "var(--background-tertiary)",
      transparent: "transparent",
    };
    const mappedColor = colorMap[backgroundColor.toLowerCase()];
    return mappedColor ? { backgroundColor: mappedColor } : { backgroundColor };
  };

  // Calculate rating percentage for distribution bars
  const getRatingPercentage = (count: number): number => {
    return summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
  };

  return (
    <section
      className={`section ${className}`}
      style={getBackgroundStyle()}
      {...props}
    >
      <div className="container">
        {/* Header */}
        {(title || subtitle) && (
          <div className="section-header mb-12">
            <h2 className="display-lg mb-4">{title}</h2>
            {subtitle && <p className="body-lg">{subtitle}</p>}
          </div>
        )}

        {/* Reviews Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Average Rating */}
          <div className="card hover:transform-none">
            <div className="text-center">
              <div className="text-6xl font-bold text-[var(--foreground)] mb-2">
                {summary.averageRating.toFixed(1)}
              </div>
              <StarRating rating={summary.averageRating} size="lg" className="justify-center mb-3" />
              <p className="text-[var(--foreground-muted)]">
                Based on {summary.totalReviews} review{summary.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="card hover:transform-none">
            <div className="space-y-3">
              {([5, 4, 3, 2, 1] as const).map((stars) => {
                const count = summary.ratingDistribution[stars];
                const percentage = getRatingPercentage(count);

                return (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[var(--foreground)] w-12">
                      {stars} star{stars !== 1 ? "s" : ""}
                    </span>
                    <div className="flex-1 h-3 bg-[var(--surface)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--accent-amber)] to-[var(--accent-rose)] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-[var(--foreground-muted)] w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        {initialReviews.length > 0 && (
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h3 className="heading-md">
              {visibleReviews.length} of {sortedReviews.length} review{sortedReviews.length !== 1 ? "s" : ""}
            </h3>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-reviews" className="text-sm font-medium text-[var(--foreground-muted)]">
                Sort by:
              </label>
              <div className="relative">
                <select
                  id="sort-reviews"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as ReviewSortOption)}
                  className="appearance-none bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2 pr-10 text-sm font-medium text-[var(--foreground)] hover:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-violet)] transition-colors cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)] pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {visibleReviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {visibleReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onHelpful={handleHelpful}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreReviews && (
              <div className="mt-12 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLoadMore}
                  className="min-w-[200px]"
                >
                  Load More Reviews
                </Button>
                <p className="text-sm text-[var(--foreground-muted)] mt-3">
                  Showing {visibleCount} of {sortedReviews.length}
                </p>
              </div>
            )}
          </>
        ) : (
          // Empty State
          <div className="card hover:transform-none text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--surface)] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10 text-[var(--foreground-muted)]"
                >
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <h3 className="heading-md mb-2">No reviews yet</h3>
              <p className="text-[var(--foreground-muted)]">
                Be the first to share your thoughts about this product!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
