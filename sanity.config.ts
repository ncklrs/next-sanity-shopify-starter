"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import type { StructureResolver } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { media } from "sanity-plugin-media";
import { assist } from "@sanity/assist";
import { CogIcon, DocumentsIcon, ControlsIcon, BellIcon, BasketIcon } from "@sanity/icons";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

// Singleton document types that should not show as lists
const singletonTypes = new Set(["siteSettings", "shopSettings"]);

// Document types managed manually in structure (excluded from auto-generation)
const structuredTypes = new Set([
  ...singletonTypes,
  "page",
  "post",
  "form",
  "formSubmission",
  "subscriber",
  "engagement",
  "media.tag",
  "sanity.assist.schemaType.annotations",
  "assist.instruction.context",
]);

// Structure resolver for custom studio layout
const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Content
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("post").title("Posts"),

      // Engagement
      S.documentTypeListItem("engagement")
        .title("Engagement")
        .icon(BellIcon),

      // Forms group
      S.listItem()
        .title("Forms")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Forms")
            .items([
              S.documentTypeListItem("form").title("Form Templates"),
              S.documentTypeListItem("formSubmission").title("Submissions"),
              S.documentTypeListItem("subscriber").title("Subscribers"),
            ])
        ),

      S.divider(),

      // Config group
      S.listItem()
        .title("Config")
        .icon(ControlsIcon)
        .child(
          S.list()
            .title("Config")
            .items([
              S.documentTypeListItem("media.tag").title("Media Tags"),
              S.documentTypeListItem("sanity.assist.schemaType.annotations").title("AI Schema Instructions"),
              S.documentTypeListItem("assist.instruction.context").title("AI Context Documents"),
            ])
        ),

      // Site Settings singleton
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),

      // Shop Settings singleton
      S.listItem()
        .title("Shop Settings")
        .id("shopSettings")
        .icon(BasketIcon)
        .child(
          S.document()
            .schemaType("shopSettings")
            .documentId("shopSettings")
        ),

      S.divider(),

      // Any remaining document types not explicitly structured
      ...S.documentTypeListItems().filter(
        (listItem) => !structuredTypes.has(listItem.getId() ?? "")
      ),
    ]);

export default defineConfig({
  name: "default",
  title: "Next Sanity Embedded Starter",

  projectId,
  dataset,

  basePath: "/studio",

  plugins: [
    structureTool({ structure }),
    unsplashImageAsset(),
    media({
      creditLine: {
        enabled: true,
        excludeSources: ["unsplash"],
      },
      maximumUploadSize: 10000000, // 10MB
    }),
    assist(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Prevent actions on singleton documents
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) =>
            action && ["publish", "discardChanges", "restore"].includes(action)
          )
        : input,
  },
});
