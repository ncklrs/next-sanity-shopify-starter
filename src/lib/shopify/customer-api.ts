/**
 * Shopify Customer Account API Client
 *
 * GraphQL queries and mutations for customer data:
 * - Profile management
 * - Order history
 * - Address book
 */

import { customerApiRequest } from "./customer-auth";
import type {
  ShopifyCustomer,
  ShopifyOrder,
  ShopifyAddress,
  CustomerUpdateInput,
  AddressInput,
  CustomerQueryResponse,
} from "./customer-types";

// ============================================================================
// Customer Queries
// ============================================================================

// Customer Account API has different fields than Admin/Storefront APIs
const CUSTOMER_FRAGMENT = `
  fragment CustomerFields on Customer {
    id
    emailAddress {
      emailAddress
    }
    firstName
    lastName
    displayName
    phoneNumber {
      phoneNumber
    }
  }
`;

// Customer Account API address fields
// Note: CustomerAddress uses different field names than MailingAddress
const ADDRESS_FRAGMENT = `
  fragment AddressFields on CustomerAddress {
    id
    firstName
    lastName
    company
    address1
    address2
    city
    zoneCode
    zip
    phoneNumber
    formatted
  }
`;

// Customer Account API Order fragment
// Note: Field names differ significantly from Storefront/Admin APIs
const ORDER_FRAGMENT = `
  fragment OrderFields on Order {
    id
    name
    number
    processedAt
    financialStatus
    fulfillments(first: 10) {
      edges {
        node {
          id
          status
          createdAt
          updatedAt
          latestShipmentStatus
          estimatedDeliveryAt
          trackingInformation {
            company
            number
            url
          }
        }
      }
    }
    totalPrice {
      amount
      currencyCode
    }
    subtotal {
      amount
      currencyCode
    }
    totalTax {
      amount
      currencyCode
    }
    totalShipping {
      amount
      currencyCode
    }
    lineItems(first: 50) {
      edges {
        node {
          id
          title
          quantity
          price {
            amount
            currencyCode
          }
          totalPrice {
            amount
            currencyCode
          }
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    shippingAddress {
      ...AddressFields
    }
    billingAddress {
      ...AddressFields
    }
  }
  ${ADDRESS_FRAGMENT}
`;

// ============================================================================
// Get Customer Profile
// ============================================================================

const GET_CUSTOMER_QUERY = `
  ${CUSTOMER_FRAGMENT}
  ${ADDRESS_FRAGMENT}

  query GetCustomer {
    customer {
      ...CustomerFields
      defaultAddress {
        ...AddressFields
      }
      addresses(first: 10) {
        edges {
          node {
            ...AddressFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export async function getCustomer(
  accessToken: string
): Promise<ShopifyCustomer | null> {
  const data = await customerApiRequest<CustomerQueryResponse>(
    accessToken,
    GET_CUSTOMER_QUERY
  );
  return data.customer;
}

// ============================================================================
// Update Customer Profile
// ============================================================================

const UPDATE_CUSTOMER_MUTATION = `
  ${CUSTOMER_FRAGMENT}

  mutation UpdateCustomer($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      customer {
        ...CustomerFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function updateCustomer(
  accessToken: string,
  input: CustomerUpdateInput
): Promise<ShopifyCustomer | null> {
  const data = await customerApiRequest<{
    customerUpdate: {
      customer: ShopifyCustomer | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(accessToken, UPDATE_CUSTOMER_MUTATION, { input });

  if (data.customerUpdate.userErrors.length > 0) {
    const error = data.customerUpdate.userErrors[0];
    throw new Error(`Customer update failed: ${error.message}`);
  }

  return data.customerUpdate.customer;
}

// ============================================================================
// Get Orders
// ============================================================================

const GET_ORDERS_QUERY = `
  ${ORDER_FRAGMENT}

  query GetOrders($first: Int!, $after: String) {
    customer {
      orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            ...OrderFields
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

export async function getOrders(
  accessToken: string,
  first: number = 10,
  after?: string
): Promise<{
  orders: ShopifyOrder[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const data = await customerApiRequest<{
    customer: {
      orders: {
        edges: Array<{ node: ShopifyOrder }>;
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    };
  }>(accessToken, GET_ORDERS_QUERY, { first, after });

  return {
    orders: data.customer.orders.edges.map((edge) => edge.node),
    pageInfo: data.customer.orders.pageInfo,
  };
}

// ============================================================================
// Get Single Order
// ============================================================================

const GET_ORDER_QUERY = `
  ${ORDER_FRAGMENT}

  query GetOrder($id: ID!) {
    node(id: $id) {
      ... on Order {
        ...OrderFields
      }
    }
  }
`;

export async function getOrder(
  accessToken: string,
  orderId: string
): Promise<ShopifyOrder | null> {
  const data = await customerApiRequest<{ node: ShopifyOrder | null }>(
    accessToken,
    GET_ORDER_QUERY,
    { id: orderId }
  );
  return data.node;
}

// ============================================================================
// Get Addresses
// ============================================================================

const GET_ADDRESSES_QUERY = `
  ${ADDRESS_FRAGMENT}

  query GetAddresses($first: Int!) {
    customer {
      defaultAddress {
        id
      }
      addresses(first: $first) {
        edges {
          node {
            ...AddressFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export async function getAddresses(
  accessToken: string,
  first: number = 20
): Promise<{
  addresses: ShopifyAddress[];
  defaultAddressId: string | null;
}> {
  const data = await customerApiRequest<{
    customer: {
      defaultAddress: { id: string } | null;
      addresses: {
        edges: Array<{ node: ShopifyAddress }>;
      };
    };
  }>(accessToken, GET_ADDRESSES_QUERY, { first });

  return {
    addresses: data.customer.addresses.edges.map((edge) => edge.node),
    defaultAddressId: data.customer.defaultAddress?.id || null,
  };
}

// ============================================================================
// Create Address
// ============================================================================

const CREATE_ADDRESS_MUTATION = `
  ${ADDRESS_FRAGMENT}

  mutation CreateAddress($address: CustomerAddressInput!) {
    customerAddressCreate(address: $address) {
      customerAddress {
        ...AddressFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function createAddress(
  accessToken: string,
  address: AddressInput
): Promise<ShopifyAddress> {
  const data = await customerApiRequest<{
    customerAddressCreate: {
      customerAddress: ShopifyAddress | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(accessToken, CREATE_ADDRESS_MUTATION, { address });

  if (data.customerAddressCreate.userErrors.length > 0) {
    const error = data.customerAddressCreate.userErrors[0];
    throw new Error(`Address creation failed: ${error.message}`);
  }

  if (!data.customerAddressCreate.customerAddress) {
    throw new Error("Address creation failed: No address returned");
  }

  return data.customerAddressCreate.customerAddress;
}

// ============================================================================
// Update Address
// ============================================================================

const UPDATE_ADDRESS_MUTATION = `
  ${ADDRESS_FRAGMENT}

  mutation UpdateAddress($id: ID!, $address: CustomerAddressInput!) {
    customerAddressUpdate(id: $id, address: $address) {
      customerAddress {
        ...AddressFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function updateAddress(
  accessToken: string,
  addressId: string,
  address: AddressInput
): Promise<ShopifyAddress> {
  const data = await customerApiRequest<{
    customerAddressUpdate: {
      customerAddress: ShopifyAddress | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(accessToken, UPDATE_ADDRESS_MUTATION, { id: addressId, address });

  if (data.customerAddressUpdate.userErrors.length > 0) {
    const error = data.customerAddressUpdate.userErrors[0];
    throw new Error(`Address update failed: ${error.message}`);
  }

  if (!data.customerAddressUpdate.customerAddress) {
    throw new Error("Address update failed: No address returned");
  }

  return data.customerAddressUpdate.customerAddress;
}

// ============================================================================
// Delete Address
// ============================================================================

const DELETE_ADDRESS_MUTATION = `
  mutation DeleteAddress($id: ID!) {
    customerAddressDelete(id: $id) {
      deletedCustomerAddressId
      userErrors {
        field
        message
      }
    }
  }
`;

export async function deleteAddress(
  accessToken: string,
  addressId: string
): Promise<string> {
  const data = await customerApiRequest<{
    customerAddressDelete: {
      deletedCustomerAddressId: string | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(accessToken, DELETE_ADDRESS_MUTATION, { id: addressId });

  if (data.customerAddressDelete.userErrors.length > 0) {
    const error = data.customerAddressDelete.userErrors[0];
    throw new Error(`Address deletion failed: ${error.message}`);
  }

  if (!data.customerAddressDelete.deletedCustomerAddressId) {
    throw new Error("Address deletion failed: No address ID returned");
  }

  return data.customerAddressDelete.deletedCustomerAddressId;
}

// ============================================================================
// Set Default Address
// ============================================================================

const SET_DEFAULT_ADDRESS_MUTATION = `
  ${ADDRESS_FRAGMENT}

  mutation SetDefaultAddress($id: ID!) {
    customerDefaultAddressUpdate(addressId: $id) {
      customer {
        defaultAddress {
          ...AddressFields
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function setDefaultAddress(
  accessToken: string,
  addressId: string
): Promise<ShopifyAddress | null> {
  const data = await customerApiRequest<{
    customerDefaultAddressUpdate: {
      customer: { defaultAddress: ShopifyAddress | null };
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(accessToken, SET_DEFAULT_ADDRESS_MUTATION, { id: addressId });

  if (data.customerDefaultAddressUpdate.userErrors.length > 0) {
    const error = data.customerDefaultAddressUpdate.userErrors[0];
    throw new Error(`Set default address failed: ${error.message}`);
  }

  return data.customerDefaultAddressUpdate.customer.defaultAddress;
}
