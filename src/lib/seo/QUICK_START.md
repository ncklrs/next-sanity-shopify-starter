# E-commerce SEO Quick Start Guide

## Files Created

### Library Files (`/src/lib/seo/`)
1. `product-jsonld.ts` - Product structured data generation
2. `collection-jsonld.ts` - Collection structured data generation
3. `breadcrumb-jsonld.ts` - Breadcrumb structured data generation
4. `index.ts` - Unified exports
5. `examples.tsx` - Complete implementation examples
6. `README.md` - Full documentation

### Component Files (`/src/components/`)
1. `JsonLd.tsx` - JSON-LD script injection components
2. `Breadcrumbs.tsx` - Breadcrumb navigation components

## Instant Usage

### 1. Add to Product Page

```tsx
// app/products/[handle]/page.tsx
import { generateProductJsonLd, buildProductBreadcrumbs } from '@/lib/seo';
import { ProductJsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);

  const jsonLd = generateProductJsonLd(product, {
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    seller: 'Your Store Name',
  });

  const breadcrumbs = buildProductBreadcrumbs({
    productName: product.title,
    productHandle: product.handle,
  });

  return (
    <>
      <ProductJsonLd data={jsonLd} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Your product page content */}
      <h1>{product.title}</h1>
    </>
  );
}
```

### 2. Add to Collection Page

```tsx
// app/collections/[handle]/page.tsx
import { generateCollectionJsonLd, buildCollectionBreadcrumbs } from '@/lib/seo';
import { CollectionJsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default async function CollectionPage({ params }) {
  const collection = await getCollection(params.handle);

  const jsonLd = generateCollectionJsonLd(collection, {
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    includeProducts: true,
  });

  const breadcrumbs = buildCollectionBreadcrumbs({
    collectionName: collection.title,
    collectionHandle: collection.handle,
  });

  return (
    <>
      <CollectionJsonLd data={jsonLd} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Your collection page content */}
    </>
  );
}
```

### 3. Add Product Reviews (Optional)

```tsx
const jsonLd = generateProductJsonLd(product, {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
  seller: 'Your Store Name',
  reviews: [
    {
      rating: 5,
      author: 'John Doe',
      body: 'Excellent product!',
      date: '2024-12-01',
    },
    {
      rating: 4,
      author: 'Jane Smith',
      body: 'Great quality',
      date: '2024-12-05',
    },
  ],
});
```

## Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://yourstore.com
NEXT_PUBLIC_STORE_NAME=Your Store Name
```

## Testing

1. **Google Rich Results Test**
   - Visit: https://search.google.com/test/rich-results
   - Enter your page URL
   - Verify Product/Collection schema is detected

2. **View Page Source**
   - Check for `<script type="application/ld+json">` tags
   - Verify JSON-LD is properly formatted

## What Each Function Does

### Product Functions
- `generateProductJsonLd()` - Creates complete product schema
- `stringifyProductJsonLd()` - Same but returns JSON string

### Collection Functions
- `generateCollectionJsonLd()` - Creates collection with product list
- `generateSimpleCollectionJsonLd()` - Collection without products
- `stringifyCollectionJsonLd()` - Returns JSON string

### Breadcrumb Functions
- `buildProductBreadcrumbs()` - Home > Collections > Collection > Product
- `buildCollectionBreadcrumbs()` - Home > Collections > Collection
- `buildBlogBreadcrumbs()` - Home > Blog > Category > Post
- `buildPageBreadcrumbs()` - Custom page hierarchy
- `generateBreadcrumbJsonLd()` - Creates breadcrumb schema

## Component Variants

### Breadcrumbs
- `<Breadcrumbs>` - Full breadcrumbs with JSON-LD (default)
- `<BreadcrumbsSimple>` - Without JSON-LD
- `<BreadcrumbsCompact>` - Minimal (back button + current)

### JsonLd
- `<JsonLd>` - Generic JSON-LD
- `<ProductJsonLd>` - Type-safe product schema
- `<CollectionJsonLd>` - Type-safe collection schema
- `<BreadcrumbJsonLd>` - Type-safe breadcrumb schema
- `<MultiJsonLd>` - Multiple schemas in one tag

## Next Steps

1. Add to your product pages
2. Add to your collection pages
3. Test with Google Rich Results Test
4. Monitor search console for rich results
5. Add reviews data when available

For complete examples, see `examples.tsx`
For full documentation, see `README.md`
