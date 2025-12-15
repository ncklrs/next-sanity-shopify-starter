import { groq } from "next-sanity";

// Product projections for different use cases
const productCardProjection = groq`{
  _id,
  _type,
  "title": store.title,
  "handle": store.slug.current,
  "description": store.description,
  "price": store.priceRange.minVariantPrice,
  "compareAtPrice": store.priceRange.maxVariantPrice,
  "image": store.previewImageUrl,
  "productType": store.productType,
  "vendor": store.vendor,
  "tags": store.tags,
  "available": store.status == "active" && !store.isDeleted,
  "options": store.options
}`;

const productDetailProjection = groq`{
  _id,
  _type,
  "title": store.title,
  "handle": store.slug.current,
  "description": store.description,
  "descriptionHtml": store.descriptionHtml,
  "price": store.priceRange.minVariantPrice,
  "compareAtPrice": store.priceRange.maxVariantPrice,
  "image": store.previewImageUrl,
  "productType": store.productType,
  "vendor": store.vendor,
  "tags": store.tags,
  "available": store.status == "active" && !store.isDeleted,
  "options": store.options,
  "variants": store.variants[]->{
    _id,
    "title": store.title,
    "sku": store.sku,
    "price": store.price,
    "compareAtPrice": store.compareAtPrice,
    "available": store.inventoryQuantity > 0 || store.inventoryPolicy == "continue",
    "image": store.previewImageUrl,
    "options": store.options
  },
  body,
  seo
}`;

// ─────────────────────────────────────────────
// Product Queries
// ─────────────────────────────────────────────

export const allProductsQuery = groq`
  *[_type == "product" && !store.isDeleted && store.status == "active"] | order(store.title asc) ${productCardProjection}
`;

export const productByHandleQuery = groq`
  *[_type == "product" && store.slug.current == $handle][0] ${productDetailProjection}
`;

export const productsByHandlesQuery = groq`
  *[_type == "product" && store.slug.current in $handles && !store.isDeleted] ${productCardProjection}
`;

export const productsByTypeQuery = groq`
  *[_type == "product" && store.productType == $productType && !store.isDeleted && store.status == "active"] ${productCardProjection}
`;

export const productsByTagQuery = groq`
  *[_type == "product" && $tag in store.tags && !store.isDeleted && store.status == "active"] ${productCardProjection}
`;

export const featuredProductsQuery = groq`
  *[_type == "product" && "featured" in store.tags && !store.isDeleted && store.status == "active"][0...8] ${productCardProjection}
`;

export const relatedProductsQuery = groq`
  *[_type == "product" && _id != $currentId && (
    store.productType == $productType ||
    count((store.tags)[@ in $tags]) > 0
  ) && !store.isDeleted && store.status == "active"][0...4] ${productCardProjection}
`;

export const productCountQuery = groq`
  count(*[_type == "product" && !store.isDeleted && store.status == "active"])
`;

export const allProductHandlesQuery = groq`
  *[_type == "product" && !store.isDeleted && store.status == "active"].store.slug.current
`;
