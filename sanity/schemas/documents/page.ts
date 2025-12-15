import { defineField, defineType } from "sanity";
import ModulePickerInput from "../../components/ModulePickerInput";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
      group: "content",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
      group: "content",
    }),
    defineField({
      name: "modules",
      title: "Page Modules",
      type: "array",
      group: "content",
      of: [
        // Hero sections
        { type: "heroDefault" },
        { type: "heroCentered" },
        { type: "heroSplit" },
        { type: "heroVideo" },
        { type: "heroMinimal" },
        // Features
        { type: "featuresGrid" },
        { type: "featuresAlternating" },
        { type: "featuresIconCards" },
        // Pricing
        { type: "pricingCards" },
        { type: "pricingComparison" },
        { type: "pricingSimple" },
        // Testimonials
        { type: "testimonialsGrid" },
        { type: "testimonialsCarousel" },
        { type: "testimonialsFeatured" },
        { type: "testimonialsCarouselLarge" },
        // Team
        { type: "teamGrid" },
        { type: "teamCards" },
        { type: "teamCompact" },
        // CTA
        { type: "cta.default" },
        { type: "cta.newsletter" },
        { type: "cta.split" },
        { type: "cta.banner" },
        { type: "cta.stats" },
        // Social Proof
        { type: "socialProof.logos" },
        { type: "socialProof.stats" },
        // Logo Cloud
        { type: "logoCloudSimple" },
        { type: "logoCloudMarquee" },
        { type: "logoCloudGrid" },
        // FAQ
        { type: "faqAccordion" },
        { type: "faqTwoColumn" },
        { type: "faqWithCategories" },
        { type: "faqSimple" },
        // Gallery
        { type: "galleryGrid" },
        { type: "galleryMasonry" },
        { type: "galleryCarousel" },
        // Blog Feature
        { type: "blogFeaturedPost" },
        { type: "blogGrid" },
        { type: "blogList" },
        { type: "blogCarousel" },
        { type: "blogMinimal" },
        // Form
        { type: "formContact" },
        { type: "formNewsletter" },
        { type: "formWithImage" },
        { type: "formMultiStep" },
        { type: "formDynamic" },
        // Engagement
        { type: "announcementBar" },
        { type: "countdown" },
        { type: "stickyCta" },
        { type: "modal" },
        // Trust
        { type: "awards" },
        { type: "pressMentions" },
        { type: "caseStudyCards" },
        { type: "integrationGrid" },
        // Content
        { type: "richTextBlock" },
        { type: "quote" },
        { type: "statsCounter" },
        { type: "comparisonTable" },
        // Media
        { type: "videoEmbed" },
        { type: "beforeAfter" },
        { type: "codeBlock" },
        { type: "embedBlock" },
        // Interactive
        { type: "tabs" },
        { type: "accordion" },
        { type: "steps" },
        { type: "timeline" },
        // Utility
        { type: "spacer" },
        { type: "anchorPoint" },
        { type: "banner" },
        { type: "downloadCards" },
        { type: "multiColumn" },
        // E-commerce
        { type: "productHero" },
        { type: "productGrid" },
        { type: "productCarousel" },
        { type: "featuredProduct" },
        { type: "collectionGrid" },
        { type: "relatedProducts" },
        { type: "recentlyViewed" },
        { type: "trustBadges" },
      ],
      components: {
        input: ModulePickerInput,
      },
    }),
    // SEO object with title, description, ogImage, noIndex
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: slug ? `/${slug}` : "No slug",
      };
    },
  },
});
