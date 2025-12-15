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

export interface ShopifyAddress {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  provinceCode: string | null;
  country: string | null;
  countryCodeV2: string | null;
  zip: string | null;
  phone: string | null;
  formatted: string[];
  formattedArea: string | null;
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

export interface ShopifyOrder {
  id: string;
  name: string; // Order number like "#1001"
  orderNumber: number;
  processedAt: string;
  financialStatus: OrderFinancialStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  currentTotalPrice: Money;
  currentSubtotalPrice: Money;
  currentTotalTax: Money;
  totalShippingPrice: Money;
  shippingAddress: ShopifyAddress | null;
  billingAddress: ShopifyAddress | null;
  lineItems: {
    edges: Array<{ node: OrderLineItem }>;
    pageInfo: PageInfo;
  };
  fulfillments: Fulfillment[];
  statusUrl: string;
  canceledAt: string | null;
  cancelReason: OrderCancelReason | null;
}

export type OrderFinancialStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "PARTIALLY_PAID"
  | "PARTIALLY_REFUNDED"
  | "PAID"
  | "REFUNDED"
  | "VOIDED";

export type OrderFulfillmentStatus =
  | "UNFULFILLED"
  | "PARTIALLY_FULFILLED"
  | "FULFILLED"
  | "RESTOCKED"
  | "PENDING_FULFILLMENT"
  | "OPEN"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "SCHEDULED";

export type OrderCancelReason =
  | "CUSTOMER"
  | "FRAUD"
  | "INVENTORY"
  | "DECLINED"
  | "OTHER";

export interface OrderLineItem {
  title: string;
  quantity: number;
  originalTotalPrice: Money;
  discountedTotalPrice: Money;
  variant: OrderLineItemVariant | null;
}

export interface OrderLineItemVariant {
  id: string;
  title: string;
  image: Image | null;
  price: Money;
  sku: string | null;
  product: {
    id: string;
    handle: string;
    title: string;
  } | null;
}

export interface Fulfillment {
  trackingCompany: string | null;
  trackingInfo: Array<{
    number: string;
    url: string | null;
  }>;
  fulfillmentLineItems: {
    edges: Array<{
      node: {
        lineItem: OrderLineItem;
        quantity: number;
      };
    }>;
  };
}

// ============================================================================
// Mutation Input Types
// ============================================================================

export interface CustomerUpdateInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
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

export interface CustomerUpdateResponse {
  customerUpdate: {
    customer: ShopifyCustomer | null;
    customerUserErrors: CustomerUserError[];
  };
}

export interface CustomerUserError {
  field: string[] | null;
  message: string;
  code: string;
}

export interface AddressCreateResponse {
  customerAddressCreate: {
    customerAddress: ShopifyAddress | null;
    customerUserErrors: CustomerUserError[];
  };
}

export interface AddressUpdateResponse {
  customerAddressUpdate: {
    customerAddress: ShopifyAddress | null;
    customerUserErrors: CustomerUserError[];
  };
}

export interface AddressDeleteResponse {
  customerAddressDelete: {
    deletedCustomerAddressId: string | null;
    customerUserErrors: CustomerUserError[];
  };
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
