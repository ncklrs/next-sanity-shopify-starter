# Product Reviews System

A complete, production-ready product reviews display system for React/Next.js applications. This is a **display-only** implementation that can be easily integrated with any reviews service (Judge.me, Yotpo, Stamped.io, etc.) in the future.

## Features

- **Star Rating Display**: Configurable 1-5 star ratings with support for half stars
- **Average Rating Summary**: Shows overall rating with total review count
- **Rating Distribution**: Visual bar chart showing breakdown by star rating
- **Individual Review Cards**: Rich review cards with author info, dates, and content
- **Review Photos**: Support for photo attachments with lightbox viewer
- **Verified Purchase Badges**: Highlights verified customer purchases
- **Sorting Options**: Sort by newest, highest rating, lowest rating, or most helpful
- **Load More Pagination**: Progressive loading for better performance
- **Helpful Voting**: Allow users to mark reviews as helpful
- **Empty States**: Graceful handling when no reviews exist
- **Responsive Design**: Mobile-first, adapts to all screen sizes
- **Accessible**: Proper ARIA labels and semantic HTML

## File Structure

```
src/
├── lib/
│   └── reviews/
│       └── types.ts              # TypeScript types and mock data
├── components/
│   ├── ui/
│   │   └── star-rating.tsx       # Reusable star rating component
│   ├── ReviewCard.tsx            # Individual review card
│   ├── ProductReviews.tsx        # Main reviews display component
│   └── ProductReviews.example.tsx # Usage examples
```

## Components

### 1. StarRating (`src/components/ui/star-rating.tsx`)

A flexible star rating component that displays 1-5 stars with support for half stars.

**Props:**
- `rating` (number, required): Rating value 0-5, supports decimals
- `size` ("sm" | "md" | "lg", default: "md"): Star size
- `showValue` (boolean, default: false): Display numeric rating value
- `maxStars` (number, default: 5): Maximum number of stars

**Usage:**
```tsx
import StarRating from "@/components/ui/star-rating";

<StarRating rating={4.5} size="lg" showValue />
```

### 2. ReviewCard (`src/components/ReviewCard.tsx`)

Displays an individual review with author info, rating, content, and photos.

**Props:**
- `review` (Review, required): Review object
- `onHelpful` (function, optional): Callback when user marks review as helpful

**Features:**
- Avatar display (image or initials fallback)
- Verified purchase badge
- Formatted date display
- Photo thumbnails with lightbox modal
- Helpful voting button

**Usage:**
```tsx
import ReviewCard from "@/components/ReviewCard";

<ReviewCard
  review={reviewData}
  onHelpful={(id) => console.log(`Review ${id} marked helpful`)}
/>
```

### 3. ProductReviews (`src/components/ProductReviews.tsx`)

Main component that displays the complete reviews section with summary, distribution, and individual reviews.

**Props:**
- `reviews` (Review[], required): Array of review objects
- `summary` (ReviewSummary, required): Review statistics
- `reviewsPerPage` (number, default: 6): Reviews to show per page
- `title` (string, default: "Customer Reviews"): Section title
- `subtitle` (string, optional): Section subtitle
- `backgroundColor` (string, optional): Section background color

**Features:**
- Average rating display
- Rating distribution chart
- Sort controls (newest, highest, lowest, most helpful)
- Responsive grid layout
- Load more pagination
- Empty state handling

**Usage:**
```tsx
import ProductReviews from "@/components/ProductReviews";
import { mockReviews, mockReviewSummary } from "@/lib/reviews/types";

<ProductReviews
  reviews={mockReviews}
  summary={mockReviewSummary}
  title="Customer Reviews"
  subtitle="See what our customers are saying"
  reviewsPerPage={6}
  backgroundColor="gray"
/>
```

## Types

### Review Interface
```typescript
interface Review {
  id: string;
  rating: number; // 1-5
  title?: string;
  body: string;
  authorName: string;
  authorInitials?: string;
  authorAvatar?: string;
  verifiedPurchase?: boolean;
  date: Date | string;
  helpfulCount?: number;
  photos?: ReviewPhoto[];
}
```

### ReviewSummary Interface
```typescript
interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
```

### ReviewPhoto Interface
```typescript
interface ReviewPhoto {
  id: string;
  url: string;
  alt?: string;
  thumbnail?: string;
}
```

## Mock Data

The system includes comprehensive mock data for development and testing:

- `mockReviewSummary`: Sample review statistics
- `mockReviews`: 10 diverse sample reviews with varying ratings, content, and features

Import from: `@/lib/reviews/types`

## Styling

The components use the existing design system variables:

- Colors: CSS variables (`--foreground`, `--accent-amber`, `--accent-violet`, etc.)
- Typography: Existing typography classes (`heading-md`, `body-lg`, etc.)
- Components: Leverages existing `Button`, `Badge`, and `Card` components
- Responsive: Mobile-first with breakpoints at `md` (768px) and `lg` (1024px)

## Integration with Reviews Services

To integrate with a reviews service (Judge.me, Yotpo, Stamped.io, etc.):

1. **Fetch reviews from API:**
```typescript
async function getProductReviews(productId: string) {
  // Example: Fetch from your reviews service API
  const response = await fetch(`/api/reviews/${productId}`);
  const data = await response.json();

  // Transform to match Review interface
  return {
    reviews: data.reviews.map(transformReview),
    summary: calculateSummary(data.reviews)
  };
}
```

2. **Transform API data to match interfaces:**
```typescript
function transformReview(apiReview: any): Review {
  return {
    id: apiReview.id,
    rating: apiReview.rating,
    title: apiReview.title,
    body: apiReview.content,
    authorName: apiReview.author.name,
    authorAvatar: apiReview.author.avatar,
    verifiedPurchase: apiReview.verified,
    date: new Date(apiReview.created_at),
    helpfulCount: apiReview.helpful_count,
    photos: apiReview.images?.map(img => ({
      id: img.id,
      url: img.url,
      thumbnail: img.thumbnail
    }))
  };
}
```

3. **Use in your page/component:**
```typescript
export default async function ProductPage({ params }) {
  const { reviews, summary } = await getProductReviews(params.id);

  return (
    <ProductReviews reviews={reviews} summary={summary} />
  );
}
```

## Future Enhancements

Potential features to add when integrating with a reviews service:

- [ ] Review submission form
- [ ] Review moderation (admin)
- [ ] Review filtering (by rating, verified only, with photos)
- [ ] Review search
- [ ] Pagination (API-based, not just client-side)
- [ ] Review voting (helpful/not helpful)
- [ ] Reply to reviews (merchant)
- [ ] Review incentive badges
- [ ] Review analytics
- [ ] Schema markup (SEO)

## Examples

See `ProductReviews.example.tsx` for complete working examples:
- Basic usage with mock data
- Custom data example
- Empty state example

## Accessibility

All components follow accessibility best practices:
- Proper ARIA labels
- Semantic HTML structure
- Keyboard navigation support
- Focus management
- Screen reader friendly

## Browser Support

Compatible with all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
