/**
 * Shopify Storefront API Client
 *
 * Utilities for fetching product and collection data from Shopify.
 * Uses the Storefront API with GraphQL queries.
 */

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !storefrontAccessToken) {
  console.warn('Shopify credentials not configured. E-commerce features will not work.');
}

async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  tags,
}: {
  query: string;
  variables?: any;
  cache?: RequestCache;
  tags?: string[];
}): Promise<T> {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      next: { tags },
    });

    if (!result.ok) {
      throw new Error(`Shopify API error: ${result.statusText}`);
    }

    const json = await result.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    return json.data;
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw error;
  }
}

// Product Types
export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage?: {
    url: string;
    altText?: string;
    width: number;
    height: number;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
        width: number;
        height: number;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
        priceV2: {
          amount: string;
          currencyCode: string;
        };
        compareAtPriceV2?: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
  availableForSale: boolean;
  tags: string[];
  productType: string;
  vendor: string;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image?: {
    url: string;
    altText?: string;
    width: number;
    height: number;
  };
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

// GraphQL Fragments
const productFragment = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          priceV2 {
            amount
            currencyCode
          }
          compareAtPriceV2 {
            amount
            currencyCode
          }
        }
      }
    }
    availableForSale
    tags
    productType
    vendor
  }
`;

// Get all products
export async function getAllProducts(first: number = 250): Promise<ShopifyProduct[]> {
  const query = `
    ${productFragment}
    query GetAllProducts($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>({
    query,
    variables: { first },
    tags: ['products'],
  });

  return response.products.edges.map((edge) => edge.node);
}

// Get product by handle
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    ${productFragment}
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductFragment
      }
    }
  `;

  const response = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query,
    variables: { handle },
    tags: ['products', `product:${handle}`],
  });

  return response.product;
}

// Get all product handles (for generateStaticParams)
export async function getAllProductHandles(): Promise<string[]> {
  const query = `
    query GetAllProductHandles {
      products(first: 250) {
        edges {
          node {
            handle
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{
    products: { edges: Array<{ node: { handle: string } }> };
  }>({
    query,
    cache: 'no-store',
  });

  return response.products.edges.map((edge) => edge.node.handle);
}

// Get all collections
export async function getAllCollections(): Promise<ShopifyCollection[]> {
  const query = `
    query GetAllCollections {
      collections(first: 100) {
        edges {
          node {
            id
            handle
            title
            description
            descriptionHtml
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{
    collections: { edges: Array<{ node: ShopifyCollection }> };
  }>({
    query,
    tags: ['collections'],
  });

  return response.collections.edges.map((edge) => edge.node);
}

// Get collection by handle with products
export async function getCollectionByHandle(handle: string): Promise<ShopifyCollection | null> {
  const query = `
    ${productFragment}
    query GetCollectionByHandle($handle: String!) {
      collection(handle: $handle) {
        id
        handle
        title
        description
        descriptionHtml
        image {
          url
          altText
          width
          height
        }
        products(first: 100, sortKey: BEST_SELLING) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ collection: ShopifyCollection | null }>({
    query,
    variables: { handle },
    tags: ['collections', `collection:${handle}`],
  });

  return response.collection;
}

// Get all collection handles (for generateStaticParams)
export async function getAllCollectionHandles(): Promise<string[]> {
  const query = `
    query GetAllCollectionHandles {
      collections(first: 100) {
        edges {
          node {
            handle
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{
    collections: { edges: Array<{ node: { handle: string } }> };
  }>({
    query,
    cache: 'no-store',
  });

  return response.collections.edges.map((edge) => edge.node.handle);
}

// Search products
export async function searchProducts(query: string): Promise<ShopifyProduct[]> {
  const searchQuery = `
    ${productFragment}
    query SearchProducts($query: String!) {
      products(first: 100, query: $query) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>({
    query: searchQuery,
    variables: { query },
    cache: 'no-store',
  });

  return response.products.edges.map((edge) => edge.node);
}

// Get related products (by product type and tags)
export async function getRelatedProducts(
  productId: string,
  productType: string,
  tags: string[],
  limit: number = 4
): Promise<ShopifyProduct[]> {
  // Build a search query based on product type or tags
  const searchQuery = productType
    ? `product_type:${productType}`
    : tags.length > 0
    ? `tag:${tags[0]}`
    : '';

  if (!searchQuery) return [];

  const query = `
    ${productFragment}
    query GetRelatedProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>({
    query,
    variables: { query: searchQuery, first: limit + 1 },
    cache: 'force-cache',
  });

  // Filter out the current product and limit results
  return response.products.edges
    .map((edge) => edge.node)
    .filter((product) => product.id !== productId)
    .slice(0, limit);
}

// Format price helper
export function formatPrice(amount: string, currencyCode: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

// Re-export cart functions and types from shopify directory module
export {
  createCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
} from './shopify/queries';

export type {
  Cart,
  CartLine,
  CartLineInput,
  CartLineUpdateInput,
} from './shopify/types';
