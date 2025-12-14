import type { Product, GraphQLResponse } from "./types";

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
  console.warn(
    "Shopify environment variables are not configured. Search functionality will return empty results."
  );
}

const STOREFRONT_API_VERSION = "2024-01";

interface PredictiveSearchResponse {
  data: {
    predictiveSearch: {
      products: Array<{
        id: string;
        handle: string;
        title: string;
        description: string;
        availableForSale: boolean;
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
        featuredImage: {
          url: string;
          altText: string | null;
        } | null;
        images: {
          edges: Array<{
            node: {
              url: string;
              altText: string | null;
            };
          }>;
        };
      }>;
    };
  };
}

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
    return { data: { predictiveSearch: { products: [] } } } as T;
  }

  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json;
}

const PREDICTIVE_SEARCH_QUERY = `
  query PredictiveSearch($query: String!, $limit: Int!) {
    predictiveSearch(query: $query, limit: $limit, types: PRODUCT) {
      products {
        id
        handle
        title
        description
        availableForSale
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
        featuredImage {
          url
          altText
        }
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

export async function searchProducts(query: string, limit: number = 10): Promise<Product[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await shopifyFetch<PredictiveSearchResponse>(PREDICTIVE_SEARCH_QUERY, {
      query: query.trim(),
      limit,
    });

    // Transform the response to match our Product type
    const products = response.data.predictiveSearch.products.map((product) => ({
      id: product.id,
      handle: product.handle,
      title: product.title,
      description: product.description,
      descriptionHtml: product.description,
      vendor: "",
      productType: "",
      tags: [],
      availableForSale: product.availableForSale,
      priceRange: product.priceRange,
      compareAtPriceRange: null,
      images: {
        edges: product.images.edges.map((edge) => ({
          node: {
            id: edge.node.url, // Use URL as a fallback ID
            url: edge.node.url,
            altText: edge.node.altText,
            width: 0,
            height: 0,
          },
        })),
      },
      variants: { edges: [] },
      featuredImage: product.featuredImage ? {
        id: product.featuredImage.url,
        url: product.featuredImage.url,
        altText: product.featuredImage.altText,
        width: 0,
        height: 0,
      } : null,
      seo: {
        title: product.title,
        description: product.description,
      },
      options: [],
      createdAt: "",
      updatedAt: "",
    })) as Product[];

    return products;
  } catch (error) {
    console.error("Product search error:", error);
    throw error;
  }
}
