/**
 * AI Commerce Tools
 * Tool definitions for the Vercel AI SDK v6
 * These tools allow the AI to interact with the Shopify store
 */

import { z } from "zod";
import { tool } from "ai";
import {
  searchProducts,
  getProductByHandle,
  getAllProducts,
  getCollectionByHandle,
  type ShopifyProduct,
} from "@/lib/shopify";
import type { AIProduct } from "./types";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Transform a Shopify product to the simplified AI product format
 */
function transformToAIProduct(product: ShopifyProduct): AIProduct {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description || "",
    vendor: product.vendor || "",
    productType: product.productType || "",
    tags: product.tags || [],
    availableForSale: product.availableForSale,
    featuredImage: product.featuredImage
      ? {
          url: product.featuredImage.url,
          altText: product.featuredImage.altText ?? null,
          width: product.featuredImage.width || 800,
          height: product.featuredImage.height || 800,
        }
      : null,
    priceRange: {
      minVariantPrice: {
        amount: product.priceRange?.minVariantPrice?.amount || "0",
        currencyCode: product.priceRange?.minVariantPrice?.currencyCode || "USD",
      },
      maxVariantPrice: {
        amount: product.priceRange?.maxVariantPrice?.amount || "0",
        currencyCode: product.priceRange?.maxVariantPrice?.currencyCode || "USD",
      },
    },
    compareAtPriceRange: product.compareAtPriceRange
      ? {
          minVariantPrice: {
            amount: product.compareAtPriceRange.minVariantPrice?.amount || "0",
            currencyCode:
              product.compareAtPriceRange.minVariantPrice?.currencyCode || "USD",
          },
        }
      : null,
    variants: (product.variants?.edges || []).map((edge) => ({
      id: edge.node.id,
      title: edge.node.title,
      availableForSale: edge.node.availableForSale,
      selectedOptions: edge.node.selectedOptions || [],
      price: {
        amount: edge.node.priceV2?.amount || "0",
        currencyCode: edge.node.priceV2?.currencyCode || "USD",
      },
      compareAtPrice: edge.node.compareAtPriceV2 || null,
    })),
    options: product.options || [],
  };
}

// ============================================================================
// Tool Definitions
// ============================================================================

/**
 * Search for products using natural language
 */
export const searchProductsTool = tool({
  description:
    "Search for products in the catalog using natural language. Use this when customers ask to find products, browse items, or look for something specific. Returns a list of matching products with details.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "The search query - can be product name, type, color, style, or descriptive terms like 'minimalist leather bag' or 'cozy cashmere'"
      ),
    limit: z
      .number()
      .optional()
      .default(6)
      .describe("Maximum number of products to return (default: 6)"),
  }),
  execute: async ({ query, limit }) => {
    try {
      const products = await searchProducts(query);
      const aiProducts = products.slice(0, limit).map(transformToAIProduct);

      return {
        success: true,
        products: aiProducts,
        count: aiProducts.length,
        query,
      };
    } catch (error) {
      console.error("Search products error:", error);
      return {
        success: false,
        products: [] as AIProduct[],
        count: 0,
        query,
        error: "Failed to search products. Please try again.",
      };
    }
  },
});

/**
 * Get detailed information about a specific product
 */
export const getProductDetailsTool = tool({
  description:
    "Get detailed information about a specific product by its handle (URL slug). Use this when a customer wants to learn more about a particular product, see variants, check availability, or understand features.",
  inputSchema: z.object({
    handle: z
      .string()
      .describe("The product handle (URL slug), e.g., 'cashmere-sweater-black'"),
  }),
  execute: async ({ handle }) => {
    try {
      const product = await getProductByHandle(handle);

      if (!product) {
        return {
          success: false,
          product: null,
          error: `Product not found: ${handle}`,
        };
      }

      return {
        success: true,
        product: transformToAIProduct(product),
      };
    } catch (error) {
      console.error("Get product error:", error);
      return {
        success: false,
        product: null,
        error: "Failed to get product details. Please try again.",
      };
    }
  },
});

/**
 * Browse products in a collection
 */
export const browseCollectionTool = tool({
  description:
    "Browse products in a specific collection or category. Use this when customers want to explore a collection like 'new arrivals', 'best sellers', 'sale', or specific categories.",
  inputSchema: z.object({
    handle: z
      .string()
      .describe(
        "The collection handle (URL slug), e.g., 'new-arrivals', 'best-sellers', 'womens-clothing'"
      ),
    limit: z
      .number()
      .optional()
      .default(8)
      .describe("Maximum number of products to return (default: 8)"),
  }),
  execute: async ({ handle, limit }) => {
    try {
      const collection = await getCollectionByHandle(handle);

      if (!collection) {
        return {
          success: false,
          collection: null,
          products: [] as AIProduct[],
          error: `Collection not found: ${handle}`,
        };
      }

      const products = (collection.products?.edges || [])
        .slice(0, limit)
        .map((edge) => transformToAIProduct(edge.node));

      return {
        success: true,
        collection: {
          handle: collection.handle,
          title: collection.title,
          description: collection.description,
        },
        products,
        count: products.length,
      };
    } catch (error) {
      console.error("Browse collection error:", error);
      return {
        success: false,
        collection: null,
        products: [] as AIProduct[],
        error: "Failed to browse collection. Please try again.",
      };
    }
  },
});

/**
 * Get featured/recommended products
 */
export const getFeaturedProductsTool = tool({
  description:
    "Get featured or recommended products. Use this for general product recommendations, homepage browsing, or when the customer hasn't specified what they're looking for.",
  inputSchema: z.object({
    limit: z
      .number()
      .optional()
      .default(6)
      .describe("Maximum number of products to return (default: 6)"),
    category: z
      .string()
      .optional()
      .describe(
        "Optional category filter like 'clothing', 'accessories', 'home'"
      ),
  }),
  execute: async ({ limit, category }) => {
    try {
      let products = await getAllProducts(limit * 2);

      // Simple category filtering if provided
      if (category) {
        products = products.filter(
          (p) =>
            p.productType?.toLowerCase().includes(category.toLowerCase()) ||
            p.tags?.some((t) => t.toLowerCase().includes(category.toLowerCase()))
        );
      }

      const aiProducts = products.slice(0, limit).map(transformToAIProduct);

      return {
        success: true,
        products: aiProducts,
        count: aiProducts.length,
        category: category || "all",
      };
    } catch (error) {
      console.error("Get featured products error:", error);
      return {
        success: false,
        products: [] as AIProduct[],
        count: 0,
        error: "Failed to get featured products. Please try again.",
      };
    }
  },
});

/**
 * Add item to cart
 * Note: This returns instructions for the client to execute
 */
export const addToCartTool = tool({
  description:
    "Add a product variant to the customer's shopping cart. Use this when a customer decides to add something to their cart. Always confirm the variant (size, color) before adding.",
  inputSchema: z.object({
    variantId: z
      .string()
      .describe("The Shopify variant ID (gid://shopify/ProductVariant/...)"),
    quantity: z
      .number()
      .optional()
      .default(1)
      .describe("Quantity to add (default: 1)"),
    productTitle: z.string().describe("The product title for confirmation"),
    variantTitle: z.string().describe("The variant title (e.g., 'Black / Medium')"),
    price: z.string().describe("The price for confirmation"),
  }),
  execute: async ({ variantId, quantity, productTitle, variantTitle, price }) => {
    // This tool returns data for client-side execution
    // The actual cart operation happens in the AICommerceSheet component
    return {
      action: "ADD_TO_CART",
      variantId,
      quantity: quantity || 1,
      productTitle,
      variantTitle,
      price,
      message: `Adding ${quantity || 1}x ${productTitle} (${variantTitle}) to your cart...`,
    };
  },
});

/**
 * Get current cart state
 */
export const getCartTool = tool({
  description:
    "Get the current state of the customer's shopping cart. Use this to show cart contents, totals, or before generating a checkout.",
  inputSchema: z.object({}),
  execute: async () => {
    // This tool returns instructions for client-side execution
    return {
      action: "GET_CART",
      message: "Fetching your cart...",
    };
  },
});

/**
 * Generate checkout
 */
export const generateCheckoutTool = tool({
  description:
    "Generate a checkout link for the customer's cart. Use this when the customer is ready to complete their purchase. Shows a checkout summary with a button to proceed.",
  inputSchema: z.object({
    expressCheckout: z
      .boolean()
      .optional()
      .default(false)
      .describe("Whether to suggest express checkout options like Shop Pay"),
  }),
  execute: async ({ expressCheckout }) => {
    // This tool returns instructions for client-side execution
    return {
      action: "GENERATE_CHECKOUT",
      expressCheckout: expressCheckout || false,
      message: "Preparing your checkout...",
    };
  },
});

/**
 * Get product recommendations based on a product
 */
export const getRecommendationsTool = tool({
  description:
    "Get product recommendations based on a specific product. Use this for 'you might also like', 'complete the look', or similar product suggestions.",
  inputSchema: z.object({
    productHandle: z
      .string()
      .describe("The handle of the product to base recommendations on"),
    limit: z
      .number()
      .optional()
      .default(4)
      .describe("Maximum number of recommendations (default: 4)"),
  }),
  execute: async ({ productHandle, limit }) => {
    try {
      const product = await getProductByHandle(productHandle);

      if (!product) {
        return {
          success: false,
          recommendations: [] as AIProduct[],
          error: "Product not found",
        };
      }

      // Get products with similar type or tags
      const allProducts = await getAllProducts(50);
      const recommendations = allProducts
        .filter((p) => {
          if (p.id === product.id) return false;
          // Match by product type or overlapping tags
          const sameType = p.productType === product.productType;
          const sharedTags = p.tags?.some((t) => product.tags?.includes(t));
          return sameType || sharedTags;
        })
        .slice(0, limit)
        .map(transformToAIProduct);

      return {
        success: true,
        recommendations,
        basedOn: product.title,
        count: recommendations.length,
      };
    } catch (error) {
      console.error("Get recommendations error:", error);
      return {
        success: false,
        recommendations: [] as AIProduct[],
        error: "Failed to get recommendations. Please try again.",
      };
    }
  },
});

// ============================================================================
// Tool Collection
// ============================================================================

export const commerceTools = {
  searchProducts: searchProductsTool,
  getProductDetails: getProductDetailsTool,
  browseCollection: browseCollectionTool,
  getFeaturedProducts: getFeaturedProductsTool,
  addToCart: addToCartTool,
  getCart: getCartTool,
  generateCheckout: generateCheckoutTool,
  getRecommendations: getRecommendationsTool,
};
