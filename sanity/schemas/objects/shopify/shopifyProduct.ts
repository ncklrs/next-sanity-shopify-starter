import { defineField, defineType } from "sanity";

export const shopifyProduct = defineType({
  name: "shopifyProduct",
  title: "Shopify Product",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "ID",
      type: "number",
      description: "Shopify product ID",
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
      description: "Product title from Shopify",
      readOnly: true,
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly handle from Shopify",
      readOnly: true,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Plain text description from Shopify",
      readOnly: true,
    }),
    defineField({
      name: "descriptionHtml",
      title: "Description HTML",
      type: "text",
      description: "HTML description from Shopify",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Product status in Shopify",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Draft", value: "draft" },
          { title: "Archived", value: "archived" },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: "priceRange",
      title: "Price Range",
      type: "object",
      description: "Price range for product variants",
      readOnly: true,
      fields: [
        defineField({
          name: "minVariantPrice",
          title: "Min Variant Price",
          type: "object",
          fields: [
            { name: "amount", type: "string", title: "Amount" },
            { name: "currencyCode", type: "string", title: "Currency Code" },
          ],
        }),
        defineField({
          name: "maxVariantPrice",
          title: "Max Variant Price",
          type: "object",
          fields: [
            { name: "amount", type: "string", title: "Amount" },
            { name: "currencyCode", type: "string", title: "Currency Code" },
          ],
        }),
      ],
    }),
    defineField({
      name: "productType",
      title: "Product Type",
      type: "string",
      description: "Product type from Shopify",
      readOnly: true,
    }),
    defineField({
      name: "vendor",
      title: "Vendor",
      type: "string",
      description: "Product vendor from Shopify",
      readOnly: true,
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      description: "Product tags from Shopify",
      of: [{ type: "string" }],
      readOnly: true,
    }),
    defineField({
      name: "options",
      title: "Options",
      type: "array",
      description: "Product options (e.g., Size, Color)",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Option Name" },
            {
              name: "values",
              type: "array",
              title: "Option Values",
              of: [{ type: "string" }],
            },
          ],
        },
      ],
      readOnly: true,
    }),
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      description: "Product variants",
      of: [{ type: "reference", to: [{ type: "productVariant" }] }],
      readOnly: true,
    }),
    defineField({
      name: "previewImageUrl",
      title: "Preview Image URL",
      type: "string",
      description: "URL of the product's featured image",
      readOnly: true,
    }),
    defineField({
      name: "isDeleted",
      title: "Is Deleted",
      type: "boolean",
      description: "Whether this product has been deleted from Shopify",
      readOnly: true,
      initialValue: false,
    }),
  ],
});
