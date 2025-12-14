# Newsletter Popup - E-commerce Email Capture

A fully-featured, production-ready newsletter popup component for capturing emails with exit intent detection, multiple trigger options, and Sanity CMS integration.

## Features

- **Exit Intent Detection**: Triggers when user's mouse leaves the viewport (desktop) or on visibility change (mobile)
- **Multiple Trigger Options**: Exit intent, time delay, or scroll depth
- **Session Management**: Show once per session with localStorage tracking
- **Email Validation**: Client and server-side validation
- **Success State**: Shows discount code after successful subscription
- **Responsive Design**: Mobile-first, works on all devices
- **Accessible**: Keyboard navigation (ESC to close), ARIA labels
- **Sanity Integration**: Automatically stores subscribers in Sanity CMS
- **Customizable**: Full control over styling, copy, and behavior

## Files Created

```
src/
├── components/
│   ├── NewsletterPopup.tsx          # Main popup component
│   └── examples/
│       └── NewsletterPopupExample.tsx # Usage examples
├── hooks/
│   └── useExitIntent.ts             # Exit intent detection hook
└── app/
    └── api/
        └── newsletter/
            └── subscribe/
                └── route.ts         # API endpoint for subscriptions
```

## Quick Start

### 1. Basic Implementation

Add to your layout or page component:

```tsx
"use client";

import { NewsletterPopup } from "@/components/NewsletterPopup";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <NewsletterPopup />
    </>
  );
}
```

That's it! The popup will appear on exit intent with default settings.

### 2. Custom Configuration

```tsx
<NewsletterPopup
  title="Get 10% Off Your First Order!"
  description="Subscribe to unlock exclusive deals."
  discountCode="WELCOME10"
  trigger="exit-intent"
  showOnce={true}
  backgroundImage="https://example.com/product-image.jpg"
  emailPlaceholder="Enter your email"
  submitButtonText="Get My Discount"
  successMessage="Check your inbox for your discount code!"
/>
```

## Trigger Types

### Exit Intent (Default)

Triggers when user moves mouse to leave the page:

```tsx
<NewsletterPopup
  trigger="exit-intent"
  showOnce={true}
/>
```

**Desktop**: Detects mouse leaving viewport from top
**Mobile**: Detects tab switch or back button (visibility change)

### Time Delay

Appears after X milliseconds:

```tsx
<NewsletterPopup
  trigger="time-delay"
  triggerValue={10000} // 10 seconds
/>
```

### Scroll Depth

Triggers at specific scroll percentage:

```tsx
<NewsletterPopup
  trigger="scroll-depth"
  triggerValue={50} // 50% of page
/>
```

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Get 10% Off..." | Popup headline |
| `description` | string | "Subscribe to..." | Subtitle text |
| `discountCode` | string | "WELCOME10" | Code shown on success |
| `backgroundImage` | string | undefined | Product/lifestyle image URL |
| `trigger` | "exit-intent" \| "time-delay" \| "scroll-depth" | "exit-intent" | When to show popup |
| `triggerValue` | number | 5000 / 50 | Delay (ms) or scroll % |
| `showOnce` | boolean | true | Show only once per session |
| `sessionKey` | string | "newsletter-popup-shown" | localStorage key |
| `emailPlaceholder` | string | "Enter your email" | Input placeholder |
| `submitButtonText` | string | "Get My Discount" | Submit button text |
| `successMessage` | string | "Check your inbox..." | Success state message |
| `onSubmit` | (email: string) => Promise<void> | API call | Custom submit handler |
| `onClose` | () => void | undefined | Close callback |

## Exit Intent Hook

The `useExitIntent` hook can be used independently:

```tsx
import { useExitIntent } from "@/hooks/useExitIntent";

function MyComponent() {
  useExitIntent(
    () => {
      console.log("User is leaving!");
      // Your custom logic
    },
    {
      enabled: true,
      sensitivity: 10,
      oncePerSession: true,
      enableMobile: true,
    }
  );

  return <div>Content</div>;
}
```

### Hook Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | true | Enable/disable detection |
| `sensitivity` | number | 10 | Distance from top (px) |
| `delay` | number | 1000 | Cooldown between triggers (ms) |
| `oncePerSession` | boolean | true | Only trigger once |
| `sessionKey` | string | "exit-intent-triggered" | Storage key |
| `enableMobile` | boolean | true | Enable mobile detection |

## API Endpoint

### POST `/api/newsletter/subscribe`

Handles newsletter subscriptions and stores them in Sanity.

**Request Body:**
```json
{
  "email": "user@example.com",
  "source": "newsletter-popup"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Successfully subscribed!",
  "subscriberId": "abc123"
}
```

**Response (Already Subscribed):**
```json
{
  "success": true,
  "message": "You're already subscribed!",
  "alreadySubscribed": true
}
```

**Response (Error):**
```json
{
  "error": "Invalid email format"
}
```

### Features:
- Email validation and normalization
- Duplicate detection
- Resubscription support
- Metadata tracking (user agent, referrer, IP)
- Sanity CMS integration

## Sanity Integration

Subscribers are automatically stored in Sanity with the `subscriber` document type.

**Subscriber Schema Fields:**
- `email`: Subscriber email (required)
- `status`: "active" or "unsubscribed"
- `source`: Where they subscribed from
- `subscribedAt`: Subscription timestamp
- `metadata`: User agent, referrer, IP

**Existing Queries:**
```ts
// Check if subscriber exists
import { subscriberExistsQuery } from "sanity/queries/subscribers";

// Get subscriber count
import { subscriberCountQuery } from "sanity/queries/subscribers";

// Get active subscribers
import { activeSubscribersQuery } from "sanity/queries/subscribers";
```

## Custom Email Service Integration

Override the default behavior to integrate with Mailchimp, SendGrid, ConvertKit, etc:

```tsx
<NewsletterPopup
  onSubmit={async (email) => {
    // Example: Mailchimp
    const response = await fetch('/api/mailchimp/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        tags: ['newsletter', 'exit-intent'],
        listId: 'your-list-id',
      }),
    });

    if (!response.ok) {
      throw new Error('Subscription failed');
    }

    // Track with analytics
    if (window.gtag) {
      window.gtag('event', 'newsletter_signup', {
        event_category: 'engagement',
      });
    }
  }}
/>
```

## Conditional Display

Show popup only on specific pages:

```tsx
"use client";

import { usePathname } from "next/navigation";
import { NewsletterPopup } from "@/components/NewsletterPopup";

export function ConditionalNewsletterPopup() {
  const pathname = usePathname();

  // Only show on these pages
  const showPages = ["/", "/products", "/shop"];
  if (!showPages.includes(pathname)) return null;

  return <NewsletterPopup />;
}
```

## Testing

### During Development

1. **Exit Intent**: Move mouse to top of browser window
2. **Time Delay**: Wait for specified duration
3. **Scroll Depth**: Scroll to specified percentage
4. **Reset Session**: `sessionStorage.clear()` in console

### Reset Popup State

```tsx
// In your component
const { reset } = useExitIntent(/* ... */);

// Call reset() to re-enable the popup
<button onClick={reset}>Reset Popup</button>
```

## Styling

The component uses CSS variables from your existing design system:

- `--background`: Popup background
- `--foreground`: Text color
- `--border`: Border color
- `--accent-violet`, `--accent-cyan`: Gradient colors

Override with custom styles:

```tsx
<NewsletterPopup
  className="custom-popup"
  // Custom inline styles applied to wrapper
/>
```

## Analytics Integration

Track popup events:

```tsx
<NewsletterPopup
  onSubmit={async (email) => {
    // Track submission
    gtag('event', 'newsletter_signup', {
      event_category: 'engagement',
      event_label: 'exit_intent',
      value: email,
    });

    // Default API call
    await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }}
  onClose={() => {
    // Track close
    gtag('event', 'popup_closed', {
      event_category: 'engagement',
      event_label: 'newsletter_popup',
    });
  }}
/>
```

## A/B Testing

Test different configurations:

```tsx
const isVariantA = Math.random() > 0.5;

<NewsletterPopup
  title={isVariantA ? "Get 10% Off!" : "Join Our VIP List!"}
  discountCode={isVariantA ? "SAVE10" : "VIP10"}
  trigger={isVariantA ? "exit-intent" : "time-delay"}
  triggerValue={isVariantA ? undefined : 8000}
/>
```

## Performance Considerations

- **Bundle Size**: ~4KB gzipped (component + hook)
- **No Dependencies**: Uses native React hooks
- **Lazy Loading**: Use `React.lazy()` if needed:

```tsx
const NewsletterPopup = lazy(() => import("@/components/NewsletterPopup"));

<Suspense fallback={null}>
  <NewsletterPopup />
</Suspense>
```

## Accessibility

- **Keyboard**: ESC key closes popup
- **Focus Management**: Auto-focus on email input
- **ARIA Labels**: Proper labels for screen readers
- **Color Contrast**: WCAG AA compliant

## Browser Support

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: 14+
- Mobile Safari: 14+
- Mobile Chrome: Latest

## Troubleshooting

### Popup not appearing

1. Check console for errors
2. Verify `showOnce` isn't blocking (clear session storage)
3. Check trigger conditions are met
4. Ensure component is mounted client-side

### Email not saving

1. Verify Sanity write token is configured: `SANITY_API_WRITE_TOKEN`
2. Check API route logs: `/api/newsletter/subscribe`
3. Verify subscriber schema exists in Sanity

### Exit intent not working on mobile

- Mobile uses visibility change API (tab switch)
- Test by switching tabs or using back button
- Verify `enableMobile` option is true

## License

Same as parent project.

## Support

For issues or questions, please refer to the main project README.
