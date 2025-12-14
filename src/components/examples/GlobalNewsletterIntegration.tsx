"use client";

import { NewsletterPopup } from "@/components/NewsletterPopup";

/**
 * Global Newsletter Popup Integration Example
 *
 * This component demonstrates how to integrate the NewsletterPopup
 * with the existing GlobalEngagement pattern.
 *
 * USAGE:
 * ======
 *
 * Option 1: Add to app/(site)/layout.tsx
 * ---------------------------------------
 * ```tsx
 * import { GlobalNewsletterPopup } from "@/components/examples/GlobalNewsletterIntegration";
 *
 * export default function SiteLayout({ children }) {
 *   return (
 *     <>
 *       <Navigation />
 *       {children}
 *       <Footer />
 *       <GlobalNewsletterPopup />
 *     </>
 *   );
 * }
 * ```
 *
 * Option 2: Add to specific pages
 * --------------------------------
 * ```tsx
 * import { NewsletterPopup } from "@/components/NewsletterPopup";
 *
 * export default function HomePage() {
 *   return (
 *     <div>
 *       <h1>Welcome</h1>
 *       <NewsletterPopup trigger="exit-intent" />
 *     </div>
 *   );
 * }
 * ```
 *
 * Option 3: Conditional based on route
 * -------------------------------------
 * ```tsx
 * import { usePathname } from "next/navigation";
 * import { NewsletterPopup } from "@/components/NewsletterPopup";
 *
 * export function ConditionalNewsletter() {
 *   const pathname = usePathname();
 *
 *   // Only show on e-commerce pages
 *   const isEcommercePage = pathname.startsWith("/products") || pathname === "/";
 *
 *   if (!isEcommercePage) return null;
 *
 *   return <NewsletterPopup trigger="exit-intent" />;
 * }
 * ```
 */

/**
 * Default Global Newsletter Popup
 *
 * Uses exit intent trigger with sensible defaults.
 * Shows once per session to avoid annoying users.
 */
export function GlobalNewsletterPopup() {
  return (
    <NewsletterPopup
      title="Get 10% Off Your First Order!"
      description="Subscribe to our newsletter and receive an exclusive discount code plus updates on new arrivals and sales."
      discountCode="WELCOME10"
      trigger="exit-intent"
      showOnce={true}
      sessionKey="global-newsletter-popup"
      emailPlaceholder="Enter your email address"
      submitButtonText="Get My Discount"
      successMessage="Check your inbox for your discount code and welcome email!"
    />
  );
}

/**
 * Homepage Newsletter Popup
 *
 * Time-delayed variant for homepage engagement.
 * Appears after 10 seconds to give users time to explore.
 */
export function HomepageNewsletterPopup() {
  return (
    <NewsletterPopup
      title="Welcome to Our Store!"
      description="Sign up for exclusive deals and be the first to know about new products."
      discountCode="FIRST10"
      trigger="time-delay"
      triggerValue={10000} // 10 seconds
      showOnce={true}
      sessionKey="homepage-newsletter-popup"
    />
  );
}

/**
 * Product Page Newsletter Popup
 *
 * Exit intent variant specifically for product pages.
 * Offers a discount to encourage purchase.
 */
export function ProductPageNewsletterPopup() {
  return (
    <NewsletterPopup
      title="Before You Go..."
      description="Get 10% off this product and others when you join our mailing list!"
      discountCode="PRODUCT10"
      trigger="exit-intent"
      showOnce={true}
      sessionKey="product-page-newsletter"
      backgroundImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
    />
  );
}

/**
 * Blog Newsletter Popup
 *
 * Scroll-based trigger for blog readers.
 * Appears when they've read 60% of the article.
 */
export function BlogNewsletterPopup() {
  return (
    <NewsletterPopup
      title="Enjoying This Article?"
      description="Get more great content and exclusive offers delivered to your inbox."
      discountCode="READER10"
      trigger="scroll-depth"
      triggerValue={60} // 60% scroll
      showOnce={true}
      sessionKey="blog-newsletter-popup"
    />
  );
}

/**
 * Custom Analytics Integration Example
 *
 * Tracks popup events with Google Analytics.
 */
export function AnalyticsNewsletterPopup() {
  const handleSubmit = async (email: string) => {
    try {
      // Track newsletter signup
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "newsletter_signup", {
          event_category: "engagement",
          event_label: "exit_intent_popup",
          value: email,
        });
      }

      // Default API submission
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      // Track successful submission
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "newsletter_signup_success", {
          event_category: "engagement",
          event_label: "exit_intent_popup",
        });
      }
    } catch (error) {
      // Track error
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "newsletter_signup_error", {
          event_category: "engagement",
          event_label: "exit_intent_popup",
        });
      }
      throw error;
    }
  };

  const handleClose = () => {
    // Track popup close
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "popup_closed", {
        event_category: "engagement",
        event_label: "newsletter_popup",
      });
    }
  };

  return (
    <NewsletterPopup
      trigger="exit-intent"
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  );
}

/**
 * Mailchimp Integration Example
 *
 * Custom handler for Mailchimp API integration.
 * You'll need to create the API route separately.
 */
export function MailchimpNewsletterPopup() {
  const handleMailchimpSubmit = async (email: string) => {
    try {
      const response = await fetch("/api/mailchimp/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          tags: ["newsletter", "exit-intent"],
          listId: process.env.NEXT_PUBLIC_MAILCHIMP_LIST_ID,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to subscribe");
      }

      // Also store in Sanity for backup
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "mailchimp-popup" }),
      });
    } catch (error) {
      console.error("Mailchimp subscription error:", error);
      throw error;
    }
  };

  return (
    <NewsletterPopup
      title="Join Our Community"
      description="Get exclusive content and offers delivered straight to your inbox."
      discountCode="COMMUNITY10"
      trigger="exit-intent"
      onSubmit={handleMailchimpSubmit}
    />
  );
}

/**
 * A/B Testing Example
 *
 * Randomly shows one of two variants for testing.
 * Track which performs better in your analytics.
 */
export function ABTestNewsletterPopup() {
  // Randomly assign variant (50/50 split)
  const isVariantA = typeof window !== "undefined" && Math.random() > 0.5;

  if (isVariantA) {
    return (
      <NewsletterPopup
        title="Get 10% Off Your First Order!"
        description="Subscribe to unlock exclusive deals."
        discountCode="SAVE10"
        trigger="exit-intent"
        sessionKey="ab-test-newsletter-a"
      />
    );
  }

  return (
    <NewsletterPopup
      title="Join Our VIP List!"
      description="Get early access to sales and exclusive member-only deals."
      discountCode="VIP10"
      trigger="time-delay"
      triggerValue={8000}
      sessionKey="ab-test-newsletter-b"
    />
  );
}

/**
 * INTEGRATION WITH EXISTING GLOBALENGAGEMENT
 * ===========================================
 *
 * If you want to add newsletter popup to the existing GlobalEngagement
 * component pattern (similar to announcement bars, sticky CTAs, etc.),
 * you would need to:
 *
 * 1. Add newsletter popup schema to Sanity (engagement document type)
 * 2. Update engagement queries to fetch newsletter popup config
 * 3. Add to GlobalEngagement component rendering
 *
 * Example Sanity Schema Addition:
 * ```js
 * {
 *   name: 'newsletterPopup',
 *   type: 'object',
 *   fields: [
 *     { name: 'title', type: 'string' },
 *     { name: 'description', type: 'text' },
 *     { name: 'discountCode', type: 'string' },
 *     { name: 'trigger', type: 'string', options: {
 *       list: ['exit-intent', 'time-delay', 'scroll-depth']
 *     }},
 *     { name: 'triggerValue', type: 'number' },
 *     { name: 'backgroundImage', type: 'image' },
 *     { name: 'showOnce', type: 'boolean' },
 *   ]
 * }
 * ```
 *
 * Example GlobalEngagement Addition:
 * ```tsx
 * // In GlobalEngagement.tsx
 * {newsletterPopup && (
 *   <NewsletterPopup
 *     title={newsletterPopup.title}
 *     description={newsletterPopup.description}
 *     discountCode={newsletterPopup.discountCode}
 *     trigger={newsletterPopup.trigger}
 *     triggerValue={newsletterPopup.triggerValue}
 *     backgroundImage={newsletterPopup.backgroundImage ? urlFor(newsletterPopup.backgroundImage).url() : undefined}
 *     showOnce={newsletterPopup.showOnce}
 *   />
 * )}
 * ```
 */

export default GlobalNewsletterPopup;
