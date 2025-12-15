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

// ─────────────────────────────────────────────
// Product Hero - Full product detail section
// ─────────────────────────────────────────────
export const productHero = defineType({
  name: "productHero",
  title: "Product Hero",
  type: "object",
  fields: [
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      description: "Optional badge text (e.g., 'New', 'Sale', 'Bestseller')",
    }),
    defineField({
      name: "productName",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "e.g., '$99.99' or '99.99'",
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare At Price",
      type: "string",
      description: "Original price for showing discounts",
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [
        {
          type: "image",
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: "variants",
      title: "Product Variants",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "id", title: "ID", type: "string" }),
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({
              name: "options",
              title: "Options",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
          preview: {
            select: { title: "name" },
          },
        },
      ],
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
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: "reviewCount",
      title: "Review Count",
      type: "number",
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "ctaText",
      title: "CTA Button Text",
      type: "string",
      initialValue: "Add to Cart",
    }),
    spacingField,
    backgroundColorField,
  ],
  preview: {
    select: { title: "productName" },
    prepare: ({ title }) => ({
      title: title || "Product Hero",
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
      name: "products",
      title: "Products",
      type: "array",
      of: [
        {
          type: "object",
          name: "product",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "slug", title: "Slug", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "price", title: "Price", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "compareAtPrice", title: "Compare At Price", type: "string" }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              fields: [defineField({ name: "alt", title: "Alt", type: "string" })],
              options: { hotspot: true },
            }),
            defineField({ name: "badge", title: "Badge", type: "string" }),
            defineField({ name: "rating", title: "Rating", type: "number", validation: (Rule) => Rule.min(0).max(5) }),
            defineField({ name: "reviewCount", title: "Review Count", type: "number" }),
            defineField({ name: "category", title: "Category", type: "string" }),
          ],
          preview: {
            select: { title: "name", subtitle: "price" },
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
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title || "Product Grid",
      subtitle: "Product Grid Section",
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
      name: "products",
      title: "Products",
      type: "array",
      of: [
        {
          type: "object",
          name: "product",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "slug", title: "Slug", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "price", title: "Price", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "compareAtPrice", title: "Compare At Price", type: "string" }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              fields: [defineField({ name: "alt", title: "Alt", type: "string" })],
              options: { hotspot: true },
            }),
            defineField({ name: "badge", title: "Badge", type: "string" }),
            defineField({ name: "rating", title: "Rating", type: "number", validation: (Rule) => Rule.min(0).max(5) }),
            defineField({ name: "reviewCount", title: "Review Count", type: "number" }),
          ],
          preview: {
            select: { title: "name", subtitle: "price" },
          },
        },
      ],
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
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title || "Product Carousel",
      subtitle: "Product Carousel Section",
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
      name: "badge",
      title: "Badge",
      type: "string",
    }),
    defineField({
      name: "productName",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare At Price",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      options: { hotspot: true },
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
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: "reviewCount",
      title: "Review Count",
      type: "number",
    }),
    defineField({
      name: "ctaText",
      title: "CTA Text",
      type: "string",
      initialValue: "Shop Now",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Link",
      type: "string",
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
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    spacingField,
    backgroundColorField,
  ],
  preview: {
    select: { title: "productName" },
    prepare: ({ title }) => ({
      title: title || "Featured Product",
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
          name: "collection",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "slug", title: "Slug", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              fields: [defineField({ name: "alt", title: "Alt", type: "string" })],
              options: { hotspot: true },
            }),
            defineField({ name: "productCount", title: "Product Count", type: "number" }),
          ],
          preview: {
            select: { title: "name", subtitle: "productCount" },
            prepare: ({ title, subtitle }) => ({
              title,
              subtitle: subtitle ? `${subtitle} products` : undefined,
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
      name: "products",
      title: "Products",
      type: "array",
      of: [
        {
          type: "object",
          name: "product",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "slug", title: "Slug", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "price", title: "Price", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "compareAtPrice", title: "Compare At Price", type: "string" }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              fields: [defineField({ name: "alt", title: "Alt", type: "string" })],
              options: { hotspot: true },
            }),
            defineField({ name: "badge", title: "Badge", type: "string" }),
            defineField({ name: "rating", title: "Rating", type: "number", validation: (Rule) => Rule.min(0).max(5) }),
          ],
          preview: {
            select: { title: "name", subtitle: "price" },
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
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title || "Related Products",
      subtitle: "Related Products Section",
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
