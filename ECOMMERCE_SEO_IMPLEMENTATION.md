# E-commerce SEO & Structured Data Implementation

Complete implementation of schema.org structured data for e-commerce, following SEO best practices.

## Files Created

### Library Files (8 files in `/src/lib/seo/`)

1. **product-jsonld.ts** (192 lines)
   - Generates Product schema with pricing, availability, and reviews
   - Supports both single offers and aggregate offers (price ranges)
   - Includes SKU, brand, and rating data
   - Function: `generateProductJsonLd(product, options)`

2. **collection-jsonld.ts** (137 lines)
   - Generates CollectionPage schema with product lists
   - Supports itemList with configurable product count
   - Simple collection variant without products
   - Function: `generateCollectionJsonLd(collection, options)`

3. **breadcrumb-jsonld.ts** (168 lines)
   - Generates BreadcrumbList schema
   - Helper functions for common patterns:
     - `buildProductBreadcrumbs()` - Product page breadcrumbs
     - `buildCollectionBreadcrumbs()` - Collection page breadcrumbs
     - `buildBlogBreadcrumbs()` - Blog post breadcrumbs
     - `buildPageBreadcrumbs()` - Generic page breadcrumbs

4. **index.ts** (89 lines)
   - Unified exports for easy importing
   - Comprehensive documentation with examples

5. **types.ts** (120 lines)
   - TypeScript type definitions
   - Organization, WebSite, Article schemas
   - Review data structures

6. **examples.tsx** (288 lines)
   - Complete implementation examples
   - Product page with metadata
   - Collection page with pagination
   - Multi-schema examples

7. **README.md** (8.7KB)
   - Full documentation
   - API reference
   - Best practices guide
   - Schema.org type references

8. **QUICK_START.md**
   - Quick reference guide
   - Copy-paste examples
   - Testing instructions

### Component Files (2 files in `/src/components/`)

1. **JsonLd.tsx** (135 lines)
   - Safe JSON-LD injection component
   - Type-safe variants:
     - `<ProductJsonLd>` - Product schema
     - `<CollectionJsonLd>` - Collection schema
     - `<BreadcrumbJsonLd>` - Breadcrumb schema
     - `<OrganizationJsonLd>` - Organization schema
     - `<WebSiteJsonLd>` - Website schema
     - `<ArticleJsonLd>` - Article/Blog schema
     - `<MultiJsonLd>` - Multiple schemas via @graph

2. **Breadcrumbs.tsx** (215 lines)
   - Visual breadcrumb navigation
   - Responsive design (truncates on mobile)
   - Automatic JSON-LD generation
   - Three variants:
     - `<Breadcrumbs>` - Full with JSON-LD
     - `<BreadcrumbsSimple>` - Without JSON-LD
     - `<BreadcrumbsCompact>` - Minimal back button

## Total Implementation

- **1,344 lines** of production-ready code
- **10 files** created
- **Fully typed** with TypeScript
- **Zero dependencies** (uses existing project dependencies)

## Quick Implementation

### Product Page

```tsx
import { generateProductJsonLd, buildProductBreadcrumbs } from '@/lib/seo';
import { ProductJsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);

  return (
    <>
      <ProductJsonLd data={generateProductJsonLd(product, {
        baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
        seller: 'Your Store',
      })} />

      <Breadcrumbs items={buildProductBreadcrumbs({
        productName: product.title,
        productHandle: product.handle,
      })} />

      <h1>{product.title}</h1>
      {/* Product content */}
    </>
  );
}
```

### Collection Page

```tsx
import { generateCollectionJsonLd, buildCollectionBreadcrumbs } from '@/lib/seo';
import { CollectionJsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default async function CollectionPage({ params }) {
  const collection = await getCollection(params.handle);

  return (
    <>
      <CollectionJsonLd data={generateCollectionJsonLd(collection, {
        baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
        includeProducts: true,
      })} />

      <Breadcrumbs items={buildCollectionBreadcrumbs({
        collectionName: collection.title,
        collectionHandle: collection.handle,
      })} />

      <h1>{collection.title}</h1>
      {/* Collection content */}
    </>
  );
}
```

## Schema.org Types Implemented

### Primary Types
- ✅ **Product** - Complete product data with offers
- ✅ **Offer/AggregateOffer** - Pricing and availability
- ✅ **CollectionPage** - Product collections
- ✅ **BreadcrumbList** - Navigation hierarchy
- ✅ **ItemList** - Product lists in collections

### Supporting Types
- ✅ **AggregateRating** - Product ratings
- ✅ **Review** - Customer reviews
- ✅ **Brand** - Product brands
- ✅ **Organization** - Store information
- ✅ **WebSite** - Site-wide schema
- ✅ **Article/BlogPosting** - Blog content

## Features

### Product Schema Features
- Single variant or price range support
- Availability status (InStock/OutOfStock)
- SKU and product codes
- Brand information
- Multiple product images
- Review aggregation
- Rating display
- Seller information

### Collection Schema Features
- Collection metadata
- Product list with position
- Configurable product count
- Item pricing in list
- Collection images
- SEO-optimized descriptions

### Breadcrumb Features
- Automatic hierarchy generation
- Mobile-responsive (truncation)
- Home icon support
- Accessible navigation (ARIA)
- Custom styling support
- JSON-LD integration

## Integration with Existing Codebase

The implementation integrates seamlessly with:
- ✅ Existing Shopify types (`/src/lib/shopify/types.ts`)
- ✅ Sanity SEO schema (`/sanity/schemas/objects/seo.ts`)
- ✅ Next.js App Router metadata
- ✅ TypeScript path aliases (`@/`)
- ✅ Existing component patterns

## Testing & Validation

### Test with Google Rich Results

1. Visit: https://search.google.com/test/rich-results
2. Enter your page URL
3. Verify schema is detected and valid

### Test Breadcrumbs

1. View page source
2. Look for `<script type="application/ld+json">`
3. Verify BreadcrumbList schema

### Test Product Schema

1. Check for Product type
2. Verify offers object
3. Confirm availability status
4. Validate image URLs

## Best Practices Implemented

1. ✅ Full URLs for all links (baseUrl parameter)
2. ✅ Proper availability mapping
3. ✅ Price range vs single price detection
4. ✅ Review aggregation with ratings
5. ✅ Multiple images support
6. ✅ SEO title/description fallbacks
7. ✅ Mobile-responsive breadcrumbs
8. ✅ Accessible navigation
9. ✅ Type-safe implementation
10. ✅ Comprehensive error handling

## Environment Variables Required

Add to `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://yourstore.com
NEXT_PUBLIC_STORE_NAME=Your Store Name
```

## Next Steps

1. **Add to Product Pages**
   - Import and use `generateProductJsonLd`
   - Add breadcrumbs with `buildProductBreadcrumbs`
   - Include product metadata

2. **Add to Collection Pages**
   - Import and use `generateCollectionJsonLd`
   - Add breadcrumbs with `buildCollectionBreadcrumbs`
   - Consider product count limits

3. **Test Implementation**
   - Use Google Rich Results Test
   - Validate all schema types
   - Check mobile breadcrumb display

4. **Monitor Results**
   - Google Search Console
   - Rich results reporting
   - Click-through rate improvements

5. **Add Reviews (Optional)**
   - Integrate review system
   - Add to product JSON-LD
   - Display aggregate ratings

## Documentation

- **Quick Start**: `/src/lib/seo/QUICK_START.md`
- **Full Documentation**: `/src/lib/seo/README.md`
- **Examples**: `/src/lib/seo/examples.tsx`
- **Types**: `/src/lib/seo/types.ts`

## Performance

All functions are:
- ✅ Lightweight (no heavy dependencies)
- ✅ Server-side friendly
- ✅ Edge runtime compatible
- ✅ Zero runtime overhead (pure functions)

## Accessibility

Components follow accessibility standards:
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader friendly
- ✅ Proper heading hierarchy

## Browser Compatibility

JSON-LD works in all modern browsers and search engines:
- ✅ Google Search
- ✅ Bing
- ✅ Yahoo
- ✅ Yandex
- ✅ DuckDuckGo

## Maintenance

The code is:
- ✅ Well-documented
- ✅ Fully typed
- ✅ Modular and extensible
- ✅ Following Next.js best practices
- ✅ Compatible with React Server Components

---

**Implementation Complete** ✅

All requested files have been created and are ready for use. The implementation follows schema.org standards, Next.js best practices, and integrates seamlessly with your existing Sanity/Shopify setup.
