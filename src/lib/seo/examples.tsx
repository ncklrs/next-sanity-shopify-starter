/**
 * SEO & Structured Data Examples
 *
 * This file contains complete implementation examples for common e-commerce pages.
 * These examples demonstrate best practices for SEO and structured data integration.
 */

import type { Metadata } from 'next';
import { generateProductJsonLd, generateCollectionJsonLd, buildProductBreadcrumbs, buildCollectionBreadcrumbs } from '@/lib/seo';
import { ProductJsonLd, CollectionJsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/Breadcrumbs';

// ============================================================================
// Example 1: Complete Product Page
// ============================================================================

interface ProductPageProps {
  params: { handle: string };
}

/**
 * Complete product page with metadata, structured data, and breadcrumbs
 */
export async function ProductPageExample({ params }: ProductPageProps) {
  // Fetch product data (replace with your data fetching logic)
  const product = await fetchProduct(params.handle);
  const collection = await fetchProductCollection(product.id);
  const reviews = await fetchProductReviews(product.id);

  // Generate product JSON-LD with reviews
  const productJsonLd = generateProductJsonLd(product, {
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    seller: process.env.NEXT_PUBLIC_STORE_NAME || 'Your Store',
    reviews: reviews.map(review => ({
      rating: review.rating,
      author: review.author.name,
      body: review.content,
      date: review.createdAt,
    })),
  });

  // Build breadcrumbs
  const breadcrumbs = buildProductBreadcrumbs({
    productName: product.title,
    productHandle: product.handle,
    collectionName: collection?.title,
    collectionHandle: collection?.handle,
  });

  return (
    <>
      {/* Structured Data */}
      <ProductJsonLd data={productJsonLd} />

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={breadcrumbs} baseUrl={process.env.NEXT_PUBLIC_SITE_URL} />
      </div>

      {/* Product Content */}
      <main className="container mx-auto px-4 py-8">
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        {/* Rest of product page content */}
      </main>
    </>
  );
}

/**
 * Next.js metadata for product page
 */
export async function generateProductMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await fetchProduct(params.handle);
  const imageUrl = product.featuredImage?.url || product.images.edges[0]?.node.url;

  return {
    title: product.seo?.title || `${product.title} | Your Store`,
    description: product.seo?.description || product.description,
    openGraph: {
      title: product.seo?.title || product.title,
      description: product.seo?.description || product.description,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seo?.title || product.title,
      description: product.seo?.description || product.description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.handle}`,
    },
  };
}

// ============================================================================
// Example 2: Complete Collection Page
// ============================================================================

interface CollectionPageProps {
  params: { handle: string };
  searchParams?: { page?: string };
}

/**
 * Complete collection page with metadata, structured data, and breadcrumbs
 */
export async function CollectionPageExample({ params, searchParams }: CollectionPageProps) {
  const page = Number(searchParams?.page) || 1;
  const collection = await fetchCollection(params.handle, { page });

  // Generate collection JSON-LD
  const collectionJsonLd = generateCollectionJsonLd(collection, {
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    includeProducts: true,
    maxProducts: 10,
  });

  // Build breadcrumbs
  const breadcrumbs = buildCollectionBreadcrumbs({
    collectionName: collection.title,
    collectionHandle: collection.handle,
  });

  return (
    <>
      {/* Structured Data */}
      <CollectionJsonLd data={collectionJsonLd} />

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={breadcrumbs} baseUrl={process.env.NEXT_PUBLIC_SITE_URL} />
      </div>

      {/* Collection Content */}
      <main className="container mx-auto px-4 py-8">
        <h1>{collection.title}</h1>
        <p>{collection.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collection.products?.edges.map(({ node: product }: { node: any }) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </>
  );
}

/**
 * Next.js metadata for collection page
 */
export async function generateCollectionMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const collection = await fetchCollection(params.handle);
  const imageUrl = collection.image?.url;

  return {
    title: collection.seo?.title || `${collection.title} | Your Store`,
    description: collection.seo?.description || collection.description,
    openGraph: {
      title: collection.seo?.title || collection.title,
      description: collection.seo?.description || collection.description,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
      type: 'website',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/collections/${collection.handle}`,
    },
  };
}

// ============================================================================
// Example 3: Product Variant Page (with variant-specific data)
// ============================================================================

/**
 * Product page that adapts structured data based on selected variant
 */
export async function ProductVariantPageExample({ params, searchParams }: {
  params: { handle: string };
  searchParams?: { variant?: string };
}) {
  const product = await fetchProduct(params.handle);
  const selectedVariantId = searchParams?.variant;
  const selectedVariant = product.variants.edges.find(
    ({ node }: { node: any }) => node.id === selectedVariantId
  )?.node || product.variants.edges[0]?.node;

  // For single variant selection, you might want to create variant-specific JSON-LD
  // This is useful for products with significantly different variants
  const productJsonLd = generateProductJsonLd(product, {
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    seller: process.env.NEXT_PUBLIC_STORE_NAME,
  });

  // Override price if specific variant selected
  if (selectedVariant && 'offers' in productJsonLd && productJsonLd.offers['@type'] === 'Offer') {
    productJsonLd.offers.price = selectedVariant.price.amount;
    productJsonLd.offers.priceCurrency = selectedVariant.price.currencyCode;
    productJsonLd.offers.availability = selectedVariant.availableForSale
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';
  }

  return (
    <>
      <ProductJsonLd data={productJsonLd} />
      {/* Rest of product page */}
    </>
  );
}

// ============================================================================
// Example 4: Multi-structured Data (Product + Organization + WebSite)
// ============================================================================

import { MultiJsonLd } from '@/components/JsonLd';

/**
 * Homepage with multiple structured data types
 */
export async function HomepageWithMultipleSchemas() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: process.env.NEXT_PUBLIC_STORE_NAME,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/yourstore',
      'https://facebook.com/yourstore',
      'https://instagram.com/yourstore',
    ],
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
      {/* Homepage content */}
    </>
  );
}

// ============================================================================
// Mock Data Fetching Functions (replace with your actual implementation)
// ============================================================================

async function fetchProduct(handle: string): Promise<any> {
  // Replace with your Shopify client or API call
  // Example: return getProductByHandle(handle);
  return {
    id: 'example-product-id',
    handle,
    title: 'Example Product',
    description: 'Example product description',
    featuredImage: { url: '/placeholder.jpg' },
    images: { edges: [] },
    variants: { edges: [] },
    priceRange: { minVariantPrice: { amount: '0', currencyCode: 'USD' } },
    seo: { title: '', description: '' },
  };
}

async function fetchCollection(handle: string, options?: { page?: number }): Promise<any> {
  // Replace with your Shopify client or API call
  // Example: return getCollectionByHandle(handle);
  return {
    id: 'example-collection-id',
    handle,
    title: 'Example Collection',
    description: 'Example collection description',
    image: { url: '/placeholder.jpg' },
    products: { edges: [] },
    seo: { title: '', description: '' },
  };
}

async function fetchProductCollection(productId: string): Promise<any> {
  // Replace with your logic to get the primary collection for a product
  return {
    title: 'Example Collection',
    handle: 'example-collection',
  };
}

async function fetchProductReviews(productId: string): Promise<any[]> {
  // Replace with your review system API
  return [];
}

function ProductCard({ product }: any) {
  // Replace with your product card component
  return null;
}
