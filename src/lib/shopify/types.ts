/**
 * Shopify Storefront API TypeScript Types
 * API Version: 2024-01
 */

// ============================================================================
// Core Types
// ============================================================================

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Image {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface SEO {
  title: string | null;
  description: string | null;
}

// ============================================================================
// Product Types
// ============================================================================

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
  quantityAvailable: number | null;
  sku: string | null;
  weight: number | null;
  weightUnit: string | null;
  // Product reference (available in cart line merchandise)
  product?: {
    id: string;
    handle: string;
    title: string;
    featuredImage: Image | null;
  };
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  } | null;
  images: {
    edges: Array<{
      node: Image;
    }>;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
  featuredImage: Image | null;
  seo: SEO;
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Collection Types
// ============================================================================

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: Image | null;
  seo: SEO;
  updatedAt: string;
  products?: {
    edges: Array<{
      node: Product;
    }>;
    pageInfo: PageInfo;
  };
}

// ============================================================================
// Cart Types
// ============================================================================

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: ProductVariant;
  cost: {
    totalAmount: Money;
    subtotalAmount: Money;
    compareAtAmountPerQuantity: Money | null;
  };
  attributes: Array<{
    key: string;
    value: string;
  }>;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  attributes: Array<{
    key: string;
    value: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface Connection<T> {
  edges: Array<{
    node: T;
    cursor: string;
  }>;
  pageInfo: PageInfo;
}

// ============================================================================
// GraphQL Response Types
// ============================================================================

export interface GraphQLResponse<T = any> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
    extensions?: any;
  }>;
}

// ============================================================================
// Query Input Types
// ============================================================================

export interface ProductsQueryInput {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  query?: string;
  sortKey?: ProductSortKey;
  reverse?: boolean;
}

export type ProductSortKey =
  | "TITLE"
  | "PRODUCT_TYPE"
  | "VENDOR"
  | "UPDATED_AT"
  | "CREATED_AT"
  | "BEST_SELLING"
  | "PRICE"
  | "RELEVANCE";

export interface CollectionsQueryInput {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  query?: string;
  sortKey?: CollectionSortKey;
  reverse?: boolean;
}

export type CollectionSortKey = "TITLE" | "UPDATED_AT" | "RELEVANCE";

export interface CollectionProductsQueryInput {
  handle: string;
  first?: number;
  after?: string;
  sortKey?: ProductSortKey;
  reverse?: boolean;
}

// ============================================================================
// Cart Mutation Input Types
// ============================================================================

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  attributes?: Array<{
    key: string;
    value: string;
  }>;
}

export interface CartLineUpdateInput {
  id: string;
  quantity: number;
  attributes?: Array<{
    key: string;
    value: string;
  }>;
}

export interface CartInput {
  lines?: CartLineInput[];
  attributes?: Array<{
    key: string;
    value: string;
  }>;
  buyerIdentity?: {
    email?: string;
    phone?: string;
    countryCode?: string;
  };
}

// ============================================================================
// Error Types
// ============================================================================

export class ShopifyError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: any[]
  ) {
    super(message);
    this.name = "ShopifyError";
  }
}

export class ShopifyGraphQLError extends ShopifyError {
  constructor(message: string, errors: any[]) {
    super(message, undefined, errors);
    this.name = "ShopifyGraphQLError";
  }
}

export class ShopifyNetworkError extends ShopifyError {
  constructor(message: string, statusCode?: number) {
    super(message, statusCode);
    this.name = "ShopifyNetworkError";
  }
}
