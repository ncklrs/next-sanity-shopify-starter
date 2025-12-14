"use client";

import { NewsletterPopup } from "@/components/NewsletterPopup";

/**
 * Newsletter Popup Examples
 *
 * Demonstrates different configurations for the newsletter popup component.
 * Add one of these to your page component to enable newsletter capture.
 */

/**
 * Example 1: Exit Intent Popup (Default)
 *
 * Triggers when user moves mouse to leave the page (top of viewport).
 * Shows only once per session by default.
 *
 * Usage: Add to any page component
 */
export function ExitIntentNewsletterPopup() {
  return (
    <NewsletterPopup
      title="Wait! Don't Miss Out!"
      description="Get 10% off your first order plus exclusive deals and updates."
      discountCode="WELCOME10"
      trigger="exit-intent"
      showOnce={true}
      onSubmit={async (email) => {
        // Default behavior: posts to /api/newsletter/subscribe
        // You can override with custom logic here
        console.log("Newsletter signup:", email);
      }}
    />
  );
}

/**
 * Example 2: Time Delay Popup
 *
 * Appears after user has been on the page for X seconds.
 * Good for engagement without being intrusive.
 */
export function TimeDelayNewsletterPopup() {
  return (
    <NewsletterPopup
      title="Love What You See?"
      description="Join our community and get 10% off your first purchase."
      discountCode="FIRST10"
      trigger="time-delay"
      triggerValue={10000} // 10 seconds
      showOnce={true}
    />
  );
}

/**
 * Example 3: Scroll Depth Popup
 *
 * Triggers when user scrolls to a certain percentage of the page.
 * Great for engaged visitors.
 */
export function ScrollDepthNewsletterPopup() {
  return (
    <NewsletterPopup
      title="Enjoying Our Content?"
      description="Subscribe to get exclusive offers and stay updated."
      discountCode="READER10"
      trigger="scroll-depth"
      triggerValue={50} // Triggers at 50% scroll
      showOnce={true}
    />
  );
}

/**
 * Example 4: Custom Styling with Background Image
 *
 * Shows popup with a product/lifestyle image background.
 * Perfect for e-commerce sites.
 */
export function CustomStyledNewsletterPopup() {
  return (
    <NewsletterPopup
      title="Get 10% Off Your First Order!"
      description="Subscribe to unlock exclusive deals and early access to new arrivals."
      discountCode="WELCOME10"
      backgroundImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
      trigger="exit-intent"
      emailPlaceholder="you@example.com"
      submitButtonText="Unlock My Discount"
      successMessage="We've sent your discount code to your inbox!"
      showOnce={true}
    />
  );
}

/**
 * Example 5: Newsletter Popup with Custom Handler
 *
 * Use custom onSubmit handler to integrate with external services
 * (Mailchimp, SendGrid, ConvertKit, etc.)
 */
export function CustomHandlerNewsletterPopup() {
  const handleNewsletterSubmit = async (email: string) => {
    try {
      // Example: Custom API integration
      const response = await fetch("/api/external-newsletter-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          tags: ["newsletter", "popup"],
          source: "exit-intent-popup",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      // Track conversion
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "newsletter_signup", {
          event_category: "engagement",
          event_label: "exit_intent_popup",
        });
      }
    } catch (error) {
      console.error("Newsletter subscription failed:", error);
      throw error; // Re-throw to show error in popup
    }
  };

  return (
    <NewsletterPopup
      title="Join 10,000+ Happy Subscribers"
      description="Get exclusive deals, style tips, and early access to sales."
      discountCode="VIP10"
      trigger="exit-intent"
      onSubmit={handleNewsletterSubmit}
      onClose={() => {
        // Track popup close
        console.log("Newsletter popup closed");
      }}
    />
  );
}

/**
 * Example 6: Multiple Trigger Conditions
 *
 * While the component only supports one trigger at a time,
 * you can use multiple instances with different triggers on different pages.
 */
export function MultiTriggerExample() {
  return (
    <>
      {/* Show on homepage after 8 seconds */}
      <NewsletterPopup
        trigger="time-delay"
        triggerValue={8000}
        sessionKey="newsletter-home-time"
      />

      {/* Show on product pages on exit intent */}
      <NewsletterPopup
        trigger="exit-intent"
        sessionKey="newsletter-product-exit"
      />
    </>
  );
}

/**
 * IMPLEMENTATION GUIDE
 * ====================
 *
 * 1. Basic Setup (app/layout.tsx or page.tsx):
 *
 * ```tsx
 * import { ExitIntentNewsletterPopup } from "@/components/examples/NewsletterPopupExample";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <ExitIntentNewsletterPopup />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * 2. Page-Specific Implementation:
 *
 * ```tsx
 * "use client";
 *
 * import { NewsletterPopup } from "@/components/NewsletterPopup";
 *
 * export default function ProductPage() {
 *   return (
 *     <div>
 *       <h1>Product Page</h1>
 *       <NewsletterPopup
 *         trigger="exit-intent"
 *         showOnce={true}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * 3. Conditional Rendering (Only on certain pages):
 *
 * ```tsx
 * import { usePathname } from "next/navigation";
 *
 * export default function ConditionalPopup() {
 *   const pathname = usePathname();
 *
 *   // Only show on specific pages
 *   const showPopup = ["/", "/products", "/shop"].includes(pathname);
 *
 *   if (!showPopup) return null;
 *
 *   return <NewsletterPopup trigger="exit-intent" />;
 * }
 * ```
 *
 * 4. Subscriber Storage:
 *
 * The component automatically stores subscribers in Sanity using the
 * "subscriber" schema. Make sure you have the subscriber schema defined:
 *
 * ```js
 * // sanity/schemas/subscriber.ts
 * export default {
 *   name: 'subscriber',
 *   title: 'Newsletter Subscriber',
 *   type: 'document',
 *   fields: [
 *     { name: 'email', type: 'string', validation: Rule => Rule.required() },
 *     { name: 'status', type: 'string', options: { list: ['active', 'unsubscribed'] } },
 *     { name: 'source', type: 'string' },
 *     { name: 'subscribedAt', type: 'datetime' },
 *   ]
 * }
 * ```
 *
 * 5. Email Service Integration:
 *
 * Update the onSubmit handler to integrate with your email service:
 *
 * ```tsx
 * <NewsletterPopup
 *   onSubmit={async (email) => {
 *     // Mailchimp example
 *     await fetch('/api/mailchimp/subscribe', {
 *       method: 'POST',
 *       body: JSON.stringify({ email }),
 *     });
 *   }}
 * />
 * ```
 *
 * 6. Testing:
 *
 * To test the popup during development:
 * - Exit Intent: Move mouse to top of browser window
 * - Time Delay: Wait for specified seconds
 * - Scroll Depth: Scroll to specified percentage
 * - Clear session storage to reset: sessionStorage.clear()
 */

export default ExitIntentNewsletterPopup;
