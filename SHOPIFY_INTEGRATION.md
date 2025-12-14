# Shopify Storefront API Integration

Complete integration of Shopify Storefront API (2024-01) with this Next.js + Sanity project.

## Files Created

### Core Library (`src/lib/shopify/`)

1. **`types.ts`** - Complete TypeScript type definitions
   - Product, ProductVariant, Collection types
   - Cart and CartLine types
   - GraphQL response wrappers
   - Error types (ShopifyError, ShopifyGraphQLError, ShopifyNetworkError)
   - Query input types with sorting and pagination

2. **`client.ts`** - GraphQL client with native fetch
   - `shopifyFetch()` - Core fetch function with error handling
   - `shopifyFetchStatic()` - For static content (1 hour revalidation)
   - `shopifyFetchDynamic()` - For real-time data (no caching)
   - `shopifyFetchWithTags()` - For ISR with webhook revalidation
   - Supports both server-side and client-side usage
   - Proper error handling with typed errors

3. **`queries.ts`** - GraphQL queries and mutations
   - **Product Queries:**
     - `getProducts(input)` - List products with filtering, sorting, pagination
     - `getProductByHandle(handle)` - Single product by handle
   - **Collection Queries:**
     - `getCollections(input)` - List collections with filtering, sorting
     - `getCollectionByHandle(input)` - Collection with products
   - **Cart Mutations:**
     - `createCart(input)` - Create new cart
     - `addToCart(cartId, lines)` - Add items to cart
     - `updateCartItem(cartId, lines)` - Update quantities
     - `removeFromCart(cartId, lineIds)` - Remove items
     - `getCart(cartId)` - Fetch cart by ID

4. **`index.ts`** - Public API exports
   - All types, functions, and errors exported from single entry point

### Context (`src/contexts/`)

5. **`CartContext.tsx`** - Global cart state management
   - React Context + useReducer pattern
   - localStorage persistence of cart ID
   - Automatic cart initialization on mount
   - Actions: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`
   - Computed values: `totalQuantity`, `checkoutUrl`
   - Error handling with loading states
   - `useCart()` hook for consuming components

### Environment Variables

6. **`.env.local.example`** - Updated with Shopify configuration
   ```env
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
   ```

## Setup Instructions

### 1. Create Shopify Custom App

1. Go to your Shopify Admin
2. Navigate to: **Settings > Apps and sales channels > Develop apps**
3. Click **"Create an app"**
4. Name it (e.g., "Next.js Storefront")
5. Click **"Configure Storefront API"**
6. Enable the following scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
7. Click **"Install app"**
8. Copy the **Storefront API access token**

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and update:

```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
```

### 3. Add CartProvider to Layout

Wrap your app with the CartProvider in your root layout:

```tsx
// src/app/layout.tsx
import { CartProvider } from '@/contexts/CartContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
```

## Usage Examples

### Fetching Products

```tsx
import { getProducts, getProductByHandle } from '@/lib/shopify';

// List products with pagination
const { products, pageInfo } = await getProducts({
  first: 12,
  sortKey: 'BEST_SELLING',
  reverse: false
});

// Get single product
const product = await getProductByHandle('my-product-handle');
```

### Using the Cart

```tsx
'use client';

import { useCart } from '@/contexts/CartContext';

export function ProductCard({ product }) {
  const { addItem, isLoading } = useCart();

  const handleAddToCart = async () => {
    const variantId = product.variants.edges[0].node.id;
    await addItem(variantId, 1);
  };

  return (
    <button onClick={handleAddToCart} disabled={isLoading}>
      Add to Cart
    </button>
  );
}
```

### Cart Component

```tsx
'use client';

import { useCart } from '@/contexts/CartContext';

export function CartButton() {
  const { cart, totalQuantity, checkoutUrl } = useCart();

  return (
    <div>
      <span>Cart ({totalQuantity})</span>
      {checkoutUrl && (
        <a href={checkoutUrl}>Checkout</a>
      )}
    </div>
  );
}
```

### Advanced Product Filtering

```tsx
import { getProducts } from '@/lib/shopify';

// Search products
const { products } = await getProducts({
  query: 'tag:featured',
  first: 20,
  sortKey: 'PRICE',
  reverse: false
});

// Filter by type
const { products } = await getProducts({
  query: 'product_type:shoes',
  first: 10
});
```

### Collections

```tsx
import { getCollectionByHandle } from '@/lib/shopify';

const collection = await getCollectionByHandle({
  handle: 'summer-collection',
  first: 20,
  sortKey: 'BEST_SELLING'
});
```

## Type Safety

All functions are fully typed with TypeScript. Import types as needed:

```tsx
import type {
  Product,
  ProductVariant,
  Collection,
  Cart,
  CartLine
} from '@/lib/shopify';
```

## Error Handling

The integration includes custom error types:

```tsx
import {
  ShopifyError,
  ShopifyGraphQLError,
  ShopifyNetworkError
} from '@/lib/shopify';

try {
  const product = await getProductByHandle('invalid');
} catch (error) {
  if (error instanceof ShopifyGraphQLError) {
    console.error('GraphQL errors:', error.errors);
  } else if (error instanceof ShopifyNetworkError) {
    console.error('Network error:', error.statusCode);
  }
}
```

## Caching Strategies

### Static Content (Products, Collections)
Uses `shopifyFetchStatic()` - revalidates every hour
```tsx
const products = await getProducts({ first: 20 });
```

### Dynamic Content (Cart)
Uses `shopifyFetchDynamic()` - no caching
```tsx
const cart = await getCart(cartId);
```

### Custom Caching
```tsx
import { shopifyFetchWithTags } from '@/lib/shopify';

const data = await shopifyFetchWithTags(
  query,
  variables,
  ['products', 'collection:summer']
);
```

## Cart Persistence

- Cart ID is stored in `localStorage` as `shopify_cart_id`
- Automatically restores cart on page reload
- Cart expires after 7 days of inactivity (Shopify default)
- Clear cart: `clearCart()` removes localStorage and resets state

## Next Steps

1. Create product listing pages
2. Build product detail pages
3. Create cart drawer/modal component
4. Add search functionality
5. Implement collection pages
6. Set up webhook revalidation for ISR
7. Add analytics tracking

## API Version

This integration uses **Shopify Storefront API 2024-01**.

To update the API version, modify the `SHOPIFY_STOREFRONT_API_VERSION` constant in `src/lib/shopify/client.ts`.

## Resources

- [Shopify Storefront API Documentation](https://shopify.dev/docs/api/storefront)
- [GraphQL Explorer](https://shopify.dev/docs/apps/tools/graphiql-admin-api)
- [Shopify Admin](https://admin.shopify.com)
