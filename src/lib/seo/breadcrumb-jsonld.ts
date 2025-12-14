/**
 * Breadcrumb JSON-LD Generator
 * Generates schema.org/BreadcrumbList structured data for navigation
 */

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbJsonLd {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

interface BreadcrumbJsonLdOptions {
  baseUrl?: string;
}

/**
 * Generates JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbJsonLd(
  breadcrumbs: BreadcrumbItem[],
  options: BreadcrumbJsonLdOptions = {}
): BreadcrumbJsonLd {
  const { baseUrl } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => {
      const isLastItem = index === breadcrumbs.length - 1;
      const url = breadcrumb.href.startsWith('http')
        ? breadcrumb.href
        : baseUrl
        ? `${baseUrl}${breadcrumb.href}`
        : breadcrumb.href;

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        // Don't include 'item' for the last breadcrumb (current page)
        item: !isLastItem ? url : undefined,
      };
    }),
  };
}

/**
 * Converts JSON-LD object to string for script tag injection
 */
export function stringifyBreadcrumbJsonLd(
  breadcrumbs: BreadcrumbItem[],
  options?: BreadcrumbJsonLdOptions
): string {
  const jsonLd = generateBreadcrumbJsonLd(breadcrumbs, options);
  return JSON.stringify(jsonLd);
}

/**
 * Helper function to build product breadcrumbs
 * Path: Home > Collections > [Collection Name] > [Product Name]
 */
export function buildProductBreadcrumbs(params: {
  productName: string;
  productHandle: string;
  collectionName?: string;
  collectionHandle?: string;
}): BreadcrumbItem[] {
  const { productName, productHandle, collectionName, collectionHandle } = params;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
  ];

  // Add collections page if a collection is specified
  if (collectionName && collectionHandle) {
    breadcrumbs.push(
      { name: 'Collections', href: '/collections' },
      { name: collectionName, href: `/collections/${collectionHandle}` }
    );
  } else {
    // If no collection, just add products page
    breadcrumbs.push({ name: 'Products', href: '/products' });
  }

  // Add current product
  breadcrumbs.push({
    name: productName,
    href: `/products/${productHandle}`,
  });

  return breadcrumbs;
}

/**
 * Helper function to build collection breadcrumbs
 * Path: Home > Collections > [Collection Name]
 */
export function buildCollectionBreadcrumbs(params: {
  collectionName: string;
  collectionHandle: string;
}): BreadcrumbItem[] {
  const { collectionName, collectionHandle } = params;

  return [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/collections' },
    { name: collectionName, href: `/collections/${collectionHandle}` },
  ];
}

/**
 * Helper function to build generic page breadcrumbs
 * Path: Home > [...segments]
 */
export function buildPageBreadcrumbs(params: {
  segments: Array<{ name: string; href: string }>;
}): BreadcrumbItem[] {
  const { segments } = params;

  return [
    { name: 'Home', href: '/' },
    ...segments,
  ];
}

/**
 * Helper function to build blog post breadcrumbs
 * Path: Home > Blog > [Post Title]
 */
export function buildBlogBreadcrumbs(params: {
  postTitle: string;
  postSlug: string;
  categoryName?: string;
  categorySlug?: string;
}): BreadcrumbItem[] {
  const { postTitle, postSlug, categoryName, categorySlug } = params;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
  ];

  // Add category if specified
  if (categoryName && categorySlug) {
    breadcrumbs.push({
      name: categoryName,
      href: `/blog/category/${categorySlug}`,
    });
  }

  // Add current post
  breadcrumbs.push({
    name: postTitle,
    href: `/blog/${postSlug}`,
  });

  return breadcrumbs;
}
