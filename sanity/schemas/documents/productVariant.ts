import { defineField, defineType } from "sanity";
import { Layers } from "lucide-react";

export const productVariant = defineType({
  name: "productVariant",
  title: "Product Variant",
  type: "document",
  icon: Layers,
  fields: [
    defineField({
      name: "store",
      title: "Shopify",
      type: "shopifyProductVariant",
      description: "Variant data synced from Shopify (read-only)",
    }),
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      description: "Parent product",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "store.title",
      price: "store.price.amount",
      currencyCode: "store.price.currencyCode",
      productTitle: "product.store.title",
    },
    prepare({ title, price, currencyCode, productTitle }) {
      const priceLabel =
        price && currencyCode ? `${currencyCode} ${price}` : "No price";

      return {
        title: title || "Untitled Variant",
        subtitle: `${productTitle || "No product"} • ${priceLabel}`,
        media: Layers,
      };
    },
  },
});
