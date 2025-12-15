import { defineField, defineType } from "sanity";

// Shared spacing and backgroundColor fields
const spacingField = defineField({
  name: "spacing",
  title: "Spacing",
  type: "string",
  options: {
    list: [
      { title: "Small", value: "sm" },
      { title: "Medium", value: "md" },
      { title: "Large", value: "lg" },
      { title: "Extra Large", value: "xl" },
    ],
  },
  initialValue: "lg",
});

const backgroundColorField = defineField({
  name: "backgroundColor",
  title: "Background Color",
  type: "string",
  options: {
    list: [
      { title: "Default", value: "default" },
      { title: "White", value: "white" },
      { title: "Gray", value: "gray" },
      { title: "Secondary", value: "secondary" },
      { title: "Tertiary", value: "tertiary" },
    ],
  },
  initialValue: "default",
});

// Shared display overrides for product references
const productDisplayOverrides = {
  type: "object",
  name: "displayOverrides",
  title: "Display Overrides",
  description: "Override how this product appears in this context",
  fields: [
    defineField({
      name: "badge",
      title: "Badge Override",
      type: "string",
      description: "Override the default badge (e.g., 'New', 'Sale', 'Bestseller')",
    }),
    defineField({
      name: "ctaText",
      title: "CTA Text Override",
      type: "string",
      description: "Override the default CTA button text",
    }),
  ],
};

// ─────────────────────────────────────────────
// Product Hero - Full product detail section
// ─────────────────────────────────────────────
export const productHero = defineType({
  name: "productHero",
  title: "Product Hero",
  type: "object",
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      description: "Select a product from Sanity (synced from Shopify)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "badge",
      title: "Badge Override",
      type: "string",
      description: "Optional badge text override (e.g., 'New', 'Sale', 'Bestseller')",
    }),
    defineField({
      name: "trustBadges",
      title: "Trust Badges",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Icon", type: "string" }),
            defineField({ name: "text", title: "Text", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "ctaText",
      title: "CTA Button Text Override",
      type: "string",
      description: "Override the default 'Add to Cart' text",
    }),
    spacingField,
    backgroundColorField,
  ],
  preview: {
    select: { productTitle: "product.store.title" },
    prepare: ({ productTitle }) => ({
      title: productTitle || "Product Hero",
      subtitle: "Product Hero Section",
    }),
  },
});

// ─────────────────────────────────────────────
// Product Grid - Display multiple products
// ─────────────────────────────────────────────
export const productGrid = defineType({
  name: "productGrid",
  title: "Product Grid",
  type: "object",
  fields: [
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "source",
      title: "Product Source",
      type: "string",
      options: {
        list: [
          { title: "Manual Selection", value: "manual" },
          { title: "Collection", value: "collection" },
          { title: "Tag", value: "tag" },
          { title: "Featured Products", value: "featured" },
        ],
      },
      initialValue: "manual",
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        {
          type: "object",
          name: "productWithOverrides",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule) => Rule.required(),
            }),
            productDisplayOverrides,
          ],
          preview: {
            select: {
              title: "product.store.title",
              price: "product.store.priceRange.minVariantPrice.amount",
            },
            prepare: ({ title, price }) => ({
              title: title || "Select a product",
              subtitle: price ? `$${price}` : undefined,
            }),
          },
        },
      ],
      hidden: ({ parent }) => parent?.source !== "manual" && parent?.source !== undefined,
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "reference",
      to: [{ type: "collection" }],
      description: "Display products from this collection",
      hidden: ({ parent }) => parent?.source !== "collection",
    }),
    defineField({
      name: "tag",
      title: "Tag",
      type: "string",
      description: "Display products with this tag",
      hidden: ({ parent }) => parent?.source !== "tag",
    }),
    defineField({
      name: "maxProducts",
      title: "Max Products",
      type: "number",
      description: "Maximum number of products to display (for collection/tag/featured sources)",
      initialValue: 12,
      hidden: ({ parent }) => parent?.source === "manual" || parent?.source === undefined,
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "number",
      options: {
        list: [
          { title: "2 Columns", value: 2 },
          { title: "3 Columns", value: 3 },
          { title: "4 Columns", value: 4 },
        ],
      },
      initialValue: 4,
    }),
    defineField({
      name: "showFilters",
      title: "Show Filters",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "productsPerPage",
      title: "Products Per Page",
      type: "number",
      initialValue: 12,
    }),
    spacingField,
    backgroundColorField,
  ],
  preview: {
    select: { title: "heading", source: "source" },
    prepare: ({ title, source }) => ({
      title: title || "Product Grid",
      subtitle: `Product Grid (${source || "manual"})`,
    }),
  },
});

// ─────────────────────────────────────────────
// Product Carousel - Scrollable product display
// ─────────────────────────────────────────────
export const productCarousel = defineType({
  name: "productCarousel",
  title: "Product Carousel",
  type: "object",
  fields: [
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "source",
      title: "Product Source",
      type: "string",
      options: {
        list: [
          { title: "Manual Selection", value: "manual" },
          { title: "Collection", value: "collection" },
          { title: "Tag", value: "tag" },
          { title: "Featured Products", value: "featured" },
        ],
      },
      initialValue: "manual",
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        {
          type: "object",
          name: "productWithOverrides",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule) => Rule.required(),
            }),
            productDisplayOverrides,
          ],
          preview: {
            select: {
              title: "product.store.title",
              price: "product.store.priceRange.minVariantPrice.amount",
            },
            prepare: ({ title, price }) => ({
              title: title || "Select a product",
              subtitle: price ? `$${price}` : undefined,
            }),
          },
        },
      ],
      hidden: ({ parent }) => parent?.source !== "manual" && parent?.source !== undefined,
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "reference",
      to: [{ type: "collection" }],
      description: "Display products from this collection",
      hidden: ({ parent }) => parent?.source !== "collection",
    }),
    defineField({
      name: "tag",
      title: "Tag",
      type: "string",
      description: "Display products with this tag",
      hidden: ({ parent }) => parent?.source !== "tag",
    }),
    defineField({
      name: "maxProducts",
      title: "Max Products",
      type: "number",
      description: "Maximum number of products to display (for collection/tag/featured sources)",
      initialValue: 8,
      hidden: ({ parent }) => parent?.source === "manual" || parent?.source === undefined,
    }),
    defineField({
      name: "autoplay",
      title: "Autoplay",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "autoplayInterval",
      title: "Autoplay Interval (ms)",
      type: "number",
      initialValue: 5000,
      hidden: ({ parent }) => !parent?.autoplay,
    }),
    spacingField,
    backgroundColorField,
  ],
  preview: {
    select: { title: "heading", source: "source" },
    prepare: ({ title, source }) => ({
      title: title || "Product Carousel",
      subtitle: `Product Carousel (${source || "manual"})`,
    }),
  },
});

// ─────────────────────────────────────────────
// Featured Product - Highlight a single product
// ─────────────────────────────────────────────
export const featuredProduct = defineType({
  name: "featuredProduct",
  title: "Featured Product",
  type: "object",
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      description: "Select a product from Sanity (synced from Shopify)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "badge",
      title: "Badge Override",
      type: "string",
      description: "Override badge text for this placement",
    }),
    defineField({
      name: "descriptionOverride",
      title: "Description Override",
      type: "text",
      rows: 3,
      description: "Override the product description for this placement",
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Icon", type: "string" }),
            defineField({ name: "text", title: "Text", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "ctaText",
      title: "CTA Text Override",
      type: "string",
      description: "Override the default 'Shop Now' text",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Link Override",
      type: "string",
      description: "Override the default product link",
    }),
    defineField({
      name: "imagePosition",
      title: "Image Position",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
      },
      initialValue: "right",
    }),
    spacingField,
    backgroundColorField,
  ],
  preview: {
    select: { productTitle: "product.store.title" },
    prepare: ({ productTitle }) => ({
      title: productTitle || "Featured Product",
      subtitle: "Featured Product Section",
    }),
  },
});

// ─────────────────────────────────────────────
// Collection Grid - Display product collections
// ─────────────────────────────────────────────
export const collectionGrid = defineType({
  name: "collectionGrid",
  title: "Collection Grid",
  type: "object",
  fields: [
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "collections",
      title: "Collections",
      type: "array",
      of: [
        {
          type: "object",
          name: "collectionWithOverrides",
          fields: [
            defineField({
              name: "collection",
              title: "Collection",
              type: "reference",
              to: [{ type: "collection" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "displayOverrides",
              title: "Display Overrides",
              type: "object",
              fields: [
                defineField({
                  name: "descriptionOverride",
                  title: "Description Override",
                  type: "text",
                  rows: 2,
                  description: "Override the collection description for this placement",
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "collection.store.title",
            },
            prepare: ({ title }) => ({
              title: title || "Select a collection",
            }),
          },
        },
      ],
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "number",
      options: {
        list: [
          { title: "2 Columns", value: 2 },
          { title: "3 Columns", value: 3 },
          { title: "4 Columns", value: 4 },
        ],
      },
      initialValue: 3,
    }),
    spacingField,
    backgroundColorField,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title || "Collection Grid",
      subtitle: "Collection Grid Section",
    }),
  },
});

// ─────────────────────────────────────────────
// Related Products - Show related items
// ─────────────────────────────────────────────
export const relatedProducts = defineType({
  name: "relatedProducts",
  title: "Related Products",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "You May Also Like",
    }),
    defineField({
      name: "source",
      title: "Product Source",
      type: "string",
      options: {
        list: [
          { title: "Manual Selection", value: "manual" },
          { title: "Same Collection", value: "sameCollection" },
          { title: "Same Tags", value: "sameTags" },
        ],
      },
      initialValue: "manual",
      description: "'Same Collection' and 'Same Tags' require the product context",
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        {
          type: "object",
          name: "productWithOverrides",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule) => Rule.required(),
            }),
            productDisplayOverrides,
          ],
          preview: {
            select: {
              title: "product.store.title",
              price: "product.store.priceRange.minVariantPrice.amount",
            },
            prepare: ({ title, price }) => ({
              title: title || "Select a product",
              subtitle: price ? `$${price}` : undefined,
            }),
          },
        },
      ],
      hidden: ({ parent }) => parent?.source !== "manual" && parent?.source !== undefined,
    }),
    defineField({
      name: "maxProducts",
      title: "Max Products",
      type: "number",
      description: "Maximum number of related products to display",
      initialValue: 4,
      hidden: ({ parent }) => parent?.source === "manual" || parent?.source === undefined,
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Carousel", value: "carousel" },
          { title: "Grid", value: "grid" },
        ],
      },
      initialValue: "carousel",
    }),
    spacingField,
    backgroundColorField,
  ],
  preview: {
    select: { title: "heading", source: "source" },
    prepare: ({ title, source }) => ({
      title: title || "Related Products",
      subtitle: `Related Products (${source || "manual"})`,
    }),
  },
});

// ─────────────────────────────────────────────
// Recently Viewed - User's recently viewed products
// ─────────────────────────────────────────────
export const recentlyViewed = defineType({
  name: "recentlyViewed",
  title: "Recently Viewed",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Recently Viewed",
    }),
    defineField({
      name: "maxItems",
      title: "Max Items to Display",
      type: "number",
      initialValue: 8,
      validation: (Rule) => Rule.min(1).max(20),
    }),
    defineField({
      name: "storageKey",
      title: "Storage Key",
      type: "string",
      description: "localStorage key for storing recently viewed items",
      initialValue: "recently-viewed",
    }),
    spacingField,
    backgroundColorField,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title || "Recently Viewed",
      subtitle: "Recently Viewed Section",
    }),
  },
});

// ─────────────────────────────────────────────
// Trust Badges - Display trust signals
// ─────────────────────────────────────────────
export const trustBadges = defineType({
  name: "trustBadges",
  title: "Trust Badges",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "badges",
      title: "Badges",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Icon", type: "string" }),
            defineField({ name: "text", title: "Text", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Description", type: "string" }),
          ],
          preview: {
            select: { title: "text", subtitle: "description" },
          },
        },
      ],
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Horizontal", value: "horizontal" },
          { title: "Grid", value: "grid" },
        ],
      },
      initialValue: "horizontal",
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Minimal", value: "minimal" },
          { title: "Detailed", value: "detailed" },
        ],
      },
      initialValue: "default",
    }),
    spacingField,
    backgroundColorField,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title || "Trust Badges",
      subtitle: "Trust Badges Section",
    }),
  },
});
