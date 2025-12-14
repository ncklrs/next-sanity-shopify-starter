# Recently Viewed Products - Usage Guide

This guide shows how to use the recently viewed products tracking system in your Next.js app.

## Overview

The recently viewed products system consists of three main parts:

1. **`useRecentlyViewed` hook** - Manages localStorage tracking
2. **`RecentlyViewedProducts` component** - Displays the product grid
3. **`ProductPageClient` wrapper** - Automatically tracks product views

## Files Created

- `/src/hooks/useRecentlyViewed.ts` - Hook for tracking product views
- `/src/components/RecentlyViewedProducts.tsx` - Display component with grid layout
- `/src/components/ProductPageClient.tsx` - Client wrapper for auto-tracking

---

## 1. Hook Usage: `useRecentlyViewed`

The hook provides methods to track and manage recently viewed products.

### API

```typescript
const {
  recentlyViewed,          // string[] - Array of product handles
  addToRecentlyViewed,     // (handle: string) => void
  getRecentlyViewed,       // () => string[]
  clearRecentlyViewed,     // () => void
  isHydrated,              // boolean - Safe for SSR
} = useRecentlyViewed();
```

### Example: Manual Tracking

```tsx
"use client";

import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

export function ProductCard({ product }) {
  const { addToRecentlyViewed } = useRecentlyViewed();

  const handleClick = () => {
    addToRecentlyViewed(product.handle);
    // Navigate to product...
  };

  return (
    <div onClick={handleClick}>
      {/* Product card content */}
    </div>
  );
}
```

---

## 2. Component Usage: `RecentlyViewedProducts`

Display recently viewed products in a responsive grid.

### Props

```typescript
interface RecentlyViewedProductsProps {
  className?: string;          // Additional CSS classes
  title?: string;              // Section title (default: "Recently Viewed")
  maxItems?: number;           // Max products to display (default: 10)
  showClearButton?: boolean;   // Show clear history button (default: true)
}
```

### Example: Homepage Section

```tsx
import RecentlyViewedProducts from "@/components/RecentlyViewedProducts";

export default function HomePage() {
  return (
    <main>
      {/* Your homepage content */}

      <RecentlyViewedProducts
        title="Continue Shopping"
        maxItems={8}
        className="bg-[var(--background-secondary)]"
      />
    </main>
  );
}
```

### Example: Dedicated Page

```tsx
// src/app/(site)/recently-viewed/page.tsx
import RecentlyViewedProducts from "@/components/RecentlyViewedProducts";

export const metadata = {
  title: "Recently Viewed Products",
  description: "Products you've recently viewed",
};

export default function RecentlyViewedPage() {
  return (
    <main className="min-h-screen">
      <RecentlyViewedProducts
        title="Your Viewing History"
        maxItems={20}
      />
    </main>
  );
}
```

---

## 3. Auto-Tracking: `ProductPageClient`

Automatically track products when users view product detail pages.

### Example: Product Detail Page

```tsx
// src/app/(site)/products/[handle]/page.tsx
import { getProductByHandle } from "@/lib/shopify";
import { ProductPageClient } from "@/components/ProductPageClient";
import RecentlyViewedProducts from "@/components/RecentlyViewedProducts";

export default async function ProductDetailPage({
  params
}: {
  params: { handle: string }
}) {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <ProductPageClient productHandle={params.handle}>
      <main>
        {/* Product details */}
        <section>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          {/* More product content... */}
        </section>

        {/* Show other recently viewed products */}
        <RecentlyViewedProducts
          title="You May Also Like"
          maxItems={4}
          showClearButton={false}
        />
      </main>
    </ProductPageClient>
  );
}
```

---

## 4. Advanced Usage Examples

### Custom Display Component

If you need custom styling or different data:

```tsx
"use client";

import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useState, useEffect } from "react";
import { getProductByHandle } from "@/lib/shopify/queries";

export function CustomRecentlyViewed() {
  const { recentlyViewed, isHydrated } = useRecentlyViewed();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!isHydrated) return;

    async function loadProducts() {
      const handles = recentlyViewed.slice(0, 5);
      const productData = await Promise.all(
        handles.map(handle => getProductByHandle(handle))
      );
      setProducts(productData.filter(Boolean));
    }

    loadProducts();
  }, [recentlyViewed, isHydrated]);

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          {/* Your custom product display */}
        </div>
      ))}
    </div>
  );
}
```

### Sidebar Widget

```tsx
"use client";

import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

export function RecentlyViewedSidebar() {
  const { recentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  return (
    <aside className="sticky top-4">
      <h3 className="font-bold mb-4">Recently Viewed</h3>
      <ul className="space-y-2">
        {recentlyViewed.slice(0, 5).map(handle => (
          <li key={handle}>
            <a href={`/products/${handle}`}>
              View {handle}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

---

## 5. Features

### Automatic Features

- **Max 10 items**: Automatically limits to 10 most recent products
- **Duplicate handling**: Same product viewed twice moves to top
- **localStorage persistence**: Survives page refreshes
- **SSR-safe**: Uses hydration flag to prevent SSR issues
- **Error handling**: Gracefully handles fetch failures

### Component Features

- **Loading skeleton**: Displays while fetching product data
- **Empty state**: Shows message when no products viewed
- **Clear history**: Optional button to clear all history
- **Responsive grid**: Mobile-first responsive design
- **Product variants**: Shows color swatches if available

---

## 6. LocalStorage Structure

Data is stored in localStorage under the key `aurora-recently-viewed`:

```json
[
  "product-handle-1",
  "product-handle-2",
  "product-handle-3"
]
```

Maximum: 10 items
Order: Most recent first

---

## 7. Styling

The component uses CSS variables for theming:

```css
--foreground          /* Text color */
--foreground-muted    /* Subtle text */
--surface             /* Card background */
--background-tertiary /* Loading skeleton */
--accent-rose         /* Sale price */
--border              /* Borders */
```

Override with custom classes:

```tsx
<RecentlyViewedProducts
  className="my-custom-class bg-white dark:bg-black"
/>
```

---

## 8. Performance Considerations

### Client-Side Only

All components are marked with `"use client"` because they:
- Use React hooks (useState, useEffect)
- Access localStorage (browser API)
- Need interactivity

### Parallel Fetching

Products are fetched in parallel using `Promise.all()` for optimal performance.

### Error Resilience

If a product fails to fetch (deleted, etc.), the component:
- Logs the error to console
- Continues loading other products
- Displays only successfully fetched products

---

## 9. TypeScript Support

All components and hooks are fully typed:

```typescript
// Hook return type
interface UseRecentlyViewedReturn {
  recentlyViewed: string[];
  addToRecentlyViewed: (handle: string) => void;
  getRecentlyViewed: () => string[];
  clearRecentlyViewed: () => void;
  isHydrated: boolean;
}

// Component props
interface RecentlyViewedProductsProps {
  className?: string;
  title?: string;
  maxItems?: number;
  showClearButton?: boolean;
}
```

---

## 10. Testing

### Test the Hook

```tsx
import { renderHook, act } from '@testing-library/react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

test('adds product to recently viewed', () => {
  const { result } = renderHook(() => useRecentlyViewed());

  act(() => {
    result.current.addToRecentlyViewed('test-product');
  });

  expect(result.current.recentlyViewed).toContain('test-product');
});
```

### Test the Component

```tsx
import { render, screen } from '@testing-library/react';
import RecentlyViewedProducts from '@/components/RecentlyViewedProducts';

test('shows empty state when no products', async () => {
  render(<RecentlyViewedProducts />);

  const emptyMessage = await screen.findByText(/haven't viewed any products/i);
  expect(emptyMessage).toBeInTheDocument();
});
```

---

## Need Help?

- Check console for errors if products aren't appearing
- Verify Shopify credentials are configured
- Ensure product handles in localStorage are valid
- Check browser localStorage isn't disabled
