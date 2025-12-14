/**
 * JsonLd Component
 * Safely injects JSON-LD structured data into the page head
 *
 * This component can be used in both Server Components and Client Components.
 * It should be placed inside the page component to inject structured data.
 *
 * Note: dangerouslySetInnerHTML is the standard and safe way to inject JSON-LD
 * when using JSON.stringify on structured data objects (not untrusted HTML).
 */

import { createElement } from 'react';

interface JsonLdProps {
  data: Record<string, any> | string;
}

/**
 * Renders a JSON-LD script tag with proper type and sanitization
 */
export function JsonLd({ data }: JsonLdProps) {
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data);

  return createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: jsonString }
  });
}

/**
 * Type-safe JSON-LD component specifically for Product structured data
 */
interface ProductJsonLdProps {
  data: {
    '@context': string;
    '@type': 'Product';
    [key: string]: any;
  } | string;
}

export function ProductJsonLd({ data }: ProductJsonLdProps) {
  return <JsonLd data={data} />;
}

/**
 * Type-safe JSON-LD component specifically for CollectionPage structured data
 */
interface CollectionJsonLdProps {
  data: {
    '@context': string;
    '@type': 'CollectionPage';
    [key: string]: any;
  } | string;
}

export function CollectionJsonLd({ data }: CollectionJsonLdProps) {
  return <JsonLd data={data} />;
}

/**
 * Type-safe JSON-LD component specifically for BreadcrumbList structured data
 */
interface BreadcrumbJsonLdProps {
  data: {
    '@context': string;
    '@type': 'BreadcrumbList';
    [key: string]: any;
  } | string;
}

export function BreadcrumbJsonLd({ data }: BreadcrumbJsonLdProps) {
  return <JsonLd data={data} />;
}

/**
 * Type-safe JSON-LD component specifically for Organization structured data
 */
interface OrganizationJsonLdProps {
  data: {
    '@context': string;
    '@type': 'Organization';
    [key: string]: any;
  } | string;
}

export function OrganizationJsonLd({ data }: OrganizationJsonLdProps) {
  return <JsonLd data={data} />;
}

/**
 * Type-safe JSON-LD component specifically for WebSite structured data
 */
interface WebSiteJsonLdProps {
  data: {
    '@context': string;
    '@type': 'WebSite';
    [key: string]: any;
  } | string;
}

export function WebSiteJsonLd({ data }: WebSiteJsonLdProps) {
  return <JsonLd data={data} />;
}

/**
 * Type-safe JSON-LD component specifically for Article/BlogPosting structured data
 */
interface ArticleJsonLdProps {
  data: {
    '@context': string;
    '@type': 'Article' | 'BlogPosting';
    [key: string]: any;
  } | string;
}

export function ArticleJsonLd({ data }: ArticleJsonLdProps) {
  return <JsonLd data={data} />;
}

/**
 * Combines multiple JSON-LD objects into a single script tag (using @graph)
 * This is useful when you want to include multiple schemas on one page
 */
interface MultiJsonLdProps {
  data: Array<Record<string, any>>;
}

export function MultiJsonLd({ data }: MultiJsonLdProps) {
  const graphData = {
    '@context': 'https://schema.org',
    '@graph': data,
  };

  return <JsonLd data={graphData} />;
}
