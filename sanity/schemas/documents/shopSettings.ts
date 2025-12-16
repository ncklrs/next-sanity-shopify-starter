import { defineField, defineType } from "sanity";

export const shopSettings = defineType({
  name: "shopSettings",
  title: "Shop Settings",
  type: "document",
  groups: [
    { name: "productDisplay", title: "Product Display", default: true },
    { name: "cart", title: "Cart & Checkout" },
    { name: "filters", title: "Filters & Sorting" },
  ],
  fields: [
    // ─────────────────────────────────────────────
    // Product Display Settings
    // ─────────────────────────────────────────────
    defineField({
      name: "showOutOfStockBadge",
      title: "Show Out of Stock Badge",
      type: "boolean",
      group: "productDisplay",
      initialValue: true,
      description: "Display 'Out of Stock' badge on unavailable products in listings",
    }),
    defineField({
      name: "showSaleBadge",
      title: "Show Sale Badge",
      type: "boolean",
      group: "productDisplay",
      initialValue: true,
      description: "Display 'Sale' badge on discounted products",
    }),
    defineField({
      name: "showQuickAdd",
      title: "Show Quick Add to Cart",
      type: "boolean",
      group: "productDisplay",
      initialValue: false,
      description: "Show 'Add to Cart' button overlay on product cards when hovering",
    }),

    // ─────────────────────────────────────────────
    // Cart & Checkout Settings
    // ─────────────────────────────────────────────
    defineField({
      name: "showBuyNowButton",
      title: "Show Buy Now Button",
      type: "boolean",
      group: "cart",
      initialValue: false,
      description: "Display 'Buy Now' button on product pages that skips cart and goes directly to checkout",
    }),
    defineField({
      name: "buyNowButtonText",
      title: "Buy Now Button Text",
      type: "string",
      group: "cart",
      initialValue: "Buy Now",
      hidden: ({ document }) => !document?.showBuyNowButton,
      description: "Custom text for the Buy Now button",
    }),

    // ─────────────────────────────────────────────
    // Filters & Sorting Settings
    // ─────────────────────────────────────────────
    defineField({
      name: "showFilters",
      title: "Show Product Filters",
      type: "boolean",
      group: "filters",
      initialValue: false,
      description: "Enable filtering options on products and collection pages",
    }),
    defineField({
      name: "filterOptions",
      title: "Available Filters",
      type: "array",
      group: "filters",
      hidden: ({ document }) => !document?.showFilters,
      of: [
        {
          type: "string",
          options: {
            list: [
              { title: "Price Range", value: "price" },
              { title: "Availability", value: "availability" },
              { title: "Product Type", value: "productType" },
              { title: "Vendor/Brand", value: "vendor" },
              { title: "Tags", value: "tags" },
            ],
          },
        },
      ],
      initialValue: ["price", "availability"],
      description: "Select which filter options to show",
    }),
    defineField({
      name: "showSorting",
      title: "Show Sorting Options",
      type: "boolean",
      group: "filters",
      initialValue: true,
      description: "Allow customers to sort products",
    }),
    defineField({
      name: "sortOptions",
      title: "Available Sort Options",
      type: "array",
      group: "filters",
      hidden: ({ document }) => !document?.showSorting,
      of: [
        {
          type: "string",
          options: {
            list: [
              { title: "Best Selling", value: "bestSelling" },
              { title: "Price: Low to High", value: "priceAsc" },
              { title: "Price: High to Low", value: "priceDesc" },
              { title: "Newest", value: "newest" },
              { title: "Alphabetical: A-Z", value: "titleAsc" },
              { title: "Alphabetical: Z-A", value: "titleDesc" },
            ],
          },
        },
      ],
      initialValue: ["bestSelling", "priceAsc", "priceDesc", "newest"],
      description: "Select which sorting options to show",
    }),
    defineField({
      name: "defaultSort",
      title: "Default Sort",
      type: "string",
      group: "filters",
      options: {
        list: [
          { title: "Best Selling", value: "bestSelling" },
          { title: "Price: Low to High", value: "priceAsc" },
          { title: "Price: High to Low", value: "priceDesc" },
          { title: "Newest", value: "newest" },
          { title: "Alphabetical: A-Z", value: "titleAsc" },
          { title: "Alphabetical: Z-A", value: "titleDesc" },
        ],
      },
      initialValue: "bestSelling",
      description: "Default sort order for product listings",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Shop Settings",
        subtitle: "Product display, cart & filter options",
      };
    },
  },
});
