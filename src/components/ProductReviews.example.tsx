// Example usage of ProductReviews component
// This file demonstrates how to use the reviews system with mock data

import ProductReviews from "@/components/ProductReviews";
import { mockReviews, mockReviewSummary } from "@/lib/reviews/types";

export default function ProductReviewsExample() {
  return (
    <ProductReviews
      reviews={mockReviews}
      summary={mockReviewSummary}
      title="Customer Reviews"
      subtitle="See what our customers are saying about this product"
      reviewsPerPage={6}
      backgroundColor="gray"
    />
  );
}

// Example with custom data
export function ProductReviewsCustomExample() {
  const customReviews = [
    {
      id: "custom-1",
      rating: 5,
      title: "Amazing product!",
      body: "This exceeded all my expectations. Highly recommended!",
      authorName: "John Doe",
      authorInitials: "JD",
      verifiedPurchase: true,
      date: new Date("2025-12-01"),
      helpfulCount: 10,
    },
  ];

  const customSummary = {
    averageRating: 4.8,
    totalReviews: 50,
    ratingDistribution: {
      5: 40,
      4: 8,
      3: 1,
      2: 1,
      1: 0,
    },
  };

  return (
    <ProductReviews
      reviews={customReviews}
      summary={customSummary}
      title="Product Reviews"
      reviewsPerPage={5}
    />
  );
}

// Example: Empty state
export function ProductReviewsEmptyExample() {
  const emptySummary = {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  };

  return (
    <ProductReviews
      reviews={[]}
      summary={emptySummary}
      title="Customer Reviews"
    />
  );
}
