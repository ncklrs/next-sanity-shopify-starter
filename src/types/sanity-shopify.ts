/**
 * TypeScript types for Sanity-synced Shopify data
 *
 * These types represent the data structure after Sanity Connect
 * syncs products and collections from Shopify to Sanity.
 */

// ─────────────────────────────────────────────
// Base Sanity Document Types
// ─────────────────────────────────────────────

export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface SanityReference {
  _type: "reference";
  _ref: string;
}

export interface SanitySlug {
  _type: "slug";
  current: string;
}

export interface SanityImage {
  _type: "image";
  asset: SanityReference;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// ─────────────────────────────────────────────
// Shopify Price Types
// ─────────────────────────────────────────────

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoney;
  maxVariantPrice: ShopifyMoney;
}

// ─────────────────────────────────────────────
// Shopify Product Variant (Synced Object)
// ─────────────────────────────────────────────

export interface ShopifyProductVariantStore {
  id: number;
  gid: string;
  title: string;
  sku?: string;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
  inventoryQuantity?: number;
  inventoryPolicy?: "deny" | "continue";
  availableForSale: boolean;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
  previewImageUrl?: string;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────
// Shopify Product (Synced Object)
// ─────────────────────────────────────────────

export interface ShopifyProductStore {
  id: number;
  gid: string;
  title: string;
  slug: SanitySlug;
  status: "active" | "draft" | "archived";
  descriptionHtml?: string;
  productType?: string;
  vendor?: string;
  tags?: string[];
  priceRange: ShopifyPriceRange;
  options?: Array<{
    name: string;
    values: string[];
  }>;
  variants?: SanityReference[];
  previewImageUrl?: string;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────
// Shopify Collection (Synced Object)
// ─────────────────────────────────────────────

export interface ShopifyCollectionStore {
  id: number;
  gid: string;
  title: string;
  slug: SanitySlug;
  descriptionHtml?: string;
  imageUrl?: string;
  sortOrder?: string;
  rules?: Array<{
    column: string;
    relation: string;
    condition: string;
  }>;
  disjunctive?: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────
// Sanity Document Types (with Shopify data)
// ─────────────────────────────────────────────

export interface SanityProduct extends SanityDocument {
  _type: "product";
  store: ShopifyProductStore;
  body?: unknown[]; // Portable Text
  seo?: {
    title?: string;
    description?: string;
    image?: SanityImage;
  };
}

export interface SanityProductVariant extends SanityDocument {
  _type: "productVariant";
  store: ShopifyProductVariantStore;
  product?: SanityReference;
}

export interface SanityCollection extends SanityDocument {
  _type: "collection";
  store: ShopifyCollectionStore;
  body?: unknown[]; // Portable Text
  seo?: {
    title?: string;
    description?: string;
    image?: SanityImage;
  };
}

// ─────────────────────────────────────────────
// GROQ Query Result Types
// ─────────────────────────────────────────────

/**
 * Product card projection result
 * Used in product grids, carousels, and listings
 */
export interface ProductCard {
  _id: string;
  _type: "product";
  title: string;
  handle: string;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
  image?: string;
  available: boolean;
  tags?: string[];
  productType?: string;
}

/**
 * Product detail projection result
 * Used on product detail pages
 */
export interface ProductDetail {
  _id: string;
  _type: "product";
  title: string;
  handle: string;
  description?: string;
  price: ShopifyPriceRange;
  image?: string;
  available: boolean;
  tags?: string[];
  productType?: string;
  vendor?: string;
  options?: Array<{
    name: string;
    values: string[];
  }>;
  variants?: Array<{
    _id: string;
    title: string;
    sku?: string;
    price: ShopifyMoney;
    compareAtPrice?: ShopifyMoney;
    available: boolean;
    inventory?: number;
    selectedOptions?: Array<{
      name: string;
      value: string;
    }>;
  }>;
  body?: unknown[]; // Portable Text
  seo?: {
    title?: string;
    description?: string;
  };
}

/**
 * Collection card projection result
 * Used in collection grids and navigation
 */
export interface CollectionCard {
  _id: string;
  _type: "collection";
  title: string;
  handle: string;
  description?: string;
  image?: string;
  productCount: number;
}

/**
 * Collection detail projection result
 * Used on collection pages
 */
export interface CollectionDetail {
  _id: string;
  _type: "collection";
  title: string;
  handle: string;
  description?: string;
  image?: string;
  products?: ProductCard[];
  body?: unknown[]; // Portable Text
  seo?: {
    title?: string;
    description?: string;
  };
}

// ─────────────────────────────────────────────
// E-commerce Module Types
// ─────────────────────────────────────────────

/**
 * Product with display overrides (for modules)
 */
export interface ProductWithOverrides {
  product: SanityReference;
  displayOverrides?: {
    badge?: string;
    ctaText?: string;
  };
}

/**
 * Resolved product with overrides (after GROQ expansion)
 */
export interface ResolvedProductWithOverrides {
  product: ProductCard;
  displayOverrides?: {
    badge?: string;
    ctaText?: string;
  };
}

/**
 * Collection with display overrides (for modules)
 */
export interface CollectionWithOverrides {
  collection: SanityReference;
  displayOverrides?: {
    descriptionOverride?: string;
  };
}

/**
 * Resolved collection with overrides (after GROQ expansion)
 */
export interface ResolvedCollectionWithOverrides {
  collection: CollectionCard;
  displayOverrides?: {
    descriptionOverride?: string;
  };
}

// ─────────────────────────────────────────────
// Helper Types
// ─────────────────────────────────────────────

/**
 * Utility type for making specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Utility type for creating a resolved reference type
 */
export type Resolved<T extends { _ref: string }> = Omit<T, "_ref" | "_type"> & {
  _id: string;
};
