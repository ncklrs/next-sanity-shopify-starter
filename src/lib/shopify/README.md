# Shopify Integration - Quick Reference

## Installation Complete

All Shopify Storefront API integration files are ready to use.

## File Structure

```
src/
├── lib/
│   └── shopify/
│       ├── types.ts       # TypeScript type definitions
│       ├── client.ts      # GraphQL client (fetch wrapper)
│       ├── queries.ts     # Product, Collection, Cart queries
│       └── index.ts       # Public API exports
└── contexts/
    └── CartContext.tsx    # Global cart state management
```

## Quick Start

### 1. Environment Setup

Add to `.env.local`:
```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
```

### 2. Add CartProvider

```tsx
// app/layout.tsx
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

## Common Patterns

### Server Components (Product Listing)

```tsx
// app/products/page.tsx
import { getProducts } from '@/lib/shopify';

export default async function ProductsPage() {
  const { products } = await getProducts({
    first: 12,
    sortKey: 'BEST_SELLING'
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Server Component (Product Detail)

```tsx
// app/products/[handle]/page.tsx
import { getProductByHandle } from '@/lib/shopify';

export default async function ProductPage({ params }) {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <AddToCartButton product={product} />
    </div>
  );
}
```

### Client Component (Add to Cart)

```tsx
// components/AddToCartButton.tsx
'use client';

import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/lib/shopify';

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem, isLoading } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    // Get the first variant ID
    const variantId = product.variants.edges[0]?.node.id;

    if (!variantId) return;

    try {
      await addItem(variantId, quantity);
      alert('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min="1"
      />
      <button onClick={handleAddToCart} disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

### Cart Display Component

```tsx
// components/CartDrawer.tsx
'use client';

import { useCart } from '@/contexts/CartContext';

export function CartDrawer() {
  const {
    cart,
    totalQuantity,
    checkoutUrl,
    removeItem,
    updateQuantity,
    isLoading
  } = useCart();

  if (!cart || totalQuantity === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div>
      <h2>Cart ({totalQuantity} items)</h2>

      {cart.lines.edges.map(({ node: line }) => (
        <div key={line.id}>
          <p>{line.merchandise.title}</p>
          <p>{line.merchandise.price.amount} {line.merchandise.price.currencyCode}</p>

          <input
            type="number"
            value={line.quantity}
            onChange={(e) => updateQuantity(line.id, Number(e.target.value))}
            min="1"
          />

          <button onClick={() => removeItem(line.id)}>Remove</button>
        </div>
      ))}

      <div>
        <p>Subtotal: {cart.cost.subtotalAmount.amount} {cart.cost.subtotalAmount.currencyCode}</p>
        <a href={checkoutUrl || '#'}>Checkout</a>
      </div>
    </div>
  );
}
```

### Collection Page

```tsx
// app/collections/[handle]/page.tsx
import { getCollectionByHandle } from '@/lib/shopify';

export default async function CollectionPage({ params }) {
  const collection = await getCollectionByHandle({
    handle: params.handle,
    first: 20
  });

  if (!collection) {
    notFound();
  }

  return (
    <div>
      <h1>{collection.title}</h1>
      <p>{collection.description}</p>

      <div className="grid grid-cols-4 gap-4">
        {collection.products?.edges.map(({ node: product }) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

## API Reference

### Product Queries

```tsx
// Get all products
const { products, pageInfo } = await getProducts({
  first: 20,              // Number of products
  after: cursor,          // Pagination cursor
  sortKey: 'TITLE',       // Sort by
  reverse: false,         // Reverse order
  query: 'tag:featured'   // Search query
});

// Get single product
const product = await getProductByHandle('product-handle');
```

### Collection Queries

```tsx
// Get all collections
const { collections } = await getCollections({
  first: 10,
  sortKey: 'UPDATED_AT'
});

// Get collection with products
const collection = await getCollectionByHandle({
  handle: 'summer-sale',
  first: 20,
  sortKey: 'BEST_SELLING'
});
```

### Cart Operations (via useCart hook)

```tsx
const {
  cart,              // Full cart object
  totalQuantity,     // Total items in cart
  checkoutUrl,       // Shopify checkout URL
  isLoading,         // Loading state
  error,             // Error message

  // Actions
  addItem(merchandiseId, quantity),
  removeItem(lineId),
  updateQuantity(lineId, quantity),
  clearCart()
} = useCart();
```

## TypeScript Types

Import types from the main export:

```tsx
import type {
  Product,
  ProductVariant,
  Collection,
  Cart,
  CartLine,
  Money,
  Image
} from '@/lib/shopify';
```

## Error Handling

```tsx
import { ShopifyError } from '@/lib/shopify';

try {
  await addItem(variantId, 1);
} catch (error) {
  if (error instanceof ShopifyError) {
    console.error('Shopify error:', error.message);
  }
}
```

## Caching

- **Products/Collections**: Cached for 1 hour (static)
- **Cart**: No caching (dynamic, real-time)

## Support

See `SHOPIFY_INTEGRATION.md` in project root for detailed documentation.
