import { groq } from "next-sanity";

// Collection projections
const collectionCardProjection = groq`{
  _id,
  _type,
  "title": store.title,
  "handle": store.slug.current,
  "description": store.description,
  "image": store.imageUrl,
  "productCount": count(*[_type == "product" && references(^._id)])
}`;

const collectionDetailProjection = groq`{
  _id,
  _type,
  "title": store.title,
  "handle": store.slug.current,
  "description": store.description,
  "descriptionHtml": store.descriptionHtml,
  "image": store.imageUrl,
  "products": *[_type == "product" && references(^._id) && !store.isDeleted && store.status == "active"] {
    _id,
    "title": store.title,
    "handle": store.slug.current,
    "price": store.priceRange.minVariantPrice,
    "image": store.previewImageUrl,
    "available": store.status == "active"
  },
  body,
  seo
}`;

// ─────────────────────────────────────────────
// Collection Queries
// ─────────────────────────────────────────────

export const allCollectionsQuery = groq`
  *[_type == "collection" && !store.isDeleted] | order(store.title asc) ${collectionCardProjection}
`;

export const collectionByHandleQuery = groq`
  *[_type == "collection" && store.slug.current == $handle][0] ${collectionDetailProjection}
`;

export const allCollectionHandlesQuery = groq`
  *[_type == "collection" && !store.isDeleted].store.slug.current
`;
