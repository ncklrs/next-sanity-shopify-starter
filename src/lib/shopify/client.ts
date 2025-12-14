/**
 * Shopify Storefront API GraphQL Client
 * Uses native fetch with proper error handling and typing
 * Supports both server-side and client-side usage
 */

import {
  GraphQLResponse,
  ShopifyError,
  ShopifyGraphQLError,
  ShopifyNetworkError,
} from "./types";

// ============================================================================
// Configuration
// ============================================================================

const SHOPIFY_STOREFRONT_API_VERSION = "2024-01";

interface ShopifyConfig {
  storeDomain: string;
  storefrontAccessToken: string;
}

/**
 * Get Shopify configuration from environment variables
 * Throws error if required variables are missing
 */
function getShopifyConfig(): ShopifyConfig {
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken =
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!storeDomain || !storefrontAccessToken) {
    throw new ShopifyError(
      "Missing required Shopify environment variables. " +
        "Please set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN"
    );
  }

  return {
    storeDomain,
    storefrontAccessToken,
  };
}

/**
 * Build the Shopify Storefront API endpoint URL
 */
function getStorefrontApiUrl(storeDomain: string): string {
  // Remove any protocol or trailing slashes
  const cleanDomain = storeDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return `https://${cleanDomain}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;
}

// ============================================================================
// GraphQL Client
// ============================================================================

interface FetchOptions {
  cache?: RequestCache;
  tags?: string[];
  revalidate?: number | false;
}

/**
 * Execute a GraphQL query against the Shopify Storefront API
 *
 * @param query - GraphQL query string
 * @param variables - GraphQL variables object
 * @param options - Fetch options (cache, tags, revalidate)
 * @returns Typed response data
 * @throws ShopifyGraphQLError if GraphQL errors are returned
 * @throws ShopifyNetworkError if network/HTTP errors occur
 */
export async function shopifyFetch<T = any>({
  query,
  variables = {},
  options = {},
}: {
  query: string;
  variables?: Record<string, any>;
  options?: FetchOptions;
}): Promise<T> {
  const config = getShopifyConfig();
  const endpoint = getStorefrontApiUrl(config.storeDomain);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": config.storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: options.cache,
      next: {
        ...(options.tags && { tags: options.tags }),
        ...(options.revalidate !== undefined && {
          revalidate: options.revalidate,
        }),
      },
    });

    // Check for HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new ShopifyNetworkError(
        `Shopify API returned ${response.status}: ${errorText}`,
        response.status
      );
    }

    const json: GraphQLResponse<T> = await response.json();

    // Check for GraphQL errors
    if (json.errors && json.errors.length > 0) {
      throw new ShopifyGraphQLError(
        `GraphQL Error: ${json.errors.map((e) => e.message).join(", ")}`,
        json.errors
      );
    }

    return json.data;
  } catch (error) {
    // Re-throw our custom errors
    if (error instanceof ShopifyError) {
      throw error;
    }

    // Wrap network errors
    if (error instanceof TypeError) {
      throw new ShopifyNetworkError(
        `Network error: ${error.message}. Check your internet connection and Shopify configuration.`
      );
    }

    // Wrap unexpected errors
    throw new ShopifyError(
      `Unexpected error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// ============================================================================
// Convenience Methods
// ============================================================================

/**
 * Execute a query with default caching for static content
 * Revalidates every hour
 */
export async function shopifyFetchStatic<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  return shopifyFetch<T>({
    query,
    variables,
    options: {
      cache: "force-cache",
      revalidate: 3600, // 1 hour
    },
  });
}

/**
 * Execute a query without caching for dynamic content
 * Use for cart operations and real-time data
 */
export async function shopifyFetchDynamic<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  return shopifyFetch<T>({
    query,
    variables,
    options: {
      cache: "no-store",
    },
  });
}

/**
 * Execute a query with on-demand revalidation tags
 * Useful for ISR with webhook-based revalidation
 */
export async function shopifyFetchWithTags<T = any>(
  query: string,
  variables?: Record<string, any>,
  tags?: string[]
): Promise<T> {
  return shopifyFetch<T>({
    query,
    variables,
    options: {
      cache: "force-cache",
      tags,
    },
  });
}
