// ═══════════════════════════════════════════════════════════════════════════
// REVIEW TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Review {
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

export interface ReviewPhoto {
  id: string;
  url: string;
  alt?: string;
  thumbnail?: string;
}

export interface ReviewSummary {
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

export type ReviewSortOption = "newest" | "highest" | "lowest" | "helpful";

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA FOR DEMO
// ═══════════════════════════════════════════════════════════════════════════

export const mockReviewSummary: ReviewSummary = {
  averageRating: 4.6,
  totalReviews: 128,
  ratingDistribution: {
    5: 89,
    4: 28,
    3: 7,
    2: 3,
    1: 1,
  },
};

export const mockReviews: Review[] = [
  {
    id: "1",
    rating: 5,
    title: "Exceeded my expectations!",
    body: "This product is absolutely fantastic. The quality is top-notch and it arrived faster than expected. I've been using it daily for the past month and couldn't be happier with my purchase.",
    authorName: "Sarah Johnson",
    authorInitials: "SJ",
    verifiedPurchase: true,
    date: new Date("2025-11-15"),
    helpfulCount: 24,
    photos: [
      {
        id: "p1",
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        alt: "Product photo",
        thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "2",
    rating: 5,
    title: "Best purchase this year",
    body: "I was skeptical at first, but this product has completely changed my daily routine. The attention to detail is impressive, and customer service was incredibly helpful when I had questions.",
    authorName: "Michael Chen",
    authorInitials: "MC",
    authorAvatar: "https://i.pravatar.cc/150?img=12",
    verifiedPurchase: true,
    date: new Date("2025-11-10"),
    helpfulCount: 18,
  },
  {
    id: "3",
    rating: 4,
    title: "Great quality, minor issue",
    body: "Overall very satisfied with this purchase. The build quality is excellent and it works as advertised. Only minor complaint is that the instructions could be clearer, but I figured it out eventually.",
    authorName: "Emily Rodriguez",
    authorInitials: "ER",
    verifiedPurchase: true,
    date: new Date("2025-11-08"),
    helpfulCount: 12,
  },
  {
    id: "4",
    rating: 5,
    title: "Worth every penny",
    body: "I've tried similar products before, but this one stands out. The design is sleek, functionality is perfect, and it feels premium. Highly recommend to anyone considering it.",
    authorName: "David Park",
    authorInitials: "DP",
    verifiedPurchase: true,
    date: new Date("2025-11-05"),
    helpfulCount: 31,
    photos: [
      {
        id: "p2",
        url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
        alt: "Product in use",
        thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop",
      },
      {
        id: "p3",
        url: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop",
        alt: "Close-up detail",
        thumbnail: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "5",
    rating: 4,
    title: "Solid product",
    body: "Does exactly what it's supposed to do. No complaints about the product itself. Shipping took a bit longer than expected, but the product quality makes up for it.",
    authorName: "Jessica Williams",
    authorInitials: "JW",
    verifiedPurchase: true,
    date: new Date("2025-11-01"),
    helpfulCount: 8,
  },
  {
    id: "6",
    rating: 5,
    title: "Amazing!",
    body: "Can't say enough good things about this. It's become an essential part of my routine. The quality is evident from the moment you open the box.",
    authorName: "Robert Taylor",
    authorInitials: "RT",
    authorAvatar: "https://i.pravatar.cc/150?img=33",
    verifiedPurchase: true,
    date: new Date("2025-10-28"),
    helpfulCount: 15,
  },
  {
    id: "7",
    rating: 3,
    title: "It's okay",
    body: "The product works as described, but I expected a bit more for the price. It's functional and does the job, just not as impressive as I hoped based on the reviews.",
    authorName: "Amanda Lewis",
    authorInitials: "AL",
    verifiedPurchase: true,
    date: new Date("2025-10-25"),
    helpfulCount: 5,
  },
  {
    id: "8",
    rating: 5,
    title: "Highly recommended",
    body: "This is my second one - I liked the first so much I bought another as a gift. Quality craftsmanship and excellent value for money. The recipient was thrilled!",
    authorName: "Thomas Anderson",
    authorInitials: "TA",
    verifiedPurchase: true,
    date: new Date("2025-10-20"),
    helpfulCount: 22,
  },
  {
    id: "9",
    rating: 4,
    title: "Very good product",
    body: "Happy with my purchase overall. The features are great and it's easy to use. Lost one star because the packaging was a bit damaged, but the product itself was fine.",
    authorName: "Lisa Martinez",
    authorInitials: "LM",
    authorAvatar: "https://i.pravatar.cc/150?img=45",
    verifiedPurchase: true,
    date: new Date("2025-10-15"),
    helpfulCount: 6,
  },
  {
    id: "10",
    rating: 5,
    title: "Perfect!",
    body: "Exactly what I was looking for. Fast shipping, great quality, and the customer support team answered my pre-purchase questions promptly. Will definitely buy from this company again.",
    authorName: "James White",
    authorInitials: "JW",
    verifiedPurchase: true,
    date: new Date("2025-10-12"),
    helpfulCount: 19,
    photos: [
      {
        id: "p4",
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        alt: "Unboxing photo",
        thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
      },
    ],
  },
];
