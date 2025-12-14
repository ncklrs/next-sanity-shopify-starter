# E-commerce SEO & Structured Data

This library provides comprehensive SEO and structured data support for e-commerce applications, following schema.org standards for optimal search engine visibility.

## Features

- **Product Schema**: Complete product structured data with pricing, availability, reviews, and more
- **Collection Schema**: Collection page structured data with product lists
- **Breadcrumb Schema**: Navigation breadcrumbs with proper hierarchy
- **Type-safe Components**: TypeScript-first with full type safety
- **Flexible Integration**: Works with Server Components and Client Components
- **Mobile-responsive**: Breadcrumb components adapt to screen size

## Quick Start

### Product Page with Structured Data

```tsx
import { generateProductJsonLd } from '@/lib/seo';
import { ProductJsonLd } from '@/components/JsonLd';
import { Breadcrumbs, buildProductBreadcrumbs } from '@/components/Breadcrumbs';

export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);

  // Generate product JSON-LD
  const productJsonLd = generateProductJsonLd(product, {
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    seller: 'Your Store Name',
    reviews: [
      { rating: 5, author: 'John Doe', body: 'Great product!', date: '2024-01-15' },
      { rating: 4, author: 'Jane Smith', body: 'Very good', date: '2024-01-20' },
    ],
  });

  // Generate breadcrumbs
  const breadcrumbs = buildProductBreadcrumbs({
    productName: product.title,
    productHandle: product.handle,
    collectionName: 'Sneakers',
    collectionHandle: 'sneakers',
  });

  return (
    <>
      <ProductJsonLd data={productJsonLd} />
      <Breadcrumbs items={breadcrumbs} baseUrl={process.env.NEXT_PUBLIC_SITE_URL} />

      <h1>{product.title}</h1>
      {/* Rest of your product page */}
    </>
  );
}
```

### Collection Page with Structured Data

```tsx
import { generateCollectionJsonLd } from '@/lib/seo';
import { CollectionJsonLd } from '@/components/JsonLd';
import { Breadcrumbs, buildCollectionBreadcrumbs } from '@/components/Breadcrumbs';

export default async function CollectionPage({ params }) {
  const collection = await getCollection(params.handle);

  // Generate collection JSON-LD with product list
  const collectionJsonLd = generateCollectionJsonLd(collection, {
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    includeProducts: true,
    maxProducts: 10, // Limit products in structured data
  });

  // Generate breadcrumbs
  const breadcrumbs = buildCollectionBreadcrumbs({
    collectionName: collection.title,
    collectionHandle: collection.handle,
  });

  return (
    <>
      <CollectionJsonLd data={collectionJsonLd} />
      <Breadcrumbs items={breadcrumbs} baseUrl={process.env.NEXT_PUBLIC_SITE_URL} />

      <h1>{collection.title}</h1>
      {/* Rest of your collection page */}
    </>
  );
}
```

### Blog Post with Breadcrumbs

```tsx
import { buildBlogBreadcrumbs } from '@/lib/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default async function BlogPost({ params }) {
  const post = await getBlogPost(params.slug);

  const breadcrumbs = buildBlogBreadcrumbs({
    postTitle: post.title,
    postSlug: post.slug,
    categoryName: post.category?.name,
    categorySlug: post.category?.slug,
  });

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <article>
        <h1>{post.title}</h1>
        {/* Rest of your blog post */}
      </article>
    </>
  );
}
```

## API Reference

### Product JSON-LD

#### `generateProductJsonLd(product, options)`

Generates schema.org/Product structured data.

**Parameters:**
- `product` (Product): Shopify product object
- `options` (ProductJsonLdOptions):
  - `baseUrl?` (string): Site base URL for full product URLs
  - `seller?` (string): Store/organization name
  - `reviews?` (Array): Product reviews for aggregate rating

**Returns:** ProductJsonLd object

#### `stringifyProductJsonLd(product, options)`

Same as `generateProductJsonLd` but returns JSON string.

### Collection JSON-LD

#### `generateCollectionJsonLd(collection, options)`

Generates schema.org/CollectionPage structured data.

**Parameters:**
- `collection` (Collection): Shopify collection object
- `options` (CollectionJsonLdOptions):
  - `baseUrl?` (string): Site base URL
  - `includeProducts?` (boolean): Include product list (default: true)
  - `maxProducts?` (number): Max products to include (default: 10)

**Returns:** CollectionJsonLd object

#### `generateSimpleCollectionJsonLd(collection, options)`

Generates simplified collection JSON-LD without product list.

### Breadcrumb Utilities

#### `buildProductBreadcrumbs(params)`

Builds breadcrumb trail for product pages.

**Parameters:**
- `productName` (string): Product title
- `productHandle` (string): Product URL handle
- `collectionName?` (string): Parent collection name
- `collectionHandle?` (string): Parent collection handle

**Returns:** BreadcrumbItem[]

Path: Home > Collections > [Collection] > [Product]

#### `buildCollectionBreadcrumbs(params)`

Builds breadcrumb trail for collection pages.

**Parameters:**
- `collectionName` (string): Collection title
- `collectionHandle` (string): Collection URL handle

**Returns:** BreadcrumbItem[]

Path: Home > Collections > [Collection]

#### `buildBlogBreadcrumbs(params)`

Builds breadcrumb trail for blog posts.

**Parameters:**
- `postTitle` (string): Post title
- `postSlug` (string): Post URL slug
- `categoryName?` (string): Post category name
- `categorySlug?` (string): Post category slug

**Returns:** BreadcrumbItem[]

Path: Home > Blog > [Category] > [Post]

#### `buildPageBreadcrumbs(params)`

Builds breadcrumb trail for generic pages.

**Parameters:**
- `segments` (Array<{ name: string, href: string }>): Page hierarchy

**Returns:** BreadcrumbItem[]

## Components

### `<Breadcrumbs>`

Visual breadcrumb navigation with automatic JSON-LD generation.

**Props:**
- `items` (BreadcrumbItem[]): Breadcrumb items
- `className?` (string): Additional CSS classes
- `showHome?` (boolean): Show home icon (default: true)
- `maxMobileItems?` (number): Max items on mobile (default: 2)
- `baseUrl?` (string): Base URL for JSON-LD
- `includeJsonLd?` (boolean): Include JSON-LD script (default: true)

**Features:**
- Responsive design (truncates on mobile: Home > ... > Current)
- Home icon support
- Accessible navigation
- Automatic JSON-LD generation

### `<BreadcrumbsSimple>`

Same as Breadcrumbs but without JSON-LD generation.

### `<BreadcrumbsCompact>`

Minimal breadcrumb display showing only previous and current items.

### `<JsonLd>`, `<ProductJsonLd>`, `<CollectionJsonLd>`, etc.

Components for injecting JSON-LD structured data into pages.

**Props:**
- `data` (object | string): JSON-LD data to inject

## Best Practices

### 1. Use Base URL in Production

Always provide the full base URL in production for complete URLs in structured data:

```tsx
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourstore.com';
```

### 2. Include Product Reviews

Including reviews significantly improves search visibility:

```tsx
generateProductJsonLd(product, {
  reviews: await getProductReviews(product.id),
});
```

### 3. Limit Products in Collections

For large collections, limit products in structured data:

```tsx
generateCollectionJsonLd(collection, {
  includeProducts: true,
  maxProducts: 10, // Google recommends limiting to essential items
});
```

### 4. Add to Metadata

Combine with Next.js metadata for complete SEO:

```tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.handle);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description,
    openGraph: {
      title: product.seo.title || product.title,
      description: product.seo.description,
      images: [product.featuredImage?.url],
    },
  };
}
```

### 5. Test with Google Rich Results Test

Always validate your structured data:
https://search.google.com/test/rich-results

## Schema.org Types Used

- **Product**: https://schema.org/Product
- **Offer/AggregateOffer**: https://schema.org/Offer
- **CollectionPage**: https://schema.org/CollectionPage
- **BreadcrumbList**: https://schema.org/BreadcrumbList
- **AggregateRating**: https://schema.org/AggregateRating
- **Review**: https://schema.org/Review

## TypeScript Support

All functions and components are fully typed:

```tsx
import type { ProductJsonLdOptions, BreadcrumbItem } from '@/lib/seo';
```

## Troubleshooting

### JSON-LD not appearing in page source

Make sure you're using the components in Server Components or the head section.

### Breadcrumbs showing incorrectly

Check that your breadcrumb items have valid href values and are in the correct order.

### Structured data validation errors

Use Google's Rich Results Test to identify specific issues with your schema.

## License

MIT
