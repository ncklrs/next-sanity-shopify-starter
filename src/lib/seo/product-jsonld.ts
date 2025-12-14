/**
 * Product JSON-LD Generator
 * Generates schema.org/Product structured data for e-commerce products
 */

import type { Product } from '@/lib/shopify/types';

interface ProductJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description?: string;
  image?: string | string[];
  sku?: string;
  brand?: {
    '@type': 'Brand';
    name: string;
  };
  offers: {
    '@type': 'Offer';
    url?: string;
    priceCurrency: string;
    price: string;
    priceValidUntil?: string;
    availability: string;
    itemCondition?: string;
    seller?: {
      '@type': 'Organization';
      name: string;
    };
  } | {
    '@type': 'AggregateOffer';
    priceCurrency: string;
    lowPrice: string;
    highPrice: string;
    offerCount?: number;
    availability: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  review?: Array<{
    '@type': 'Review';
    reviewRating: {
      '@type': 'Rating';
      ratingValue: number;
      bestRating?: number;
    };
    author: {
      '@type': 'Person';
      name: string;
    };
    reviewBody?: string;
    datePublished?: string;
  }>;
}

export interface ProductJsonLdOptions {
  baseUrl?: string;
  seller?: string;
  reviews?: Array<{
    rating: number;
    author: string;
    body?: string;
    date?: string;
  }>;
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
 * Generates JSON-LD structured data for a product
 */
export function generateProductJsonLd(
  product: Product,
  options: ProductJsonLdOptions = {}
): ProductJsonLd {
  const { baseUrl, seller, reviews } = options;

  // Extract images
  const images = product.images?.edges?.map((edge) => edge.node.url) || [];
  const imageUrl = product.featuredImage?.url || images[0];

  // Get the first variant for SKU
  const firstVariant = product.variants?.edges?.[0]?.node;
  const sku = firstVariant?.sku;

  // Determine offer type based on price range
  const minPrice = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;
  const hasPriceRange = minPrice.amount !== maxPrice.amount;

  // Build the offer object
  const offer = hasPriceRange
    ? {
        '@type': 'AggregateOffer' as const,
        priceCurrency: minPrice.currencyCode,
        lowPrice: minPrice.amount,
        highPrice: maxPrice.amount,
        offerCount: product.variants?.edges?.length || 1,
        availability: getAvailabilityStatus(product.availableForSale),
      }
    : {
        '@type': 'Offer' as const,
        url: baseUrl ? `${baseUrl}/products/${product.handle}` : undefined,
        priceCurrency: minPrice.currencyCode,
        price: minPrice.amount,
        priceValidUntil: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        )
          .toISOString()
          .split('T')[0],
        availability: getAvailabilityStatus(product.availableForSale),
        itemCondition: 'https://schema.org/NewCondition',
        seller: seller
          ? {
              '@type': 'Organization' as const,
              name: seller,
            }
          : undefined,
      };

  const jsonLd: ProductJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.seo?.title || product.title,
    description: product.seo?.description || product.description,
    image: images.length > 1 ? images : imageUrl,
    sku: sku || undefined,
    brand: product.vendor
      ? {
          '@type': 'Brand',
          name: product.vendor,
        }
      : undefined,
    offers: offer,
  };

  // Add aggregate rating if reviews are provided
  if (reviews && reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: parseFloat(averageRating.toFixed(2)),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };

    // Add individual reviews
    jsonLd.review = reviews.map((review) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
      },
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewBody: review.body,
      datePublished: review.date,
    }));
  }

  return jsonLd;
}

/**
 * Converts JSON-LD object to string for script tag injection
 */
export function stringifyProductJsonLd(
  product: Product,
  options?: ProductJsonLdOptions
): string {
  const jsonLd = generateProductJsonLd(product, options);
  return JSON.stringify(jsonLd);
}
