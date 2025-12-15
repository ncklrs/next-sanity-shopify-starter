import { defineField, defineType } from "sanity";
import { FolderOpen } from "lucide-react";

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
