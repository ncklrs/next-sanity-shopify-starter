import { defineField, defineType } from "sanity";

export const shopifyProductVariant = defineType({
  name: "shopifyProductVariant",
  title: "Shopify Product Variant",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "ID",
      type: "number",
      description: "Shopify variant ID",
      readOnly: true,
    }),
    defineField({
      name: "gid",
      title: "Global ID",
      type: "string",
      description: "Shopify GraphQL global ID",
      readOnly: true,
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Variant title from Shopify",
      readOnly: true,
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      description: "Stock keeping unit",
      readOnly: true,
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "object",
      description: "Variant price",
      fields: [
        { name: "amount", type: "string", title: "Amount" },
        { name: "currencyCode", type: "string", title: "Currency Code" },
      ],
      readOnly: true,
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare at Price",
      type: "object",
      description: "Original price for comparison (before discount)",
      fields: [
        { name: "amount", type: "string", title: "Amount" },
        { name: "currencyCode", type: "string", title: "Currency Code" },
      ],
      readOnly: true,
    }),
    defineField({
      name: "inventoryQuantity",
      title: "Inventory Quantity",
      type: "number",
      description: "Available inventory quantity",
      readOnly: true,
    }),
    defineField({
      name: "inventoryPolicy",
      title: "Inventory Policy",
      type: "string",
      description: "Whether to continue selling when out of stock",
      options: {
        list: [
          { title: "Deny", value: "deny" },
          { title: "Continue", value: "continue" },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: "option1",
      title: "Option 1",
      type: "string",
      description: "First option value (e.g., Size)",
      readOnly: true,
    }),
    defineField({
      name: "option2",
      title: "Option 2",
      type: "string",
      description: "Second option value (e.g., Color)",
      readOnly: true,
    }),
    defineField({
      name: "option3",
      title: "Option 3",
      type: "string",
      description: "Third option value",
      readOnly: true,
    }),
    defineField({
      name: "previewImageUrl",
      title: "Preview Image URL",
      type: "string",
      description: "URL of the variant's image",
      readOnly: true,
    }),
  ],
});
