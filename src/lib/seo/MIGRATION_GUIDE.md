# Migration Guide: Adding SEO to Existing Pages

This guide shows how to add structured data to your existing Next.js pages.

## Prerequisites

1. Set environment variables in `.env.local`:
```bash
NEXT_PUBLIC_SITE_URL=https://yourstore.com
NEXT_PUBLIC_STORE_NAME=Your Store Name
```

2. Ensure you have Shopify product/collection data available

## Migration Steps

### Step 1: Product Page

**Before:**
```tsx
// app/products/[handle]/page.tsx
export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);

  return (
    <main>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      {/* ... rest of page */}
    </main>
  );
}
```

**After:**
```tsx
// app/products/[handle]/page.tsx
import { generateProductJsonLd, buildProductBreadcrumbs } from '@/lib/seo';
import { ProductJsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);

  // Generate structured data
  const productJsonLd = generateProductJsonLd(product, {
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    seller: process.env.NEXT_PUBLIC_STORE_NAME,
  });

  // Build breadcrumbs
  const breadcrumbs = buildProductBreadcrumbs({
    productName: product.title,
    productHandle: product.handle,
  });

  return (
    <>
      {/* Add structured data */}
      <ProductJsonLd data={productJsonLd} />

      <main>
        {/* Add breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} baseUrl={process.env.NEXT_PUBLIC_SITE_URL} />

        <h1>{product.title}</h1>
        <p>{product.description}</p>
        {/* ... rest of page */}
      </main>
    </>
  );
}
```

### Step 2: Add Product Metadata

**Before:**
```tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.handle);

  return {
    title: product.title,
  };
}
```

**After:**
```tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.handle);
  const imageUrl = product.featuredImage?.url;

  return {
    title: product.seo?.title || `${product.title} | Your Store`,
    description: product.seo?.description || product.description,
    openGraph: {
      title: product.seo?.title || product.title,
      description: product.seo?.description || product.description,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
      type: 'website',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.handle}`,
    },
  };
}
```

### Step 3: Collection Page

**Before:**
```tsx
// app/collections/[handle]/page.tsx
export default async function CollectionPage({ params }) {
  const collection = await getCollection(params.handle);

  return (
    <main>
      <h1>{collection.title}</h1>
      <div className="products-grid">
        {/* ... products */}
      </div>
    </main>
  );
}
```

**After:**
```tsx
// app/collections/[handle]/page.tsx
import { generateCollectionJsonLd, buildCollectionBreadcrumbs } from '@/lib/seo';
import { CollectionJsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default async function CollectionPage({ params }) {
  const collection = await getCollection(params.handle);

  // Generate structured data
  const collectionJsonLd = generateCollectionJsonLd(collection, {
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    includeProducts: true,
    maxProducts: 10, // Limit for performance
  });

  // Build breadcrumbs
  const breadcrumbs = buildCollectionBreadcrumbs({
    collectionName: collection.title,
    collectionHandle: collection.handle,
  });

  return (
    <>
      {/* Add structured data */}
      <CollectionJsonLd data={collectionJsonLd} />

      <main>
        {/* Add breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} baseUrl={process.env.NEXT_PUBLIC_SITE_URL} />

        <h1>{collection.title}</h1>
        <div className="products-grid">
          {/* ... products */}
        </div>
      </main>
    </>
  );
}
```

### Step 4: Blog Post (Optional)

**Before:**
```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      {/* ... content */}
    </article>
  );
}
```

**After:**
```tsx
// app/blog/[slug]/page.tsx
import { buildBlogBreadcrumbs } from '@/lib/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);

  // Build breadcrumbs
  const breadcrumbs = buildBlogBreadcrumbs({
    postTitle: post.title,
    postSlug: post.slug,
  });

  return (
    <article>
      <Breadcrumbs items={breadcrumbs} baseUrl={process.env.NEXT_PUBLIC_SITE_URL} />

      <h1>{post.title}</h1>
      {/* ... content */}
    </article>
  );
}
```

## Advanced: Product with Collection Context

If you want to show the collection in breadcrumbs:

```tsx
export default async function ProductPage({ params, searchParams }) {
  const product = await getProduct(params.handle);

  // Get collection from query params or product data
  const collectionHandle = searchParams?.collection;
  const collection = collectionHandle
    ? await getCollection(collectionHandle)
    : await getProductPrimaryCollection(product.id);

  const breadcrumbs = buildProductBreadcrumbs({
    productName: product.title,
    productHandle: product.handle,
    collectionName: collection?.title,
    collectionHandle: collection?.handle,
  });

  return (
    <>
      <ProductJsonLd data={generateProductJsonLd(product)} />
      <Breadcrumbs items={breadcrumbs} />
      {/* ... */}
    </>
  );
}
```

## Advanced: Adding Reviews

If you have a review system:

```tsx
export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);
  const reviews = await getProductReviews(product.id);

  const productJsonLd = generateProductJsonLd(product, {
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    seller: process.env.NEXT_PUBLIC_STORE_NAME,
    reviews: reviews.map(review => ({
      rating: review.rating,
      author: review.author.name,
      body: review.content,
      date: review.createdAt,
    })),
  });

  return (
    <>
      <ProductJsonLd data={productJsonLd} />
      {/* ... */}
    </>
  );
}
```

## Advanced: Homepage with Multiple Schemas

```tsx
// app/page.tsx
import { MultiJsonLd, OrganizationJsonLd, WebSiteJsonLd } from '@/components/JsonLd';

export default function HomePage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: process.env.NEXT_PUBLIC_STORE_NAME,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: process.env.NEXT_PUBLIC_STORE_NAME,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <MultiJsonLd data={[organizationSchema, websiteSchema]} />
      {/* ... homepage content */}
    </>
  );
}
```

## Testing Checklist

After migrating each page:

- [ ] View page source and verify `<script type="application/ld+json">` exists
- [ ] Copy JSON-LD to https://search.google.com/test/rich-results
- [ ] Verify schema type is detected (Product, CollectionPage, BreadcrumbList)
- [ ] Check for validation errors
- [ ] Test breadcrumbs on mobile (should truncate)
- [ ] Verify breadcrumb links work correctly
- [ ] Check metadata in `<head>` is correct

## Common Issues

### Issue: Breadcrumbs not showing

**Solution:** Make sure you imported both the component and the builder function:
```tsx
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { buildProductBreadcrumbs } from '@/lib/seo';
```

### Issue: Type errors with Product/Collection

**Solution:** Ensure you're using the Shopify types from your project:
```tsx
import type { Product } from '@/lib/shopify/types';
```

### Issue: JSON-LD not appearing in source

**Solution:** Ensure the component is inside the page component (Server Component), not in a client component.

### Issue: Missing baseUrl in links

**Solution:** Always pass baseUrl to components:
```tsx
<Breadcrumbs items={breadcrumbs} baseUrl={process.env.NEXT_PUBLIC_SITE_URL} />
```

## Performance Tips

1. **Limit products in collection JSON-LD:**
   ```tsx
   generateCollectionJsonLd(collection, { maxProducts: 10 })
   ```

2. **Use simple collection for large catalogs:**
   ```tsx
   generateSimpleCollectionJsonLd(collection)
   ```

3. **Cache product data when possible:**
   ```tsx
   const product = await getProduct(params.handle); // Add caching here
   ```

## Rollout Strategy

1. Start with most important product pages
2. Add to collection pages
3. Add to blog posts
4. Monitor Google Search Console for improvements
5. Iterate based on rich results data

## Support

For complete documentation, see:
- `/src/lib/seo/README.md` - Full API docs
- `/src/lib/seo/QUICK_START.md` - Quick reference
- `/src/lib/seo/examples.tsx` - Code examples
