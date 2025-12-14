/**
 * Shopify Storefront API - Public API
 * Export all public types and functions
 */

// ============================================================================
// Types
// ============================================================================

export type {
  // Core Types
  Money,
  Image,
  SelectedOption,
  SEO,
  // Product Types
  Product,
  ProductVariant,
  // Collection Types
  Collection,
  // Cart Types
  Cart,
  CartLine,
  // Pagination
  PageInfo,
  Connection,
  // Input Types
  ProductsQueryInput,
  CollectionsQueryInput,
  CollectionProductsQueryInput,
  CartLineInput,
  CartLineUpdateInput,
  CartInput,
  ProductSortKey,
  CollectionSortKey,
  // Error Types
  GraphQLResponse,
} from "./types";

export {
  ShopifyError,
  ShopifyGraphQLError,
  ShopifyNetworkError,
} from "./types";

// ============================================================================
// Client Functions
// ============================================================================

export {
  shopifyFetch,
  shopifyFetchStatic,
  shopifyFetchDynamic,
  shopifyFetchWithTags,
} from "./client";

// ============================================================================
// Query Functions
// ============================================================================

export {
  // Product Queries
  getProducts,
  getProductByHandle,
  // Collection Queries
  getCollections,
  getCollectionByHandle,
  // Cart Operations
  createCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
} from "./queries";
