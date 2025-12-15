/**
 * Customer Queries
 *
 * Queries for customer data mirrored from Shopify.
 * Customers are synced on login and used for fast reads,
 * custom fields (wishlist, preferences), and server-side access.
 */

/**
 * Get customer by Shopify ID
 * Primary lookup method after OAuth authentication
 */
export const customerByShopifyIdQuery = `*[_type == "customer" && shopifyCustomerId == $shopifyId][0]{
  _id,
  _type,
  shopifyCustomerId,
  email,
  firstName,
  lastName,
  phone,
  acceptsMarketing,
  wishlist,
  recentlyViewed,
  preferences,
  totalOrders,
  totalSpent,
  createdAt,
  lastLoginAt
}`;

/**
 * Get customer by email
 * Useful for pre-login lookups or merging guest data
 */
export const customerByEmailQuery = `*[_type == "customer" && email == $email][0]{
  _id,
  _type,
  shopifyCustomerId,
  email,
  firstName,
  lastName,
  phone,
  acceptsMarketing,
  wishlist,
  recentlyViewed,
  preferences,
  totalOrders,
  totalSpent,
  createdAt,
  lastLoginAt
}`;

/**
 * Get customer's wishlist with product details
 * Joins wishlist handles with Shopify product data
 */
export const customerWishlistQuery = `*[_type == "customer" && shopifyCustomerId == $shopifyId][0]{
  wishlist
}`;

/**
 * Get customer's recently viewed products
 */
export const customerRecentlyViewedQuery = `*[_type == "customer" && shopifyCustomerId == $shopifyId][0]{
  recentlyViewed
}`;

/**
 * Get customer addresses
 * Returns addresses linked to a customer
 */
export const customerAddressesQuery = `*[_type == "customerAddress" && customer._ref == $customerId] | order(isDefault desc) {
  _id,
  _type,
  shopifyAddressId,
  firstName,
  lastName,
  company,
  address1,
  address2,
  city,
  province,
  provinceCode,
  country,
  countryCode,
  zip,
  phone,
  isDefault
}`;

/**
 * Get single address by ID
 */
export const customerAddressByIdQuery = `*[_type == "customerAddress" && _id == $addressId][0]{
  _id,
  _type,
  shopifyAddressId,
  firstName,
  lastName,
  company,
  address1,
  address2,
  city,
  province,
  provinceCode,
  country,
  countryCode,
  zip,
  phone,
  isDefault,
  customer->{
    _id,
    shopifyCustomerId,
    email
  }
}`;

/**
 * Count customers
 * For admin analytics
 */
export const customerCountQuery = `count(*[_type == "customer"])`;

/**
 * Recent customers
 * For admin dashboard
 */
export const recentCustomersQuery = `*[_type == "customer"] | order(lastLoginAt desc) [0...$limit] {
  _id,
  shopifyCustomerId,
  email,
  firstName,
  lastName,
  totalOrders,
  totalSpent,
  lastLoginAt,
  createdAt
}`;

/**
 * Customers with wishlist items
 * For marketing/engagement features
 */
export const customersWithWishlistQuery = `*[_type == "customer" && count(wishlist) > 0] {
  _id,
  email,
  firstName,
  lastName,
  wishlist,
  lastLoginAt
}`;

/**
 * Customer preferences summary
 * For personalization features
 */
export const customerPreferencesQuery = `*[_type == "customer" && shopifyCustomerId == $shopifyId][0]{
  preferences
}`;
