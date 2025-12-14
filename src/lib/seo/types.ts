/**
 * SEO Type Definitions
 * Centralized type exports for SEO and structured data
 */

// Re-export from breadcrumb-jsonld
export type { BreadcrumbItem } from './breadcrumb-jsonld';

// Re-export from product-jsonld
export type { ProductJsonLdOptions } from './product-jsonld';

// Re-export from collection-jsonld
export type { CollectionJsonLdOptions } from './collection-jsonld';

// Re-export Shopify types that are commonly used with SEO
export type { Product, Collection, Image, Money, SEO } from '@/lib/shopify/types';

/**
 * Common SEO metadata type
 */
export interface SeoMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  canonical?: string;
}

/**
 * Structured data types
 */
export type StructuredDataType =
  | 'Product'
  | 'CollectionPage'
  | 'BreadcrumbList'
  | 'Organization'
  | 'WebSite'
  | 'Article'
  | 'BlogPosting'
  | 'Review'
  | 'AggregateRating';

/**
 * Base JSON-LD type
 */
export interface BaseJsonLd {
  '@context': string;
  '@type': StructuredDataType;
  [key: string]: any;
}

/**
 * Review data structure
 */
export interface ReviewData {
  rating: number;
  author: string;
  body?: string;
  date?: string;
}

/**
 * Organization schema type
 */
export interface OrganizationJsonLd extends BaseJsonLd {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: Array<{
    '@type': 'ContactPoint';
    telephone?: string;
    contactType?: string;
    email?: string;
  }>;
}

/**
 * WebSite schema type
 */
export interface WebSiteJsonLd extends BaseJsonLd {
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

/**
 * Article schema type
 */
export interface ArticleJsonLd extends BaseJsonLd {
  '@type': 'Article' | 'BlogPosting';
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    '@type': 'Person' | 'Organization';
    name: string;
    url?: string;
  };
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
}
