/**
 * AI Commerce Types
 * Type definitions for the agentic commerce system
 */

import type { ShopifyProduct } from "@/lib/shopify";
import type { Cart, CartLine } from "@/lib/shopify/types";

// ============================================================================
// Message Types
// ============================================================================

export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
  /** Rich content blocks rendered in the chat */
  blocks?: AIContentBlock[];
}

export type AIContentBlock =
  | ProductCardBlock
  | ProductListBlock
  | CheckoutSummaryBlock
  | CartSummaryBlock
  | VariantSelectorBlock
  | ErrorBlock
  | LoadingBlock;

export interface ProductCardBlock {
  type: "product_card";
  product: AIProduct;
  selectedVariantId?: string;
  showActions?: boolean;
}

export interface ProductListBlock {
  type: "product_list";
  products: AIProduct[];
  title?: string;
}

export interface CheckoutSummaryBlock {
  type: "checkout_summary";
  cart: Cart;
  checkoutUrl: string;
}

export interface CartSummaryBlock {
  type: "cart_summary";
  cart: Cart;
}

export interface VariantSelectorBlock {
  type: "variant_selector";
  product: AIProduct;
  onSelect?: (variantId: string) => void;
}

export interface ErrorBlock {
  type: "error";
  message: string;
  recoverable?: boolean;
}

export interface LoadingBlock {
  type: "loading";
  message?: string;
}

// ============================================================================
// Product Types (simplified for AI context)
// ============================================================================

export interface AIProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: {
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
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
  } | null;
  variants: AIProductVariant[];
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
}

export interface AIProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice: {
    amount: string;
    currencyCode: string;
  } | null;
}

// ============================================================================
// Tool Types
// ============================================================================

export interface SearchProductsInput {
  query: string;
  limit?: number;
  productType?: string;
  priceMin?: number;
  priceMax?: number;
  tags?: string[];
}

export interface SearchProductsResult {
  products: AIProduct[];
  totalCount: number;
  query: string;
}

export interface GetProductInput {
  handle: string;
}

export interface AddToCartInput {
  variantId: string;
  quantity?: number;
}

export interface AddToCartResult {
  success: boolean;
  cart: Cart | null;
  addedItem: {
    productTitle: string;
    variantTitle: string;
    quantity: number;
    price: string;
  } | null;
  error?: string;
}

export interface GetCartResult {
  cart: Cart | null;
  items: CartLine[];
  totalQuantity: number;
  subtotal: string;
  checkoutUrl: string | null;
}

export interface GenerateCheckoutResult {
  checkoutUrl: string;
  cart: Cart;
  itemCount: number;
  total: string;
}

export interface CustomerContext {
  isAuthenticated: boolean;
  email?: string;
  firstName?: string;
  lastName?: string;
  recentlyViewed?: string[];
  wishlistItems?: string[];
  orderHistory?: {
    id: string;
    createdAt: string;
    totalPrice: string;
    itemCount: number;
  }[];
  preferences?: {
    sizes?: Record<string, string>;
    preferredCategories?: string[];
  };
}

// ============================================================================
// AI State Types
// ============================================================================

export interface AICommerceState {
  isOpen: boolean;
  isStreaming: boolean;
  /** Current page context for personalization */
  pageContext: PageContext | null;
  /** Customer context if authenticated */
  customerContext: CustomerContext | null;
}

export interface PageContext {
  type: "home" | "product" | "collection" | "search" | "cart" | "other";
  handle?: string;
  title?: string;
  product?: AIProduct;
  collection?: {
    handle: string;
    title: string;
  };
  searchQuery?: string;
}

// ============================================================================
// Action Types
// ============================================================================

export type AICommerceAction =
  | { type: "OPEN_SHEET" }
  | { type: "CLOSE_SHEET" }
  | { type: "SET_STREAMING"; payload: boolean }
  | { type: "ADD_MESSAGE"; payload: AIMessage }
  | { type: "UPDATE_MESSAGE"; payload: { id: string; updates: Partial<AIMessage> } }
  | { type: "CLEAR_MESSAGES" }
  | { type: "SET_PAGE_CONTEXT"; payload: PageContext | null }
  | { type: "SET_CUSTOMER_CONTEXT"; payload: CustomerContext | null };
