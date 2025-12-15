import { defineField, defineType } from "sanity";
import { Package } from "lucide-react";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: Package,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "shopify", title: "Shopify" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "store",
      title: "Shopify",
      type: "shopifyProduct",
      description: "Product data synced from Shopify (read-only)",
      group: "shopify",
    }),
    defineField({
      name: "body",
      title: "Editorial Content",
      type: "portableText",
      description: "Additional editorial content for this product",
      group: "content",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      description: "SEO overrides (falls back to Shopify data if not set)",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "store.title",
      status: "store.status",
      isDeleted: "store.isDeleted",
      imageUrl: "store.previewImageUrl",
      price: "store.priceRange.minVariantPrice.amount",
      currencyCode: "store.priceRange.minVariantPrice.currencyCode",
    },
    prepare({ title, status, isDeleted, price, currencyCode }) {
      const statusLabel = isDeleted
        ? "Deleted from Shopify"
        : status === "active"
          ? "Active"
          : status || "Unknown";
      const priceLabel =
        price && currencyCode ? ` • ${currencyCode} ${price}` : "";

      return {
        title: title || "Untitled Product",
        subtitle: `${statusLabel}${priceLabel}`,
        media: Package,
      };
    },
  },
  orderings: [
    {
      title: "Title (A-Z)",
      name: "titleAsc",
      by: [{ field: "store.title", direction: "asc" }],
    },
    {
      title: "Title (Z-A)",
      name: "titleDesc",
      by: [{ field: "store.title", direction: "desc" }],
    },
    {
      title: "Price (Low to High)",
      name: "priceAsc",
      by: [{ field: "store.priceRange.minVariantPrice.amount", direction: "asc" }],
    },
    {
      title: "Price (High to Low)",
      name: "priceDesc",
      by: [{ field: "store.priceRange.minVariantPrice.amount", direction: "desc" }],
    },
  ],
});
