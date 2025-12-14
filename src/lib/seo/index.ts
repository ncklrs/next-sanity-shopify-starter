/**
 * SEO Library - E-commerce Structured Data
 *
 * This module provides utilities for generating schema.org structured data
 * for e-commerce applications, including products, collections, and breadcrumbs.
 *
 * @example Product Page
 * ```tsx
 * import { generateProductJsonLd } from '@/lib/seo';
 * import { ProductJsonLd } from '@/components/JsonLd';
 *
 * export default function ProductPage({ product }) {
 *   const jsonLd = generateProductJsonLd(product, {
 *     baseUrl: 'https://example.com',
 *     seller: 'Your Store Name',
 *   });
 *
 *   return (
 *     <>
 *       <ProductJsonLd data={jsonLd} />
 *       // ... rest of page
 *     </>
 *   );
 * }
 * ```
 *
 * @example Collection Page
 * ```tsx
 * import { generateCollectionJsonLd } from '@/lib/seo';
 * import { CollectionJsonLd } from '@/components/JsonLd';
 *
 * export default function CollectionPage({ collection }) {
 *   const jsonLd = generateCollectionJsonLd(collection, {
 *     baseUrl: 'https://example.com',
 *     includeProducts: true,
 *   });
 *
 *   return (
 *     <>
 *       <CollectionJsonLd data={jsonLd} />
 *       // ... rest of page
 *     </>
 *   );
 * }
 * ```
 *
 * @example Breadcrumbs
 * ```tsx
 * import { buildProductBreadcrumbs } from '@/lib/seo';
 * import { Breadcrumbs } from '@/components/Breadcrumbs';
 *
 * export default function ProductPage({ product, collection }) {
 *   const breadcrumbs = buildProductBreadcrumbs({
 *     productName: product.title,
 *     productHandle: product.handle,
 *     collectionName: collection?.title,
 *     collectionHandle: collection?.handle,
 *   });
 *
 *   return <Breadcrumbs items={breadcrumbs} baseUrl="https://example.com" />;
 * }
 * ```
 */

// Product JSON-LD
export {
  generateProductJsonLd,
  stringifyProductJsonLd,
} from './product-jsonld';
export type { ProductJsonLdOptions } from './product-jsonld';

// Collection JSON-LD
export {
  generateCollectionJsonLd,
  stringifyCollectionJsonLd,
  generateSimpleCollectionJsonLd,
} from './collection-jsonld';
export type { CollectionJsonLdOptions } from './collection-jsonld';

// Breadcrumb JSON-LD
export {
  generateBreadcrumbJsonLd,
  stringifyBreadcrumbJsonLd,
  buildProductBreadcrumbs,
  buildCollectionBreadcrumbs,
  buildPageBreadcrumbs,
  buildBlogBreadcrumbs,
} from './breadcrumb-jsonld';
export type { BreadcrumbItem } from './breadcrumb-jsonld';
