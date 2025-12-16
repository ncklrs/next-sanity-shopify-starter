/**
 * Shopify Customer Account API TypeScript Types
 * OAuth 2.0 with PKCE for authentication
 */

import type { Money, Image, PageInfo } from "./types";

// ============================================================================
// Authentication Types
// ============================================================================

export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string; // ISO 8601 datetime
  refreshToken: string;
  idToken?: string;
}

export interface OAuthState {
  codeVerifier: string;
  state: string;
  returnTo?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token?: string;
}

// ============================================================================
// Customer Types
// ============================================================================

export interface ShopifyCustomer {
  id: string; // gid://shopify/Customer/...
  email: string;
  emailMarketingConsent: MarketingConsent | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  phone: string | null;
  phoneNumber: PhoneNumber | null;
  acceptsMarketing: boolean;
  createdAt: string;
  updatedAt: string;
  numberOfOrders: number;
  defaultAddress: ShopifyAddress | null;
  addresses: {
    edges: Array<{ node: ShopifyAddress }>;
    pageInfo: PageInfo;
  };
  orders: {
    edges: Array<{ node: ShopifyOrder }>;
    pageInfo: PageInfo;
  };
}

export interface MarketingConsent {
  marketingState: "NOT_SUBSCRIBED" | "SUBSCRIBED" | "PENDING" | "UNSUBSCRIBED";
  marketingOptInLevel: "SINGLE_OPT_IN" | "CONFIRMED_OPT_IN" | "UNKNOWN";
  consentUpdatedAt: string | null;
}

export interface PhoneNumber {
  phoneNumber: string;
}

// ============================================================================
// Address Types
// ============================================================================

// Customer Account API address type
export interface ShopifyAddress {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  zoneCode: string | null;
  zip: string | null;
  phoneNumber: string | null;
  formatted: string[];
}

export interface AddressInput {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  phone?: string;
}

// ============================================================================
// Order Types
// ============================================================================

// Customer Account API order type
export interface ShopifyOrder {
  id: string;
  name: string; // Order number like "#1001"
  number: number;
  processedAt: string;
  financialStatus: OrderFinancialStatus;
  totalPrice: Money;
  subtotal: Money;
  totalTax: Money;
  totalShipping: Money;
  shippingAddress: ShopifyAddress | null;
  billingAddress: ShopifyAddress | null;
  lineItems: {
    edges: Array<{ node: OrderLineItem }>;
    pageInfo: PageInfo;
  };
  fulfillments: {
    edges: Array<{ node: Fulfillment }>;
  };
}

export type OrderFinancialStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "PARTIALLY_PAID"
  | "PARTIALLY_REFUNDED"
  | "PAID"
  | "REFUNDED"
  | "VOIDED";

// Note: fulfillmentStatus is derived from fulfillments array in Customer Account API
// These status strings are used for display purposes
export type FulfillmentStatus =
  | "UNFULFILLED"
  | "PARTIALLY_FULFILLED"
  | "FULFILLED"
  | "IN_PROGRESS";

// Customer Account API line item type
export interface OrderLineItem {
  id: string;
  title: string;
  quantity: number;
  price: Money;
  totalPrice: Money;
  image: Image | null;
}

// Customer Account API fulfillment type
export interface Fulfillment {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  latestShipmentStatus: string | null;
  estimatedDeliveryAt: string | null;
  trackingInformation: Array<{
    company: string | null;
    number: string | null;
    url: string | null;
  }>;
}

// ============================================================================
// Mutation Input Types
// ============================================================================

// Customer Account API only supports firstName and lastName updates
// Phone and marketing preferences are managed through other channels
export interface CustomerUpdateInput {
  firstName?: string;
  lastName?: string;
}

// ============================================================================
// Sanity Customer Mirror Types
// ============================================================================

export interface SanityCustomer {
  _id: string;
  _type: "customer";
  shopifyCustomerId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing: boolean;
  wishlist: string[]; // Product handles
  recentlyViewed: string[]; // Product handles
  preferences?: {
    currency?: string;
    language?: string;
    notifications?: {
      orderUpdates?: boolean;
      promotions?: boolean;
      backInStock?: boolean;
    };
  };
  totalOrders: number;
  totalSpent: number; // In cents
  createdAt: string;
  lastLoginAt?: string;
}

export interface SanityCustomerAddress {
  _id: string;
  _type: "customerAddress";
  customer: { _ref: string };
  shopifyAddressId?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  provinceCode?: string;
  country: string;
  countryCode?: string;
  zip: string;
  phone?: string;
  isDefault: boolean;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface CustomerQueryResponse {
  customer: ShopifyCustomer | null;
}

// Note: Response types are now defined inline in customer-api.ts functions
// to match the actual Customer Account API schema which uses "userErrors" not "customerUserErrors"

export interface UserError {
  field: string[] | null;
  message: string;
}

// ============================================================================
// Error Types
// ============================================================================

export class CustomerAuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "CustomerAuthError";
  }
}

export class TokenExpiredError extends CustomerAuthError {
  constructor() {
    super("Access token has expired", "TOKEN_EXPIRED", 401);
    this.name = "TokenExpiredError";
  }
}

export class InvalidTokenError extends CustomerAuthError {
  constructor() {
    super("Invalid or malformed token", "INVALID_TOKEN", 401);
    this.name = "InvalidTokenError";
  }
}
