# Next.js + Sanity + Shopify Starter

A production-ready [Next.js 16](https://nextjs.org) e-commerce template combining [Sanity CMS](https://www.sanity.io) page builder with [Shopify Storefront API](https://shopify.dev/docs/api/storefront). Features 70+ content modules, full customer authentication, and a luxury MAISON design system.

> **Note**: This is a fork of [next-sanity-aurora](https://github.com/ncklrs/next-sanity-aurora) with added Shopify e-commerce integration.

## Features

### E-commerce

- **Shopify Storefront API** - Products, collections, and cart management
- **Customer Authentication** - OAuth 2.0 + PKCE via Shopify Customer Account API
- **Full Account System** - Profile, orders, addresses, and wishlist
- **Cart & Checkout** - Slide-out cart drawer with Shopify checkout
- **Product Search** - Full-text search across products
- **Sanity Product Sync** - Manage products in Sanity via Shopify Connect

### Content Management

- **70+ Content Modules** - Hero sections, features, pricing, testimonials, CTAs, galleries, and e-commerce modules
- **Visual Page Builder** - Drag-and-drop modular content with live preview
- **Dynamic Form Builder** - Create forms in Sanity with email, webhook, and Discord integrations
- **Engagement System** - Announcement bars, sticky CTAs, exit-intent modals, newsletter popups
- **Blog System** - Full-featured blog with categories, featured posts, and SEO
- **Embedded Sanity Studio** - Content management at `/studio`

### Tech Stack

- **Next.js 16** with App Router and React 19
- **TypeScript** - Full type safety throughout
- **Tailwind CSS 4** - Modern styling with MAISON design system
- **Zustand** - Lightweight state management for cart
- **On-Demand Revalidation** - Webhook-based cache invalidation

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A [Sanity.io](https://sanity.io) account
- A [Shopify](https://shopify.com) store with Storefront API access

### 1. Clone and Install

```bash
git clone https://github.com/ncklrs/next-sanity-shopify-starter.git
cd next-sanity-shopify-starter

# Install dependencies
npm install
# or
bun install
```

### 2. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Sanity (required)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# Shopify Storefront API (required for e-commerce)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token

# Shopify Customer Account API (required for auth)
SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID=your-client-id
AUTH_COOKIE_SECRET=generate-with-openssl-rand-hex-32
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
# or
bun dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── [slug]/               # Dynamic pages
│   │   │   ├── blog/                 # Blog routes
│   │   │   ├── products/             # Product pages
│   │   │   ├── collections/          # Collection pages
│   │   │   ├── cart/                 # Cart page
│   │   │   ├── search/               # Product search
│   │   │   └── account/              # Customer account
│   │   │       ├── login/            # OAuth login
│   │   │       ├── profile/          # Account details
│   │   │       ├── orders/           # Order history
│   │   │       ├── addresses/        # Saved addresses
│   │   │       └── wishlist/         # Saved products
│   │   ├── studio/                   # Embedded Sanity Studio
│   │   ├── api/                      # API routes
│   │   │   └── auth/shopify/         # OAuth endpoints
│   │   └── actions/                  # Server Actions
│   ├── components/
│   │   ├── modules/                  # Content modules
│   │   │   └── Ecommerce/            # E-commerce modules
│   │   ├── forms/                    # Form components
│   │   ├── ui/                       # UI primitives
│   │   └── ...                       # Cart, Navigation, etc.
│   ├── contexts/
│   │   └── CartContext.tsx           # Cart state management
│   └── lib/
│       └── shopify/                  # Shopify API client
├── sanity/
│   ├── schemas/
│   │   ├── documents/                # Page, Post, Product, etc.
│   │   ├── modules/                  # 70+ module schemas
│   │   └── objects/                  # Reusable objects
│   ├── queries/                      # GROQ queries
│   └── lib/                          # Sanity client
└── sanity.config.ts                  # Studio configuration
```

## Content Modules

### E-commerce Modules

| Module | Description |
|--------|-------------|
| `productGrid` | Grid display of products with filtering |
| `productCarousel` | Horizontal scrolling product carousel |
| `productHero` | Featured product showcase with details |
| `featuredProduct` | Highlight a single product |
| `collectionGrid` | Display product collections |
| `recentlyViewed` | Recently viewed products |
| `relatedProducts` | Related product recommendations |
| `trustBadges` | Payment/security trust indicators |
| `wishlist` | User's saved products |

### Hero Sections

`heroDefault` · `heroCentered` · `heroSplit` · `heroVideo` · `heroMinimal`

### Features

`featuresGrid` · `featuresAlternating` · `featuresIconCards`

### Pricing

`pricingCards` · `pricingComparison` · `pricingSimple`

### Testimonials

`testimonialsGrid` · `testimonialsCarousel` · `testimonialsFeatured`

### Call-to-Action

`ctaDefault` · `ctaNewsletter` · `ctaSplit` · `ctaBanner` · `ctaStats`

### Blog

`blogFeaturedPost` · `blogGrid` · `blogList` · `blogCarousel` · `blogMinimal`

### Forms

`formContact` · `formNewsletter` · `formWithImage` · `formMultiStep` · `formDynamic`

### And More...

FAQ, galleries, logo clouds, social proof, stats, tabs, accordions, timelines, and more.

## Shopify Setup

### 1. Create Storefront API Access

1. Go to Shopify Admin > Apps > Develop apps
2. Create a new custom app
3. Configure Storefront API scopes:
   - `unauthenticated_read_products`
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
4. Install app and copy the Storefront access token

### 2. Configure Customer Account API (for authentication)

1. Go to Shopify Admin > Settings > Customer accounts
2. Enable "New customer accounts"
3. Go to Settings > Apps and sales channels > Develop apps
4. Create Customer Account API credentials:
   - Application type: Public
   - Redirect URI: `https://your-domain.com/api/auth/shopify/callback`
5. Copy the Client ID

### 3. Sanity Shopify Connect (optional)

For managing products in Sanity:

1. Install Sanity Connect from Shopify App Store
2. Configure sync in Sanity Studio
3. Products will appear as Sanity documents

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Dataset name |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Yes | Shopify store domain |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Yes | Storefront API token |
| `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID` | For auth | Customer Account API client |
| `AUTH_COOKIE_SECRET` | For auth | Cookie encryption secret |
| `NEXT_PUBLIC_APP_URL` | For auth | Your app's public URL |
| `SANITY_API_READ_TOKEN` | No | For preview/draft content |
| `SANITY_API_WRITE_TOKEN` | No | For form submissions |
| `SANITY_WEBHOOK_SECRET` | No | For on-demand revalidation |
| `RESEND_API_KEY` | No | For email form actions |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Set environment variables
4. Deploy

### Other Platforms

```bash
npm run build
npm start
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/shopify/login` | GET | Initiates OAuth login |
| `/api/auth/shopify/callback` | GET | OAuth callback handler |
| `/api/auth/shopify/logout` | POST | Logout and clear session |
| `/api/revalidate` | POST | On-demand cache revalidation |
| `/api/forms/submit` | POST | Dynamic form submission |

## Design System

This template uses the **MAISON** design system - a luxury editorial aesthetic featuring:

- Clean, minimal typography
- Generous whitespace
- Subtle animations
- High-contrast accents
- Mobile-first responsive design

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Shopify Customer Account API](https://shopify.dev/docs/api/customer)

## License

MIT License - see [LICENSE](LICENSE) for details.
