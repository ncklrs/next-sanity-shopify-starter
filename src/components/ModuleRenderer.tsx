"use client";

import { useMemo, useCallback } from "react";
import { urlFor } from "@/lib/sanity";
import { useCart } from "@/contexts/CartContext";
import { ModuleErrorBoundary } from "./ModuleErrorBoundary";
import { HeroDefault, HeroCentered, HeroSplit, HeroVideo, HeroMinimal } from "./modules/Hero";
import { FeaturesGrid, FeaturesAlternating, FeaturesIconCards } from "./modules/Features";
import { PricingCards, PricingComparison, PricingSimple } from "./modules/Pricing";
import { TestimonialsGrid, TestimonialsCarousel, TestimonialsFeatured, TestimonialsCarouselLarge } from "./modules/Testimonials";
import { TeamGrid, TeamCards, TeamCompact } from "./modules/Team";
import { CTADefault, CTANewsletter, CTASplit, CTABanner, CTAStats } from "./modules/CTA";
import { SocialProofLogos, SocialProofStats } from "./modules/SocialProof";
import { LogoCloudSimple, LogoCloudMarquee, LogoCloudGrid } from "./modules/LogoCloud";
import { FAQAccordion, FAQTwoColumn, FAQWithCategories, FAQSimple } from "./modules/FAQ";
import { GalleryGrid, GalleryMasonry, GalleryCarousel } from "./modules/Gallery";
import { BlogFeaturedPost, BlogGrid, BlogList, BlogCarousel, BlogMinimal } from "./modules/BlogFeature";
import { FormContact, FormNewsletter, FormWithImage, FormMultiStep, FormDynamic } from "./modules/Form";
import { RichTextBlock, Quote, StatsCounter, ComparisonTable } from "./modules/Content";
import { VideoEmbed, BeforeAfter, CodeBlock, EmbedBlock } from "./modules/Media";
import { Tabs, Accordion, Steps, Timeline } from "./modules/Interactive";
import { AnnouncementBar, Countdown, StickyCta, Modal } from "./modules/Engagement";
import { Awards, PressMentions, CaseStudyCards, IntegrationGrid } from "./modules/Trust";
import { Spacer, AnchorPoint, Banner, DownloadCards, MultiColumn } from "./modules/Utility";
import {
  ProductHero,
  ProductGrid,
  ProductCarousel,
  FeaturedProduct,
  CollectionGrid,
  RelatedProducts,
  RecentlyViewed,
  TrustBadges,
} from "./modules/Ecommerce";
import { AccountLogin } from "./modules/Account";

/**
 * Convert a Sanity image object to URL-based format.
 * Handles both:
 * - Unexpanded references: { asset: { _ref: "image-..." } }
 * - Expanded assets: { asset: { _id: "...", url: "https://..." } }
 */
function sanityImageToUrl(image: any): { src: string; alt: string; width: number; height: number } | undefined {
  if (!image?.asset) return undefined;

  // Handle expanded asset with direct URL
  if (image.asset.url) {
    return {
      src: image.asset.url,
      alt: image.alt || "",
      width: image.asset.metadata?.dimensions?.width || 1200,
      height: image.asset.metadata?.dimensions?.height || 800,
    };
  }

  // Handle unexpanded reference
  if (image.asset._ref) {
    return {
      src: urlFor(image).width(1200).url(),
      alt: image.alt || "",
      width: 1200,
      height: 800,
    };
  }

  return undefined;
}

/**
 * Keys that should NOT be recursively transformed (contain non-image data)
 */
const SKIP_TRANSFORM_KEYS = new Set([
  'values', 'featureValues', 'content', 'rows', 'columns',
  'options', 'fields', 'steps', 'categories', '_type', '_key', '_ref',
  'tabs', 'items', 'events' // Interactive module arrays
]);

/**
 * Check if an object is a Sanity image.
 * Handles both unexpanded refs and expanded assets.
 */
function isSanityImage(data: any): boolean {
  if (!data || typeof data !== 'object' || !data.asset) return false;
  // Unexpanded: has _ref
  if (data.asset._ref) return true;
  // Expanded: has url
  if (data.asset.url) return true;
  return false;
}

/**
 * Transform Sanity image references to URL-based image objects.
 * Handles both unexpanded refs and expanded assets with URLs.
 */
function transformSanityImages(data: any, key?: string): any {
  if (!data) return data;

  // Skip transformation for certain keys that contain non-image data
  if (key && SKIP_TRANSFORM_KEYS.has(key)) {
    return data;
  }

  // Check if this is a Sanity image object
  if (isSanityImage(data)) {
    // Handle expanded asset with direct URL
    if (data.asset.url) {
      return {
        src: data.asset.url,
        alt: data.alt || "",
        width: data.asset.metadata?.dimensions?.width || 1200,
        height: data.asset.metadata?.dimensions?.height || 800,
      };
    }
    // Handle unexpanded reference
    return {
      src: urlFor(data).width(1200).url(),
      alt: data.alt || "",
      width: 1200,
      height: 800,
    };
  }

  // If it's an array, transform each item (but check if items are images first)
  if (Array.isArray(data)) {
    return data.map((item) => transformSanityImages(item));
  }

  // If it's an object, transform each property selectively
  if (typeof data === "object") {
    const transformed: Record<string, any> = {};
    for (const objKey of Object.keys(data)) {
      transformed[objKey] = transformSanityImages(data[objKey], objKey);
    }
    return transformed;
  }

  return data;
}

/**
 * Module-specific transformers that map Sanity field names to component props.
 * Each transformer receives the raw Sanity data and returns component-ready props.
 */
const moduleTransformers: Record<string, (data: any) => any> = {
  heroVideo: (data) => {
    // Handle both expanded (asset.url) and unexpanded (asset._ref) poster images
    let posterUrl: string | undefined;
    if (data.videoPoster?.asset?.url) {
      posterUrl = data.videoPoster.asset.url;
    } else if (data.videoPoster?.asset?._ref) {
      posterUrl = urlFor(data.videoPoster).width(1920).url();
    }
    return {
      ...data,
      headingGradientText: data.headingHighlight,
      video: {
        src: data.videoUrl || "",
        poster: posterUrl,
        autoplay: true,
        loop: true,
        muted: true,
      },
      overlayOpacity: data.overlay ?? 0.6,
    };
  },
  heroSplit: (data) => ({
    ...data,
    headingGradientText: data.headingHighlight,
    primaryCTA: data.buttons?.[0] ? {
      label: data.buttons[0].text,
      href: data.buttons[0].link,
      variant: data.buttons[0].variant || "primary",
    } : undefined,
    secondaryCTA: data.buttons?.[1] ? {
      label: data.buttons[1].text,
      href: data.buttons[1].link,
      variant: data.buttons[1].variant || "secondary",
    } : undefined,
    image: sanityImageToUrl(data.image) || { src: "", alt: "" },
  }),
  heroCentered: (data) => ({
    ...data,
    headingGradientText: data.headingHighlight,
    primaryCTA: data.buttons?.[0] ? {
      label: data.buttons[0].text,
      href: data.buttons[0].link,
      variant: data.buttons[0].variant || "primary",
    } : undefined,
    secondaryCTA: data.buttons?.[1] ? {
      label: data.buttons[1].text,
      href: data.buttons[1].link,
      variant: data.buttons[1].variant || "secondary",
    } : undefined,
    trustedBy: data.trustedByText ? {
      text: data.trustedByText,
      companies: (data.trustedByLogos || []).map((logo: any) => {
        // Handle both expanded (asset.url) and unexpanded (asset._ref) images
        let src = "";
        if (logo.asset?.url) {
          src = logo.asset.url;
        } else if (logo.asset?._ref) {
          src = urlFor(logo).width(120).url();
        }
        return {
          src,
          alt: logo.alt || logo.companyName || "",
          width: 120,
          height: 40,
        };
      }),
    } : undefined,
  }),
  heroDefault: (data) => ({
    ...data,
    headingGradientText: data.headingHighlight,
    primaryCTA: data.buttons?.[0] ? {
      label: data.buttons[0].text,
      href: data.buttons[0].link,
      variant: data.buttons[0].variant || "primary",
    } : undefined,
    secondaryCTA: data.buttons?.[1] ? {
      label: data.buttons[1].text,
      href: data.buttons[1].link,
      variant: data.buttons[1].variant || "secondary",
    } : undefined,
  }),
  heroMinimal: (data) => ({
    ...data,
    headingGradientText: data.headingHighlight,
    primaryCTA: data.buttons?.[0] ? {
      label: data.buttons[0].text,
      href: data.buttons[0].link,
      variant: data.buttons[0].variant || "primary",
    } : undefined,
  }),
  comparisonTable: (data) => ({
    ...data,
    title: data.title || data.heading,
    subtitle: data.subtitle || data.subheading,
    columns: (data.columns || []).map((col: any) => ({
      ...col,
      title: col.title || col.header || col.name,
    })),
    rows: (data.rows || []).map((row: any) => ({
      feature: row.feature || row.name,
      tooltip: row.tooltip,
      // Parse string "true"/"false" to boolean, keep other values as-is
      values: (row.values || []).map((v: any) => {
        if (typeof v === 'string') {
          if (v.toLowerCase() === 'true') return true;
          if (v.toLowerCase() === 'false') return false;
        }
        return v;
      }),
    })),
  }),
  // Transform banner link field names
  banner: (data) => ({
    ...data,
    link: data.link ? {
      label: data.link.text,
      href: data.link.url,
    } : undefined,
  }),
  // Transform pricingCards plans
  pricingCards: (data) => ({
    ...data,
    heading: data.heading,
    subheading: data.subheading,
    plans: (data.plans || []).map((plan: any) => ({
      name: plan.name,
      price: plan.price,
      period: plan.period || plan.priceUnit,
      description: plan.description || '',
      features: (plan.features || []).map((f: any) =>
        typeof f === 'string' ? { text: f, available: true } : f
      ),
      ctaText: plan.buttonText,
      ctaVariant: plan.buttonVariant,
      isPopular: plan.popular || plan.highlighted,
    })),
  }),
  // Transform pricingSimple - wrap plan data in plan object
  pricingSimple: (data) => ({
    ...data,
    heading: data.heading,
    subheading: data.subheading,
    plan: {
      name: data.heading || 'Plan', // Use heading as plan name fallback
      price: data.price,
      period: data.priceUnit,
      description: data.subheading || '',
      features: (data.features || []).map((f: any) =>
        typeof f === 'string' ? { text: f, available: true } : f
      ),
      ctaText: data.buttonText,
    },
    note: data.note,
  }),
  // Transform pricingComparison
  pricingComparison: (data) => {
    const plans = (data.plans || []).map((plan: any) => ({
      name: plan.name,
      price: plan.price,
      period: plan.priceUnit,
      description: plan.description || '',
      features: [],
      ctaText: plan.button?.text || plan.buttonText,
      isPopular: plan.highlighted,
    }));

    // Transform features array to ComparisonFeature format
    // Sanity stores values as feature.values[planIndex]
    const features = (data.features || []).map((feature: any) => {
      const planValues: Record<string, boolean | string | number> = {};
      plans.forEach((plan: any, planIndex: number) => {
        // Get value from feature.values array (Sanity format)
        // or fall back to plan.featureValues (alternate format)
        const featureValue = feature.values?.[planIndex]
          ?? (data.plans || [])[planIndex]?.featureValues?.[(data.features || []).indexOf(feature)]
          ?? false;

        // Parse string booleans
        if (featureValue === 'true') planValues[plan.name] = true;
        else if (featureValue === 'false') planValues[plan.name] = false;
        else planValues[plan.name] = featureValue;
      });
      return {
        name: typeof feature === 'string' ? feature : feature.name,
        plans: planValues,
      };
    });

    return {
      ...data,
      heading: data.heading,
      subheading: data.subheading,
      plans,
      features,
    };
  },
  // Transform tabs - map title to label
  tabs: (data) => ({
    ...data,
    title: data.heading,
    subtitle: data.subheading,
    tabs: (data.tabs || []).map((tab: any) => ({
      ...tab,
      label: tab.label || tab.title,
    })),
  }),
  // Transform accordion - map heading fields
  accordion: (data) => ({
    ...data,
    title: data.heading,
    subtitle: data.subheading,
    items: data.items || [],
  }),
  // Transform steps - map heading fields
  steps: (data) => ({
    ...data,
    title: data.heading,
    subtitle: data.subheading,
    steps: data.steps || [],
  }),
  // Transform timeline - map heading fields and items to events
  timeline: (data) => ({
    ...data,
    title: data.heading,
    subtitle: data.subheading,
    events: data.items || data.events || [],
  }),
  // Transform formContact - flatten form reference and convert field options
  formContact: (data) => {
    // Transform Sanity field format to component format
    const transformField = (field: any) => ({
      name: field.name,
      label: field.label,
      type: field.type,
      placeholder: field.placeholder,
      required: field.required,
      rows: field.rows,
      // Convert options from [{label, value}] to string[] for select fields
      options: field.options?.map((opt: any) => opt.value || opt.label || opt) || undefined,
      // Pass through width for layout (half/full)
      width: field.width,
    });

    return {
      ...data,
      heading: data.heading || data.form?.name,
      description: data.subheading,
      fields: (data.form?.fields || []).map(transformField),
      submitText: data.form?.settings?.submitButtonText || 'Send Message',
      successMessage: data.form?.settings?.successMessage,
    };
  },
  // Transform formNewsletter - flatten form reference
  formNewsletter: (data) => ({
    ...data,
    heading: data.heading || data.form?.name,
    description: data.subheading,
    placeholder: data.form?.fields?.[0]?.placeholder || 'Enter your email',
    buttonText: data.form?.settings?.submitButtonText || 'Subscribe',
    privacyText: data.note,
  }),
  // Transform formWithImage - flatten form reference, convert field options, and resolve image URL
  formWithImage: (data) => {
    // Transform Sanity field format to component format
    const transformField = (field: any) => ({
      name: field.name,
      label: field.label,
      type: field.type,
      placeholder: field.placeholder,
      required: field.required,
      rows: field.rows,
      options: field.options?.map((opt: any) => opt.value || opt.label || opt) || undefined,
      width: field.width,
    });

    // Resolve image URL from Sanity image object
    let imageUrl: string | undefined;
    if (data.image?.asset?.url) {
      imageUrl = data.image.asset.url;
    } else if (data.image?.asset?._ref) {
      imageUrl = urlFor(data.image).width(800).url();
    }

    return {
      ...data,
      heading: data.heading || data.form?.name,
      description: data.subheading,
      image: imageUrl,
      fields: (data.form?.fields || []).map(transformField),
      submitText: data.form?.settings?.submitButtonText || 'Send Message',
      successMessage: data.form?.settings?.successMessage,
    };
  },
  // Transform formMultiStep - convert field options in each step
  formMultiStep: (data) => {
    // Transform Sanity field format to component format
    const transformField = (field: any) => ({
      name: field.name,
      label: field.label,
      type: field.type,
      placeholder: field.placeholder,
      required: field.required,
      rows: field.rows,
      options: field.options?.map((opt: any) => opt.value || opt.label || opt) || undefined,
      width: field.width,
    });

    return {
      ...data,
      steps: (data.steps || []).map((step: any) => ({
        title: step.title,
        description: step.description,
        fields: (step.fields || []).map(transformField),
      })),
    };
  },
  // Transform cta.default - map buttons array fields
  "cta.default": (data) => ({
    ...data,
    headingGradient: data.headingHighlight,
    buttons: (data.buttons || []).map((btn: any) => ({
      label: btn.text,
      href: btn.link,
      variant: btn.variant || "primary",
    })),
  }),
  // Transform cta.newsletter - map field names to component props
  "cta.newsletter": (data) => ({
    ...data,
    headingGradient: data.headingHighlight,
    inputPlaceholder: data.placeholder || "Enter your email",
    buttonLabel: data.buttonText || "Subscribe",
    privacyNote: data.note,
  }),
  // Transform cta.split - map buttons array fields
  "cta.split": (data) => ({
    ...data,
    headingGradient: data.headingHighlight,
    buttons: (data.buttons || []).map((btn: any) => ({
      label: btn.text,
      href: btn.link,
      variant: btn.variant || "primary",
    })),
    image: sanityImageToUrl(data.image) || { src: "", alt: "" },
  }),
  // Transform cta.banner - map field names
  "cta.banner": (data) => ({
    ...data,
    text: data.heading, // Component uses both heading and text
    button: data.button ? {
      label: data.button.text,
      href: data.button.link,
      variant: data.button.variant || "primary",
    } : undefined,
    background: data.backgroundStyle || "gradient",
    backgroundImage: data.backgroundImage?.asset?.url,
  }),
  // Transform cta.stats - map buttons array fields
  "cta.stats": (data) => ({
    ...data,
    headingGradient: data.headingHighlight,
    buttons: (data.buttons || []).map((btn: any) => ({
      label: btn.text,
      href: btn.link,
      variant: btn.variant || "primary",
    })),
    stats: data.stats || [],
  }),

  // ─────────────────────────────────────────────
  // Engagement Module Transformers
  // ─────────────────────────────────────────────

  // Transform announcementBar - don't pass backgroundColor (component handles variants)
  announcementBar: (data) => {
    const { backgroundColor, ...rest } = data;
    return {
      ...rest,
      // Don't pass backgroundColor as CSS value - component uses variant for styling
    };
  },

  // Transform countdown - handle both legacy cta format and new button format
  countdown: (data) => {
    // Handle legacy cta format or new button format
    const ctaData = data.cta || data.button;
    return {
      ...data,
      cta: ctaData ? {
        text: ctaData.text,
        url: ctaData.url || ctaData.link, // Handle both url and link field names
        variant: ctaData.variant || "primary",
      } : undefined,
    };
  },

  // Transform stickyCta - pass through (fields already match)
  stickyCta: (data) => ({
    ...data,
  }),

  // Transform modal - map button to cta, content stays as portable text for now
  modal: (data) => {
    // Handle legacy cta format or new button format
    const ctaData = data.cta || data.button;
    return {
      ...data,
      cta: ctaData ? {
        text: ctaData.text,
        url: ctaData.url || ctaData.link,
        variant: ctaData.variant || "primary",
      } : undefined,
      // Content is portable text array - will be rendered in Modal component
    };
  },

  // ─────────────────────────────────────────────
  // Logo Cloud & Social Proof Transformers
  // ─────────────────────────────────────────────

  // Transform logoCloudSimple - map nested image structure to component format
  logoCloudSimple: (data) => ({
    ...data,
    logos: (data.logos || []).map((logo: any) => {
      let src = "";
      if (logo.asset?.url) {
        src = logo.asset.url;
      } else if (logo.asset?._ref) {
        src = urlFor(logo).width(200).url();
      }
      return {
        src,
        alt: logo.name || "",
        href: logo.link,
      };
    }),
  }),

  logoCloudMarquee: (data) => ({
    ...data,
    logos: (data.logos || []).map((logo: any) => {
      let src = "";
      if (logo.asset?.url) {
        src = logo.asset.url;
      } else if (logo.asset?._ref) {
        src = urlFor(logo).width(200).url();
      }
      return {
        src,
        alt: logo.name || "",
        href: logo.link,
      };
    }),
  }),

  logoCloudGrid: (data) => ({
    ...data,
    logos: (data.logos || []).map((logo: any) => {
      let src = "";
      if (logo.asset?.url) {
        src = logo.asset.url;
      } else if (logo.asset?._ref) {
        src = urlFor(logo).width(200).url();
      }
      return {
        src,
        alt: logo.name || "",
        href: logo.link,
      };
    }),
  }),

  // Transform socialProof.logos - map nested image structure to component format
  "socialProof.logos": (data) => ({
    ...data,
    logos: (data.logos || []).map((logo: any) => {
      let image = "";
      if (logo.asset?.url) {
        image = logo.asset.url;
      } else if (logo.asset?._ref) {
        image = urlFor(logo).width(200).url();
      }
      return {
        name: logo.name || "",
        image,
      };
    }),
  }),

  // ─────────────────────────────────────────────
  // Gallery Module Transformers
  // ─────────────────────────────────────────────

  // Shared gallery image transformer
  galleryGrid: (data) => {
    const spacingMap: Record<string, "sm" | "md" | "lg"> = {
      small: "sm",
      medium: "md",
      large: "lg",
    };
    return {
      ...data,
      description: data.subheading,
      spacing: spacingMap[data.spacing] || "md",
      images: (data.images || []).map((img: any) => {
        let src = "";
        if (img.asset?.url) {
          src = img.asset.url;
        } else if (img.asset?._ref) {
          src = urlFor(img).width(1200).url();
        }
        return {
          id: img._key || img.asset?._ref || Math.random().toString(36),
          src,
          alt: img.alt || "",
          title: img.caption,
          size: img.size,
        };
      }),
    };
  },

  galleryMasonry: (data) => {
    const spacingMap: Record<string, "sm" | "md" | "lg"> = {
      small: "sm",
      medium: "md",
      large: "lg",
    };
    return {
      ...data,
      description: data.subheading,
      spacing: spacingMap[data.spacing] || "md",
      images: (data.images || []).map((img: any) => {
        let src = "";
        if (img.asset?.url) {
          src = img.asset.url;
        } else if (img.asset?._ref) {
          src = urlFor(img).width(1200).url();
        }
        return {
          id: img._key || img.asset?._ref || Math.random().toString(36),
          src,
          alt: img.alt || "",
          title: img.caption,
          size: img.size,
        };
      }),
    };
  },

  galleryCarousel: (data) => {
    const spacingMap: Record<string, "sm" | "md" | "lg"> = {
      small: "sm",
      medium: "md",
      large: "lg",
    };
    return {
      ...data,
      description: data.subheading,
      spacing: spacingMap[data.spacing] || "md",
      images: (data.images || []).map((img: any) => {
        let src = "";
        if (img.asset?.url) {
          src = img.asset.url;
        } else if (img.asset?._ref) {
          src = urlFor(img).width(1600).url();
        }
        return {
          id: img._key || img.asset?._ref || Math.random().toString(36),
          src,
          alt: img.alt || "",
          title: img.caption,
          size: img.size,
        };
      }),
    };
  },

  // ─────────────────────────────────────────────
  // Testimonials Module Transformers
  // ─────────────────────────────────────────────

  // Helper to transform a single testimonial from Sanity flat format to component nested format
  testimonialsGrid: (data) => {
    const transformTestimonial = (t: any) => {
      let avatarUrl = "";
      if (t.avatar?.asset?.url) {
        avatarUrl = t.avatar.asset.url;
      } else if (t.avatar?.asset?._ref) {
        avatarUrl = urlFor(t.avatar).width(96).height(96).url();
      }
      return {
        _key: t._key,
        content: t.content,
        rating: t.rating ?? 5,
        author: {
          name: t.author,
          role: t.role || "",
          company: t.company,
          avatar: avatarUrl || undefined,
        },
        companyLogo: t.companyLogo?.asset?.url || (t.companyLogo?.asset?._ref ? urlFor(t.companyLogo).width(120).url() : undefined),
      };
    };

    return {
      ...data,
      title: data.heading,
      subtitle: data.subheading,
      testimonials: (data.testimonials || []).map(transformTestimonial),
    };
  },

  testimonialsCarousel: (data) => {
    const transformTestimonial = (t: any) => {
      let avatarUrl = "";
      if (t.avatar?.asset?.url) {
        avatarUrl = t.avatar.asset.url;
      } else if (t.avatar?.asset?._ref) {
        avatarUrl = urlFor(t.avatar).width(96).height(96).url();
      }
      return {
        _key: t._key,
        content: t.content,
        rating: t.rating ?? 5,
        author: {
          name: t.author,
          role: t.role || "",
          company: t.company,
          avatar: avatarUrl || undefined,
        },
        companyLogo: t.companyLogo?.asset?.url || (t.companyLogo?.asset?._ref ? urlFor(t.companyLogo).width(120).url() : undefined),
      };
    };

    return {
      ...data,
      title: data.heading,
      subtitle: data.subheading,
      testimonials: (data.testimonials || []).map(transformTestimonial),
    };
  },

  testimonialsFeatured: (data) => {
    const transformTestimonial = (t: any) => {
      let avatarUrl = "";
      if (t.avatar?.asset?.url) {
        avatarUrl = t.avatar.asset.url;
      } else if (t.avatar?.asset?._ref) {
        avatarUrl = urlFor(t.avatar).width(96).height(96).url();
      }
      return {
        _key: t._key,
        content: t.content,
        rating: t.rating ?? 5,
        author: {
          name: t.author,
          role: t.role || "",
          company: t.company,
          avatar: avatarUrl || undefined,
        },
        companyLogo: t.logo?.asset?.url || (t.logo?.asset?._ref ? urlFor(t.logo).width(120).url() : undefined),
      };
    };

    return {
      ...data,
      title: data.heading,
      subtitle: data.subheading,
      featured: data.featured ? transformTestimonial(data.featured) : undefined,
      supporting: (data.supporting || []).map(transformTestimonial),
    };
  },

  testimonialsCarouselLarge: (data) => {
    const transformTestimonial = (t: any) => {
      let avatarUrl = "";
      if (t.avatar?.asset?.url) {
        avatarUrl = t.avatar.asset.url;
      } else if (t.avatar?.asset?._ref) {
        avatarUrl = urlFor(t.avatar).width(128).height(128).url();
      }
      return {
        _key: t._key,
        content: t.content,
        rating: t.rating ?? 5,
        author: {
          name: t.author,
          role: t.role || "",
          company: t.company,
          avatar: avatarUrl || undefined,
        },
        companyLogo: t.companyLogo?.asset?.url || (t.companyLogo?.asset?._ref ? urlFor(t.companyLogo).width(160).url() : undefined),
      };
    };

    return {
      ...data,
      title: data.heading || "",
      subtitle: data.subheading,
      testimonials: (data.testimonials || []).map(transformTestimonial),
    };
  },

  // Blog Feature module transformers
  blogFeaturedPost: (data) => ({
    ...data,
    // Map Sanity post data to component's BlogPost interface
    post: data.post ? {
      _id: data.post._id,
      title: data.post.title,
      slug: data.post.slug,
      excerpt: data.post.excerpt,
      featuredImage: data.post.featuredImage?.asset?.url ||
        (data.post.featuredImage?.asset?._ref ? urlFor(data.post.featuredImage).width(1200).url() : undefined),
      publishedAt: data.post.publishedAt,
      author: data.post.author,
      category: data.post.category,
      readingTime: data.post.readingTime,
    } : undefined,
  }),

  blogGrid: (data) => {
    const limit = data.postsToShow || 6;
    const allPosts = data.posts || [];
    const limitedPosts = allPosts.slice(0, limit);

    return {
      ...data,
      heading: data.heading,
      description: data.subheading,
      columns: data.columns || 3,
      showHeader: !!(data.heading || data.subheading),
      posts: limitedPosts.map((post: any) => ({
        _id: post._id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage?.asset?.url ||
          (post.featuredImage?.asset?._ref ? urlFor(post.featuredImage).width(800).url() : undefined),
        publishedAt: post.publishedAt,
        author: post.author,
        category: post.category,
        readingTime: post.readingTime,
      })),
    };
  },

  blogList: (data) => {
    const limit = data.postsToShow || 5;
    const allPosts = data.posts || [];
    const limitedPosts = allPosts.slice(0, limit);

    return {
      ...data,
      heading: data.heading,
      description: data.subheading,
      showHeader: !!(data.heading || data.subheading),
      posts: limitedPosts.map((post: any) => ({
        _id: post._id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage?.asset?.url ||
          (post.featuredImage?.asset?._ref ? urlFor(post.featuredImage).width(600).url() : undefined),
        publishedAt: post.publishedAt,
        author: post.author,
        category: post.category,
        readingTime: post.readingTime,
      })),
    };
  },

  blogCarousel: (data) => {
    const limit = data.postsToShow || 8;
    const allPosts = data.posts || [];
    const limitedPosts = allPosts.slice(0, limit);

    return {
      ...data,
      heading: data.heading,
      description: data.subheading,
      showHeader: !!(data.heading || data.subheading),
      autoPlay: data.autoplay,
      posts: limitedPosts.map((post: any) => ({
        _id: post._id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage?.asset?.url ||
          (post.featuredImage?.asset?._ref ? urlFor(post.featuredImage).width(700).url() : undefined),
        publishedAt: post.publishedAt,
        author: post.author,
        category: post.category,
        readingTime: post.readingTime,
      })),
    };
  },

  blogMinimal: (data) => {
    const limit = data.postsToShow || 3;
    const allPosts = data.posts || [];
    const limitedPosts = allPosts.slice(0, limit);

    return {
      ...data,
      heading: data.heading,
      viewAllLink: data.viewAllLink || "/blog",
      viewAllText: "View All Posts",
      posts: limitedPosts.map((post: any) => ({
        _id: post._id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage?.asset?.url ||
          (post.featuredImage?.asset?._ref ? urlFor(post.featuredImage).width(200).url() : undefined),
        publishedAt: post.publishedAt,
        author: post.author,
        category: post.category,
        readingTime: post.readingTime,
      })),
    };
  },

  // ─────────────────────────────────────────────
  // E-commerce Module Transformers
  // ─────────────────────────────────────────────

  productHero: (data) => ({
    ...data,
    // Images come pre-transformed from GROQ with src/alt, filter out invalid ones
    images: (data.images || [])
      .filter((img: any) => img?.src)
      .map((img: any) => ({
        src: img.src,
        alt: img.alt || data.productName || "",
        width: 800,
        height: 800,
      })),
    // Ensure variants have options array (can be null from Shopify)
    variants: (data.variants || [])
      .filter((v: any) => v?.name)
      .map((v: any) => ({
        id: v.id || v.name,
        name: v.name,
        options: v.options || [],
      })),
  }),

  productGrid: (data) => ({
    ...data,
    products: (data.products || []).map((p: any) => ({
      _id: p._key || p.slug,
      name: p.name,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      // Image comes pre-transformed from GROQ with {src, alt}
      image: p.image?.src ? { src: p.image.src, alt: p.image.alt || p.name } : undefined,
      badge: p.badge,
      rating: p.rating,
      reviewCount: p.reviewCount,
      category: p.category,
      availableForSale: p.availableForSale,
      // Shopify variant ID for add-to-cart functionality
      firstVariantId: p.firstVariantId,
    })),
  }),

  productCarousel: (data) => ({
    ...data,
    products: (data.products || []).map((p: any) => ({
      _id: p._key || p.slug,
      name: p.name,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      // Image comes pre-transformed from GROQ with {src, alt}
      image: p.image?.src ? { src: p.image.src, alt: p.image.alt || p.name } : undefined,
      badge: p.badge,
      rating: p.rating,
      reviewCount: p.reviewCount,
      availableForSale: p.availableForSale,
      // Shopify variant ID for add-to-cart functionality
      firstVariantId: p.firstVariantId,
    })),
  }),

  featuredProduct: (data) => ({
    ...data,
    // Image comes pre-transformed from GROQ with {src, alt}
    image: data.image?.src
      ? { src: data.image.src, alt: data.image.alt || data.productName, width: 800, height: 800 }
      : undefined,
  }),

  collectionGrid: (data) => ({
    ...data,
    collections: (data.collections || []).map((c: any) => ({
      _id: c._key || c.slug,
      name: c.name,
      slug: c.slug,
      description: c.description,
      // Image comes pre-transformed from GROQ with {src, alt}
      image: c.image?.src ? { src: c.image.src, alt: c.image.alt || c.name } : undefined,
      productCount: c.productCount,
    })),
  }),

  relatedProducts: (data) => ({
    ...data,
    products: (data.products || []).map((p: any) => ({
      _id: p._key || p.slug,
      name: p.name,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      // Image comes pre-transformed from GROQ with {src, alt}
      image: p.image?.src ? { src: p.image.src, alt: p.image.alt || p.name } : undefined,
      badge: p.badge,
      rating: p.rating,
      availableForSale: p.availableForSale,
      // Shopify variant ID for add-to-cart functionality
      firstVariantId: p.firstVariantId,
    })),
  }),

  // recentlyViewed and trustBadges don't need transformation - props match

  // ─────────────────────────────────────────────
  // Account Module Transformers
  // ─────────────────────────────────────────────

  "account.login": (data) => ({
    ...data,
    image: data.image?.asset?.url
      ? { src: data.image.asset.url, alt: data.image.alt || "Login illustration" }
      : data.image?.asset?._ref
      ? { src: urlFor(data.image).width(800).url(), alt: data.image.alt || "Login illustration" }
      : undefined,
  }),
};

/**
 * Apply module-specific transformation, then generic image transformation
 */
function transformModuleData(module: any): any {
  const transformer = moduleTransformers[module._type];
  const transformed = transformer ? transformer(module) : module;
  return transformSanityImages(transformed);
}

// Map of module type names to components
const moduleComponents: Record<string, React.ComponentType<any>> = {
  // Hero
  heroDefault: HeroDefault,
  heroCentered: HeroCentered,
  heroSplit: HeroSplit,
  heroVideo: HeroVideo,
  heroMinimal: HeroMinimal,
  // Features
  featuresGrid: FeaturesGrid,
  featuresAlternating: FeaturesAlternating,
  featuresIconCards: FeaturesIconCards,
  // Pricing
  pricingCards: PricingCards,
  pricingComparison: PricingComparison,
  pricingSimple: PricingSimple,
  // Testimonials
  testimonialsGrid: TestimonialsGrid,
  testimonialsCarousel: TestimonialsCarousel,
  testimonialsFeatured: TestimonialsFeatured,
  testimonialsCarouselLarge: TestimonialsCarouselLarge,
  // Team
  teamGrid: TeamGrid,
  teamCards: TeamCards,
  teamCompact: TeamCompact,
  // CTA (dot notation - actual Sanity schema names)
  "cta.default": CTADefault,
  "cta.newsletter": CTANewsletter,
  "cta.split": CTASplit,
  "cta.banner": CTABanner,
  "cta.stats": CTAStats,
  // Social Proof (dot notation - actual Sanity schema names)
  "socialProof.logos": SocialProofLogos,
  "socialProof.stats": SocialProofStats,
  // Logo Cloud
  logoCloudSimple: LogoCloudSimple,
  logoCloudMarquee: LogoCloudMarquee,
  logoCloudGrid: LogoCloudGrid,
  // FAQ
  faqAccordion: FAQAccordion,
  faqTwoColumn: FAQTwoColumn,
  faqWithCategories: FAQWithCategories,
  faqSimple: FAQSimple,
  // Gallery
  galleryGrid: GalleryGrid,
  galleryMasonry: GalleryMasonry,
  galleryCarousel: GalleryCarousel,
  // Blog Feature
  blogFeaturedPost: BlogFeaturedPost,
  blogGrid: BlogGrid,
  blogList: BlogList,
  blogCarousel: BlogCarousel,
  blogMinimal: BlogMinimal,
  // Form
  formContact: FormContact,
  formNewsletter: FormNewsletter,
  formWithImage: FormWithImage,
  formMultiStep: FormMultiStep,
  formDynamic: FormDynamic,
  // Content
  richTextBlock: RichTextBlock,
  quote: Quote,
  statsCounter: StatsCounter,
  comparisonTable: ComparisonTable,
  // Media
  videoEmbed: VideoEmbed,
  beforeAfter: BeforeAfter,
  codeBlock: CodeBlock,
  embedBlock: EmbedBlock,
  // Interactive
  tabs: Tabs,
  accordion: Accordion,
  steps: Steps,
  timeline: Timeline,
  // Engagement
  announcementBar: AnnouncementBar,
  countdown: Countdown,
  stickyCta: StickyCta,
  modal: Modal,
  // Trust
  awards: Awards,
  pressMentions: PressMentions,
  caseStudyCards: CaseStudyCards,
  integrationGrid: IntegrationGrid,
  // Utility
  spacer: Spacer,
  anchorPoint: AnchorPoint,
  banner: Banner,
  downloadCards: DownloadCards,
  multiColumn: MultiColumn,
  // E-commerce
  productHero: ProductHero,
  productGrid: ProductGrid,
  productCarousel: ProductCarousel,
  featuredProduct: FeaturedProduct,
  collectionGrid: CollectionGrid,
  relatedProducts: RelatedProducts,
  recentlyViewed: RecentlyViewed,
  trustBadges: TrustBadges,
  // Account
  "account.login": AccountLogin,
};

interface Module {
  _type: string;
  _key: string;
  [key: string]: any;
}

interface ModuleRendererProps {
  modules: Module[];
}

// E-commerce module types that support add to cart functionality
const ECOMMERCE_MODULES_WITH_CART = new Set([
  "productGrid",
  "productCarousel",
  "relatedProducts",
]);

export function ModuleRenderer({ modules }: ModuleRendererProps) {
  const { addItem } = useCart();

  // Handler for add to cart - receives the Shopify variant ID
  const handleAddToCart = useCallback(
    async (variantId: string) => {
      if (!variantId) {
        console.warn("Cannot add to cart: no variant ID provided");
        return;
      }
      try {
        await addItem(variantId, 1);
      } catch (error) {
        console.error("Failed to add item to cart:", error);
      }
    },
    [addItem]
  );

  // Memoize transformed modules to prevent re-computation on every render
  const transformedModules = useMemo(() => {
    if (!modules || modules.length === 0) return [];
    return modules.map((module) => ({
      _key: module._key,
      _type: module._type,
      data: transformModuleData(module),
    }));
  }, [modules]);

  if (transformedModules.length === 0) {
    return null;
  }

  return (
    <>
      {transformedModules.map(({ _key, _type, data }) => {
        const Component = moduleComponents[_type];

        if (!Component) {
          console.warn(`Unknown module type: ${_type}`);
          return null;
        }

        // Add onAddToCart handler to ecommerce modules
        const props = ECOMMERCE_MODULES_WITH_CART.has(_type)
          ? { ...data, onAddToCart: handleAddToCart }
          : data;

        // Wrap each module in error boundary for graceful degradation
        return (
          <ModuleErrorBoundary key={_key} moduleType={_type} moduleKey={_key}>
            <Component {...props} />
          </ModuleErrorBoundary>
        );
      })}
    </>
  );
}

export default ModuleRenderer;
