/**
 * Shopify Storefront API GraphQL Queries
 * API Version: 2024-01
 */

import {
  shopifyFetch,
  shopifyFetchStatic,
  shopifyFetchDynamic,
} from "./client";
import type {
  Product,
  Collection,
  Cart,
  ProductsQueryInput,
  CollectionsQueryInput,
  CollectionProductsQueryInput,
  CartLineInput,
  CartLineUpdateInput,
  CartInput,
} from "./types";

// ============================================================================
// GraphQL Fragments
// ============================================================================

const MONEY_FRAGMENT = `
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`;

const IMAGE_FRAGMENT = `
  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
`;

const PRODUCT_VARIANT_FRAGMENT = `
  fragment ProductVariantFragment on ProductVariant {
    id
    title
    availableForSale
    selectedOptions {
      name
      value
    }
    price {
      ...MoneyFragment
    }
    compareAtPrice {
      ...MoneyFragment
    }
    image {
      ...ImageFragment
    }
    sku
  }
`;

const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    priceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
    images(first: 10) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          ...ProductVariantFragment
        }
      }
    }
    featuredImage {
      ...ImageFragment
    }
    seo {
      title
      description
    }
    options {
      id
      name
      values
    }
    createdAt
    updatedAt
  }
`;

const COLLECTION_FRAGMENT = `
  fragment CollectionFragment on Collection {
    id
    handle
    title
    description
    descriptionHtml
    image {
      ...ImageFragment
    }
    seo {
      title
      description
    }
    updatedAt
  }
`;

const CART_LINE_FRAGMENT = `
  fragment CartLineFragment on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        ...ProductVariantFragment
        product {
          id
          handle
          title
          featuredImage {
            ...ImageFragment
          }
        }
      }
    }
    cost {
      totalAmount {
        ...MoneyFragment
      }
      subtotalAmount {
        ...MoneyFragment
      }
      compareAtAmountPerQuantity {
        ...MoneyFragment
      }
    }
    attributes {
      key
      value
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 100) {
      edges {
        node {
          ...CartLineFragment
        }
      }
    }
    cost {
      subtotalAmount {
        ...MoneyFragment
      }
      totalAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
    }
    attributes {
      key
      value
    }
    createdAt
    updatedAt
  }
`;

// ============================================================================
// Product Queries
// ============================================================================

/**
 * Get a list of products with optional filtering and pagination
 */
export async function getProducts(
  input: ProductsQueryInput = {}
): Promise<{
  products: Product[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}> {
  const {
    first = 20,
    last,
    after,
    before,
    query,
    sortKey = "CREATED_AT",
    reverse = false,
  } = input;

  const queryString = `
    ${MONEY_FRAGMENT}
    ${IMAGE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
    ${PRODUCT_FRAGMENT}

    query GetProducts(
      $first: Int
      $last: Int
      $after: String
      $before: String
      $query: String
      $sortKey: ProductSortKey
      $reverse: Boolean
    ) {
      products(
        first: $first
        last: $last
        after: $after
        before: $before
        query: $query
        sortKey: $sortKey
        reverse: $reverse
      ) {
        edges {
          node {
            ...ProductFragment
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
  `;

  const data = await shopifyFetchStatic<{
    products: {
      edges: Array<{ node: Product }>;
      pageInfo: any;
    };
  }>(queryString, {
    first,
    last,
    after,
    before,
    query,
    sortKey,
    reverse,
  });

  return {
    products: data.products.edges.map((edge) => edge.node),
    pageInfo: data.products.pageInfo,
  };
}

/**
 * Get a single product by handle
 */
export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  const query = `
    ${MONEY_FRAGMENT}
    ${IMAGE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
    ${PRODUCT_FRAGMENT}

    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductFragment
      }
    }
  `;

  const data = await shopifyFetchStatic<{ product: Product | null }>(query, {
    handle,
  });

  return data.product;
}

// ============================================================================
// Collection Queries
// ============================================================================

/**
 * Get a list of collections with optional filtering and pagination
 */
export async function getCollections(
  input: CollectionsQueryInput = {}
): Promise<{
  collections: Collection[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}> {
  const {
    first = 20,
    last,
    after,
    before,
    query,
    sortKey = "UPDATED_AT",
    reverse = false,
  } = input;

  const queryString = `
    ${IMAGE_FRAGMENT}
    ${COLLECTION_FRAGMENT}

    query GetCollections(
      $first: Int
      $last: Int
      $after: String
      $before: String
      $query: String
      $sortKey: CollectionSortKey
      $reverse: Boolean
    ) {
      collections(
        first: $first
        last: $last
        after: $after
        before: $before
        query: $query
        sortKey: $sortKey
        reverse: $reverse
      ) {
        edges {
          node {
            ...CollectionFragment
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
  `;

  const data = await shopifyFetchStatic<{
    collections: {
      edges: Array<{ node: Collection }>;
      pageInfo: any;
    };
  }>(queryString, {
    first,
    last,
    after,
    before,
    query,
    sortKey,
    reverse,
  });

  return {
    collections: data.collections.edges.map((edge) => edge.node),
    pageInfo: data.collections.pageInfo,
  };
}

/**
 * Get a single collection by handle with its products
 */
export async function getCollectionByHandle(
  input: CollectionProductsQueryInput
): Promise<Collection | null> {
  const { handle, first = 20, after, sortKey = "BEST_SELLING", reverse = false } =
    input;

  const query = `
    ${MONEY_FRAGMENT}
    ${IMAGE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
    ${PRODUCT_FRAGMENT}
    ${COLLECTION_FRAGMENT}

    query GetCollectionByHandle(
      $handle: String!
      $first: Int
      $after: String
      $sortKey: ProductCollectionSortKeys
      $reverse: Boolean
    ) {
      collection(handle: $handle) {
        ...CollectionFragment
        products(
          first: $first
          after: $after
          sortKey: $sortKey
          reverse: $reverse
        ) {
          edges {
            node {
              ...ProductFragment
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

  const data = await shopifyFetchStatic<{ collection: Collection | null }>(
    query,
    {
      handle,
      first,
      after,
      sortKey,
      reverse,
    }
  );

  return data.collection;
}

// ============================================================================
// Cart Mutations
// ============================================================================

/**
 * Create a new cart
 */
export async function createCart(input: CartInput = {}): Promise<Cart> {
  const mutation = `
    ${MONEY_FRAGMENT}
    ${IMAGE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
    ${CART_LINE_FRAGMENT}
    ${CART_FRAGMENT}

    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetchDynamic<{
    cartCreate: {
      cart: Cart;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(mutation, { input });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(
      `Cart creation failed: ${data.cartCreate.userErrors.map((e) => e.message).join(", ")}`
    );
  }

  return data.cartCreate.cart;
}

/**
 * Add items to an existing cart
 */
export async function addToCart(
  cartId: string,
  lines: CartLineInput[]
): Promise<Cart> {
  const mutation = `
    ${MONEY_FRAGMENT}
    ${IMAGE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
    ${CART_LINE_FRAGMENT}
    ${CART_FRAGMENT}

    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetchDynamic<{
    cartLinesAdd: {
      cart: Cart;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(mutation, { cartId, lines });

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(
      `Add to cart failed: ${data.cartLinesAdd.userErrors.map((e) => e.message).join(", ")}`
    );
  }

  return data.cartLinesAdd.cart;
}

/**
 * Update cart line items
 */
export async function updateCartItem(
  cartId: string,
  lines: CartLineUpdateInput[]
): Promise<Cart> {
  const mutation = `
    ${MONEY_FRAGMENT}
    ${IMAGE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
    ${CART_LINE_FRAGMENT}
    ${CART_FRAGMENT}

    mutation UpdateCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetchDynamic<{
    cartLinesUpdate: {
      cart: Cart;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(mutation, { cartId, lines });

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(
      `Update cart failed: ${data.cartLinesUpdate.userErrors.map((e) => e.message).join(", ")}`
    );
  }

  return data.cartLinesUpdate.cart;
}

/**
 * Remove items from cart
 */
export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const mutation = `
    ${MONEY_FRAGMENT}
    ${IMAGE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
    ${CART_LINE_FRAGMENT}
    ${CART_FRAGMENT}

    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetchDynamic<{
    cartLinesRemove: {
      cart: Cart;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(mutation, { cartId, lineIds });

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(
      `Remove from cart failed: ${data.cartLinesRemove.userErrors.map((e) => e.message).join(", ")}`
    );
  }

  return data.cartLinesRemove.cart;
}

/**
 * Get cart by ID
 */
export async function getCart(cartId: string): Promise<Cart | null> {
  const query = `
    ${MONEY_FRAGMENT}
    ${IMAGE_FRAGMENT}
    ${PRODUCT_VARIANT_FRAGMENT}
    ${CART_LINE_FRAGMENT}
    ${CART_FRAGMENT}

    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFragment
      }
    }
  `;

  const data = await shopifyFetchDynamic<{ cart: Cart | null }>(query, {
    cartId,
  });

  return data.cart;
}
