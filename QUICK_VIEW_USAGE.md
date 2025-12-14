# Product Quick View - Usage Guide

This guide shows how to integrate the Product Quick View modal into your product displays.

## Overview

The Quick View feature provides:
- Modal overlay with product details
- Image gallery with thumbnail navigation
- Variant selectors (color, size, etc.)
- Quantity selector
- Add to cart functionality
- Link to full product page
- Loading states during data fetch
- Keyboard (ESC) and backdrop click to close

## Files Created

1. `/src/contexts/QuickViewContext.tsx` - Context for managing quick view state
2. `/src/components/ProductQuickView.tsx` - Quick view modal component
3. `/src/components/Providers.tsx` - Unified provider wrapper
4. Updated `/src/components/ui/product-card.tsx` - Added Quick View button support
5. Updated `/src/app/layout.tsx` - Added Providers wrapper

## Quick Start

### 1. Using with the ProductCard Component

The `ProductCard` component now supports a `onQuickView` prop:

```tsx
import ProductCard from "@/components/ui/product-card";
import { useQuickView } from "@/contexts/QuickViewContext";

function ProductList() {
  const { openQuickView } = useQuickView();

  return (
    <div className="grid grid-cols-3 gap-6">
      <ProductCard
        image="/product-image.jpg"
        title="Premium T-Shirt"
        price={29.99}
        productHandle="premium-t-shirt"
        onQuickView={() => openQuickView("premium-t-shirt")}
        onCardClick={() => router.push("/products/premium-t-shirt")}
      />
    </div>
  );
}
```

### 2. Using with Custom Product Grids

For custom implementations, use the `useQuickView` hook:

```tsx
"use client";

import { useQuickView } from "@/contexts/QuickViewContext";

function CustomProductGrid({ products }) {
  const { openQuickView } = useQuickView();

  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.handle} className="product-card">
          <img src={product.image} alt={product.title} />
          <h3>{product.title}</h3>
          <p>${product.price}</p>

          <button onClick={() => openQuickView(product.handle)}>
            Quick View
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 3. Using with Shopify Product Data

The Quick View modal automatically fetches product data from Shopify using the product handle:

```tsx
"use client";

import { useQuickView } from "@/contexts/QuickViewContext";
import { ShopifyProduct } from "@/lib/shopify";

function ShopifyProductGrid({ products }: { products: ShopifyProduct[] }) {
  const { openQuickView } = useQuickView();

  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group relative">
          <img
            src={product.featuredImage?.url}
            alt={product.title}
            className="w-full aspect-square object-cover"
          />

          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => openQuickView(product.handle)}
              className="w-full bg-white text-black py-2 rounded-lg font-semibold"
            >
              Quick View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## API Reference

### `useQuickView()` Hook

```tsx
const {
  isOpen,              // boolean - whether modal is open
  currentProductHandle, // string | null - current product being viewed
  openQuickView,       // (handle: string) => void - open modal with product
  closeQuickView,      // () => void - close modal
} = useQuickView();
```

### ProductCard Props

```tsx
interface ProductCardProps {
  image: string;
  hoverImage?: string;
  title: string;
  price: number;
  salePrice?: number;
  variants?: ProductVariant[];
  badge?: ReactNode;
  productHandle?: string;        // Required for Quick View
  onQuickView?: () => void;      // Quick View callback
  onQuickAdd?: () => void;       // Quick Add callback
  onCardClick?: () => void;      // Card click callback
  className?: string;
}
```

## Advanced Usage

### Programmatic Control

You can open the quick view from anywhere in your app:

```tsx
import { useQuickView } from "@/contexts/QuickViewContext";

function ProductRecommendations() {
  const { openQuickView } = useQuickView();

  const handleViewProduct = (handle: string) => {
    // Open quick view instead of navigating
    openQuickView(handle);
  };

  return (
    <div>
      <button onClick={() => handleViewProduct("recommended-product")}>
        View Quick Details
      </button>
    </div>
  );
}
```

### Integration with Cart

The Quick View modal automatically integrates with the CartContext:

```tsx
// The modal handles this internally
const { addItem } = useCart();

// When user clicks "Add to Cart" in quick view:
addItem({
  id: variant.id,
  name: product.title,
  price: parseFloat(variant.price),
  quantity: selectedQuantity,
  image: product.image,
  variant: "Color / Size",
});
```

## Features

### 1. Product Data Fetching
- Fetches full product data when modal opens (not preloaded)
- Shows loading spinner during fetch
- Displays error state if fetch fails
- Auto-selects first available variant

### 2. Image Gallery
- Main image display with aspect ratio 3:4
- Thumbnail navigation for multiple images
- Click thumbnails to change main image
- Smooth transitions between images

### 3. Variant Selection
- Color swatches with availability status
- Size selector with stock indicators
- Automatic variant matching
- Disabled state for out-of-stock options

### 4. Quantity Selection
- Adjustable quantity (1-99)
- Plus/minus buttons
- Direct input option
- Validation on blur

### 5. Cart Integration
- Add to cart with selected variant
- Quantity support
- Success feedback
- Auto-close after adding

### 6. User Experience
- ESC key to close
- Backdrop click to close
- Body scroll lock when open
- Smooth animations
- Loading states
- Error handling

## Styling

The Quick View modal uses CSS variables for theming:

```css
--background         /* Modal background */
--surface           /* Card surfaces */
--border            /* Border colors */
--foreground        /* Text colors */
--accent-cyan       /* Primary accent */
--accent-violet     /* Secondary accent */
```

## Best Practices

1. **Always provide productHandle**: Required for fetching product data
2. **Use with onCardClick**: Let users choose between quick view and full page
3. **Combine with Quick Add**: Offer both options for better UX
4. **Test with variants**: Ensure color/size selectors work properly
5. **Handle edge cases**: Products with no images, single variant, etc.

## Example: Complete Integration

```tsx
"use client";

import { useState, useEffect } from "react";
import { useQuickView } from "@/contexts/QuickViewContext";
import { useCart } from "@/contexts/CartContext";
import { getAllProducts, ShopifyProduct } from "@/lib/shopify";
import ProductCard from "@/components/ui/product-card";

export default function ShopPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const { openQuickView } = useQuickView();
  const { addItem } = useCart();

  useEffect(() => {
    getAllProducts().then(setProducts);
  }, []);

  const handleQuickAdd = (product: ShopifyProduct) => {
    const firstVariant = product.variants.edges[0]?.node;
    if (firstVariant) {
      addItem({
        id: firstVariant.id,
        name: product.title,
        price: parseFloat(firstVariant.priceV2.amount),
        quantity: 1,
        image: product.featuredImage?.url,
      });
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            image={product.featuredImage?.url || "/placeholder.jpg"}
            title={product.title}
            price={parseFloat(product.priceRange.minVariantPrice.amount)}
            productHandle={product.handle}
            onQuickView={() => openQuickView(product.handle)}
            onQuickAdd={() => handleQuickAdd(product)}
            onCardClick={() => window.location.href = \`/products/\${product.handle}\`}
          />
        ))}
      </div>
    </div>
  );
}
```

## Troubleshooting

### Modal doesn't open
- Ensure `Providers` is wrapping your app in `layout.tsx`
- Check that `productHandle` is provided
- Verify Shopify credentials are configured

### Product data not loading
- Check `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` env variable
- Verify `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- Check browser console for fetch errors

### Variants not working
- Ensure product has variants in Shopify
- Check variant naming (Color, Size are auto-detected)
- Verify variant availability data

## Support

For issues or questions:
1. Check browser console for errors
2. Verify environment variables
3. Test with a known working product handle
4. Review Shopify product setup
