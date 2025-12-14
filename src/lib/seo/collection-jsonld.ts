/**
 * Collection JSON-LD Generator
 * Generates schema.org/CollectionPage structured data for product collections
 */

import type { Collection, Product } from '@/lib/shopify/types';

interface CollectionJsonLd {
  '@context': 'https://schema.org';
  '@type': 'CollectionPage';
  name: string;
  description?: string;
  url?: string;
  image?: string;
  mainEntity?: {
    '@type': 'ItemList';
    numberOfItems: number;
    itemListElement: Array<{
      '@type': 'ListItem';
      position: number;
      url?: string;
      item?: {
        '@type': 'Product';
        name: string;
        image?: string;
        description?: string;
        offers?: {
          '@type': 'Offer';
          priceCurrency: string;
          price: string;
          availability: string;
        };
      };
    }>;
  };
}

export interface CollectionJsonLdOptions {
  baseUrl?: string;
  includeProducts?: boolean;
  maxProducts?: number;
}

/**
 * Maps Shopify availability to schema.org availability status
 */
function getAvailabilityStatus(availableForSale: boolean): string {
  return availableForSale
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';
}

/**
 * Generates JSON-LD structured data for a collection
 */
export function generateCollectionJsonLd(
  collection: Collection,
  options: CollectionJsonLdOptions = {}
): CollectionJsonLd {
  const { baseUrl, includeProducts = true, maxProducts = 10 } = options;

  const jsonLd: CollectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.seo?.title || collection.title,
    description: collection.seo?.description || collection.description,
    url: baseUrl ? `${baseUrl}/collections/${collection.handle}` : undefined,
    image: collection.image?.url,
  };

  // Add product list if products are available and should be included
  if (includeProducts && collection.products?.edges) {
    const products = collection.products.edges
      .slice(0, maxProducts)
      .map((edge) => edge.node);

    jsonLd.mainEntity = {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => {
        const minPrice = product.priceRange.minVariantPrice;
        const imageUrl = product.featuredImage?.url || product.images?.edges?.[0]?.node.url;

        return {
          '@type': 'ListItem',
          position: index + 1,
          url: baseUrl ? `${baseUrl}/products/${product.handle}` : undefined,
          item: {
            '@type': 'Product',
            name: product.title,
            image: imageUrl,
            description: product.description,
            offers: {
              '@type': 'Offer',
              priceCurrency: minPrice.currencyCode,
              price: minPrice.amount,
              availability: getAvailabilityStatus(product.availableForSale),
            },
          },
        };
      }),
    };
  }

  return jsonLd;
}

/**
 * Converts JSON-LD object to string for script tag injection
 */
export function stringifyCollectionJsonLd(
  collection: Collection,
  options?: CollectionJsonLdOptions
): string {
  const jsonLd = generateCollectionJsonLd(collection, options);
  return JSON.stringify(jsonLd);
}

/**
 * Generates a simple collection JSON-LD without product details
 * Useful for large collections where you don't want to include all products
 */
export function generateSimpleCollectionJsonLd(
  collection: Collection,
  options: Pick<CollectionJsonLdOptions, 'baseUrl'> = {}
): Omit<CollectionJsonLd, 'mainEntity'> {
  const { baseUrl } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.seo?.title || collection.title,
    description: collection.seo?.description || collection.description,
    url: baseUrl ? `${baseUrl}/collections/${collection.handle}` : undefined,
    image: collection.image?.url,
  };
}
