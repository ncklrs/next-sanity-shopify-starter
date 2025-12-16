import { defineField, defineType } from "sanity";
import { Package } from "lucide-react";
import ModulePickerInput from "../../components/ModulePickerInput";

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
      name: "hidden",
      title: "Hide from Catalog",
      type: "boolean",
      description: "Hide this product from product listings and collections (product page still accessible via direct URL)",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "body",
      title: "Editorial Content",
      type: "portableText",
      description: "Additional editorial content for this product",
      group: "content",
    }),
    defineField({
      name: "modules",
      title: "Product Page Modules",
      type: "array",
      description: "Optional modules to display on this product page. If empty, the default product layout will be shown.",
      group: "content",
      of: [
        // Hero sections
        { type: "heroDefault" },
        { type: "heroCentered" },
        { type: "heroSplit" },
        { type: "heroMinimal" },
        // Features
        { type: "featuresGrid" },
        { type: "featuresAlternating" },
        { type: "featuresIconCards" },
        // Testimonials
        { type: "testimonialsGrid" },
        { type: "testimonialsCarousel" },
        { type: "testimonialsFeatured" },
        // CTA
        { type: "cta.default" },
        { type: "cta.newsletter" },
        { type: "cta.split" },
        { type: "cta.banner" },
        // FAQ
        { type: "faqAccordion" },
        { type: "faqTwoColumn" },
        { type: "faqSimple" },
        // Gallery
        { type: "galleryGrid" },
        { type: "galleryMasonry" },
        { type: "galleryCarousel" },
        // Content
        { type: "richTextBlock" },
        { type: "quote" },
        { type: "statsCounter" },
        { type: "comparisonTable" },
        // Media
        { type: "videoEmbed" },
        { type: "beforeAfter" },
        // Interactive
        { type: "tabs" },
        { type: "accordion" },
        { type: "steps" },
        // Trust
        { type: "awards" },
        { type: "pressMentions" },
        // E-commerce specific
        { type: "productCarousel" },
        { type: "relatedProducts" },
        { type: "recentlyViewed" },
        { type: "trustBadges" },
        // Utility
        { type: "spacer" },
        { type: "banner" },
        { type: "multiColumn" },
      ],
      components: {
        input: ModulePickerInput,
      },
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
      hidden: "hidden",
      imageUrl: "store.previewImageUrl",
      price: "store.priceRange.minVariantPrice.amount",
      currencyCode: "store.priceRange.minVariantPrice.currencyCode",
    },
    prepare({ title, status, isDeleted, hidden, price, currencyCode }) {
      const statusLabel = isDeleted
        ? "Deleted from Shopify"
        : hidden
          ? "Hidden"
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
