/**
 * Shopify API Configuration Constants
 */

/**
 * Shopify Storefront API version
 * Update to latest stable version: https://shopify.dev/api/release-notes
 */
export const SHOPIFY_API_VERSION = '2024-01';

/**
 * Default pagination limits for different data types
 */
export const PAGINATION = {
  /** Default number of products to fetch per page */
  PRODUCTS_PER_PAGE: 20,
  /** Default number of collections to fetch */
  COLLECTIONS_PER_PAGE: 10,
  /** Maximum products allowed by Shopify API in single request */
  MAX_PRODUCTS: 250,
  /** Default number of product variants to fetch */
  VARIANTS_PER_PRODUCT: 100,
} as const;

/**
 * Currency formatting options
 * Used for consistent price display across the application
 */
export const CURRENCY_FORMAT = {
  /** Default currency code (ISO 4217) */
  DEFAULT_CURRENCY: 'USD',
  /** Locale for number formatting */
  DEFAULT_LOCALE: 'en-US',
  /** Intl.NumberFormat options for currency display */
  FORMAT_OPTIONS: {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
} as const;

/**
 * Format price with currency symbol
 * @param amount - Price amount as number or string
 * @param currencyCode - Optional currency code (defaults to USD)
 * @returns Formatted price string (e.g., "$99.99")
 */
export function formatPrice(
  amount: number | string,
  currencyCode: string = CURRENCY_FORMAT.DEFAULT_CURRENCY
): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  return new Intl.NumberFormat(CURRENCY_FORMAT.DEFAULT_LOCALE, {
    ...CURRENCY_FORMAT.FORMAT_OPTIONS,
    currency: currencyCode,
  }).format(numericAmount);
}

/**
 * Shopify GraphQL endpoint paths
 */
export const SHOPIFY_ENDPOINTS = {
  STOREFRONT_API: '/api/2024-01/graphql.json',
  ADMIN_API: '/admin/api/2024-01/graphql.json',
} as const;
