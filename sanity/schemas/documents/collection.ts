import { defineField, defineType } from "sanity";
import { FolderOpen } from "lucide-react";
import ModulePickerInput from "../../components/ModulePickerInput";

export const collection = defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  icon: FolderOpen,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "shopify", title: "Shopify" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "store",
      title: "Shopify",
      type: "shopifyCollection",
      description: "Collection data synced from Shopify (read-only)",
      group: "shopify",
    }),
    defineField({
      name: "body",
      title: "Editorial Content",
      type: "portableText",
      description: "Additional editorial content for this collection",
      group: "content",
    }),
    defineField({
      name: "modules",
      title: "Collection Page Modules",
      type: "array",
      description: "Optional modules to display on this collection page. If empty, the default collection layout will be shown.",
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
        // Media
        { type: "videoEmbed" },
        // Trust
        { type: "awards" },
        { type: "pressMentions" },
        // E-commerce specific
        { type: "productGrid" },
        { type: "productCarousel" },
        { type: "collectionGrid" },
        { type: "featuredProduct" },
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
      isDeleted: "store.isDeleted",
    },
    prepare({ title, isDeleted }) {
      return {
        title: title || "Untitled Collection",
        subtitle: isDeleted ? "Deleted from Shopify" : "Active",
        media: FolderOpen,
      };
    },
  },
});
