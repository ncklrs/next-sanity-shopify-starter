/**
 * Module Query Projections
 *
 * Explicit field projections for each module type to avoid over-querying.
 * Using explicit projections instead of spread operators ensures:
 * - Smaller payload sizes
 * - No accidental exposure of sensitive/internal fields
 * - Better performance and caching
 */

// Shared field projections for common patterns
const buttonFields = `{
  text,
  link,
  variant
}`;

const imageFields = `{
  asset->{
    _id,
    url,
    metadata{ dimensions }
  },
  alt,
  hotspot,
  crop
}`;

const spacingRef = `spacing->{
  _id,
  paddingTop,
  paddingBottom
}`;

const backgroundColorRef = `backgroundColor->{
  _id,
  value
}`;

// Hero module projections
const heroDefaultProjection = `{
  _type,
  _key,
  badge{ text, variant },
  heading,
  headingHighlight,
  subheading,
  buttons[]${buttonFields},
  backgroundStyle,
  alignment,
  spacing,
  backgroundColor
}`;

const heroCenteredProjection = `{
  _type,
  _key,
  badge{ text, variant },
  heading,
  headingHighlight,
  subheading,
  buttons[]${buttonFields},
  trustedByText,
  trustedByLogos[]{ asset->{ _id, url }, alt, companyName },
  spacing,
  backgroundColor
}`;

const heroSplitProjection = `{
  _type,
  _key,
  heading,
  headingHighlight,
  subheading,
  buttons[]${buttonFields},
  image${imageFields},
  imagePosition,
  features[]{ icon, text },
  spacing,
  backgroundColor
}`;

const heroVideoProjection = `{
  _type,
  _key,
  heading,
  headingHighlight,
  subheading,
  videoUrl,
  videoPoster${imageFields},
  buttons[]${buttonFields},
  overlay,
  spacing,
  backgroundColor
}`;

const heroMinimalProjection = `{
  _type,
  _key,
  heading,
  headingHighlight,
  subheading,
  announcement{ text, link },
  buttons[]${buttonFields},
  spacing,
  backgroundColor
}`;

// Features module projections
const featuresGridProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  features[]{ icon, title, description },
  columns,
  spacing,
  backgroundColor
}`;

const featuresAlternatingProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  items[]{
    heading,
    description,
    image${imageFields},
    features[]
  },
  spacing,
  backgroundColor
}`;

const featuresIconCardsProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  features[]{
    icon,
    title,
    description,
    link{ text, url }
  },
  spacing,
  backgroundColor
}`;

// Pricing module projections
const pricingCardsProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  plans[]{
    name,
    description,
    price,
    priceUnit,
    features[],
    buttonText,
    buttonLink,
    highlighted
  },
  spacing,
  backgroundColor
}`;

const pricingComparisonProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  features[],
  plans[]{
    name,
    price,
    priceUnit,
    featureValues[],
    buttonText,
    buttonLink,
    highlighted
  },
  spacing,
  backgroundColor
}`;

const pricingSimpleProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  price,
  priceUnit,
  features[],
  buttonText,
  buttonLink,
  spacing,
  backgroundColor
}`;

// Testimonials module projections
const testimonialFields = `{
  _key,
  content,
  author,
  role,
  company,
  avatar${imageFields},
  rating,
  companyLogo${imageFields}
}`;

const testimonialsGridProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  testimonials[]${testimonialFields},
  columns,
  spacing,
  backgroundColor
}`;

const testimonialsCarouselProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  testimonials[]${testimonialFields},
  autoplay,
  spacing,
  backgroundColor
}`;

const testimonialsFeaturedProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  featured{
    _key,
    content,
    author,
    role,
    company,
    avatar${imageFields},
    logo${imageFields}
  },
  supporting[]${testimonialFields},
  spacing,
  backgroundColor
}`;

const testimonialsCarouselLargeProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  testimonials[]${testimonialFields},
  spacing,
  backgroundColor
}`;

// Team module projections
const teamMemberFields = `{
  name,
  role,
  bio,
  image${imageFields},
  socialLinks[]{ platform, url }
}`;

const teamGridProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  members[]${teamMemberFields},
  columns,
  spacing,
  backgroundColor
}`;

const teamCardsProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  members[]${teamMemberFields},
  spacing,
  backgroundColor
}`;

const teamCompactProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  members[]{ name, role, image${imageFields} },
  spacing,
  backgroundColor
}`;

// CTA module projections
const ctaDefaultProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  buttons[]${buttonFields},
  note,
  spacing,
  backgroundColor
}`;

const ctaNewsletterProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  placeholder,
  buttonText,
  note,
  spacing,
  backgroundColor
}`;

const ctaSplitProjection = `{
  _type,
  _key,
  heading,
  headingHighlight,
  subheading,
  image${imageFields},
  buttons[]${buttonFields},
  features[],
  spacing,
  backgroundColor
}`;

const ctaBannerProjection = `{
  _type,
  _key,
  heading,
  button${buttonFields},
  backgroundStyle,
  backgroundImage${imageFields},
  spacing,
  backgroundColor
}`;

const ctaStatsProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  stats[]{ value, label },
  buttons[]${buttonFields},
  spacing,
  backgroundColor
}`;

// Shared logo field projection (for nested image structure)
const logoItemFields = `{
  name,
  "asset": image.asset,
  "hotspot": image.hotspot,
  "crop": image.crop,
  link
}`;

// Social Proof module projections
const socialProofLogosProjection = `{
  _type,
  _key,
  heading,
  logos[]${logoItemFields},
  style,
  spacing,
  backgroundColor
}`;

const socialProofStatsProjection = `{
  _type,
  _key,
  heading,
  stats[]{ value, label, prefix, suffix },
  spacing,
  backgroundColor
}`;

// Logo Cloud module projections
const logoCloudSimpleProjection = `{
  _type,
  _key,
  heading,
  logos[]${logoItemFields},
  style,
  spacing,
  backgroundColor
}`;

const logoCloudMarqueeProjection = `{
  _type,
  _key,
  heading,
  logos[]${logoItemFields},
  speed,
  direction,
  spacing,
  backgroundColor
}`;

const logoCloudGridProjection = `{
  _type,
  _key,
  heading,
  logos[]${logoItemFields},
  columns,
  spacing,
  backgroundColor
}`;

// FAQ module projections
const faqItemFields = `{ question, answer }`;

const faqAccordionProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  items[]${faqItemFields},
  spacing,
  backgroundColor
}`;

const faqTwoColumnProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  items[]${faqItemFields},
  spacing,
  backgroundColor
}`;

const faqWithCategoriesProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  categories[]{
    name,
    items[]${faqItemFields}
  },
  spacing,
  backgroundColor
}`;

const faqSimpleProjection = `{
  _type,
  _key,
  heading,
  items[]${faqItemFields},
  spacing,
  backgroundColor
}`;

// Gallery module projections
// Note: Schema has images[].image (nested image object), so we extract and flatten
const galleryImageFields = `{
  _key,
  "asset": image.asset,
  "hotspot": image.hotspot,
  "crop": image.crop,
  alt,
  caption,
  size
}`;

const galleryGridProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  images[]${galleryImageFields},
  columns,
  enableLightbox,
  spacing,
  backgroundColor
}`;

const galleryMasonryProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  images[]${galleryImageFields},
  enableLightbox,
  spacing,
  backgroundColor
}`;

const galleryCarouselProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  images[]${galleryImageFields},
  autoplay,
  showThumbnails,
  spacing,
  backgroundColor
}`;

// Blog Feature module projections
// Fields to fetch for each blog post (used in both references and latest queries)
const blogPostFields = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  featuredImage${imageFields},
  publishedAt,
  "author": author->{name, "avatar": image.asset->url},
  "category": categories[0]->title,
  "readingTime": round(length(pt::text(body)) / 5 / 200)
}`;

// Dereference for explicit post references
const blogPostRef = `->${blogPostFields}`;

const blogFeaturedPostProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  showExcerpt,
  "post": featuredPost${blogPostRef},
  spacing,
  backgroundColor
}`;

// For modules with postSelection (latest vs specific), use conditional fetching
// Note: GROQ doesn't support dynamic range limits, so we fetch up to 12 posts for "latest"
// and let the component limit based on postsToShow
const blogGridProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  postSelection,
  postsToShow,
  columns,
  showExcerpt,
  spacing,
  backgroundColor,
  "posts": select(
    postSelection == "specific" => posts[]${blogPostRef},
    *[_type == "post"] | order(publishedAt desc)[0...12]${blogPostFields}
  )
}`;

const blogListProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  postSelection,
  postsToShow,
  spacing,
  backgroundColor,
  "posts": select(
    postSelection == "specific" => posts[]${blogPostRef},
    *[_type == "post"] | order(publishedAt desc)[0...20]${blogPostFields}
  )
}`;

const blogCarouselProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  postSelection,
  postsToShow,
  autoplay,
  spacing,
  backgroundColor,
  "posts": select(
    postSelection == "specific" => posts[]${blogPostRef},
    *[_type == "post"] | order(publishedAt desc)[0...12]${blogPostFields}
  )
}`;

const blogMinimalProjection = `{
  _type,
  _key,
  heading,
  postSelection,
  postsToShow,
  viewAllLink,
  spacing,
  backgroundColor,
  "posts": select(
    postSelection == "specific" => posts[]${blogPostRef},
    *[_type == "post"] | order(publishedAt desc)[0...10]${blogPostFields}
  )
}`;

// Form module projections
const formFieldsProjection = `fields[]{
  _key,
  name,
  label,
  type,
  required,
  placeholder,
  helpText,
  defaultValue,
  width,
  options[]{ label, value },
  rows,
  accept,
  multiple,
  validation
}`;

const formContactProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  form->{
    _id,
    name,
    ${formFieldsProjection},
    settings
  },
  spacing,
  backgroundColor
}`;

const formNewsletterProjection = `{
  _type,
  _key,
  heading,
  subheading,
  note,
  form->{
    _id,
    name,
    ${formFieldsProjection},
    settings
  },
  spacing,
  backgroundColor
}`;

const formWithImageProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  image${imageFields},
  imagePosition,
  form->{
    _id,
    name,
    ${formFieldsProjection},
    settings
  },
  spacing,
  backgroundColor
}`;

const formMultiStepProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  steps[]{
    title,
    description,
    ${formFieldsProjection}
  },
  submitText,
  successMessage,
  showProgressBar,
  spacing,
  backgroundColor
}`;

const formDynamicProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  layout,
  maxWidth,
  "form": { "_ref": form._ref },
  spacing,
  backgroundColor
}`;

// Trust module projections
// Field names must match schema: items[], name, image, etc.
const awardsProjection = `{
  _type,
  _key,
  title,
  subtitle,
  items[]{
    name,
    organization,
    year,
    image${imageFields},
    link
  },
  variant,
  columns,
  spacing,
  backgroundColor
}`;

const pressMentionsProjection = `{
  _type,
  _key,
  title,
  mentions[]{
    name,
    quote,
    logo${imageFields},
    link
  },
  variant,
  spacing,
  backgroundColor
}`;

const caseStudyCardsProjection = `{
  _type,
  _key,
  title,
  subtitle,
  caseStudies[]{
    title,
    company,
    logo${imageFields},
    image${imageFields},
    excerpt,
    metric{ value, label },
    link
  },
  variant,
  columns,
  spacing,
  backgroundColor
}`;

const integrationGridProjection = `{
  _type,
  _key,
  title,
  subtitle,
  categories[]{
    name,
    integrations[]
  },
  integrations[]{
    name,
    description,
    logo${imageFields},
    category,
    link,
    featured
  },
  variant,
  columns,
  spacing,
  backgroundColor
}`;

// Content module projections
const richTextBlockProjection = `{
  _type,
  _key,
  title,
  content[],
  alignment,
  maxWidth,
  spacing,
  backgroundColor
}`;

const quoteProjection = `{
  _type,
  _key,
  quote,
  author,
  role,
  company,
  avatar${imageFields},
  style,
  spacing,
  backgroundColor
}`;

const statsCounterProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  stats[]{
    value,
    label,
    prefix,
    suffix,
    animateOnView
  },
  columns,
  spacing,
  backgroundColor
}`;

const comparisonTableProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  columns[]{
    header,
    highlighted
  },
  rows[]{
    feature,
    values[]
  },
  spacing,
  backgroundColor
}`;

// Media module projections
const videoEmbedProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  videoUrl,
  poster${imageFields},
  autoplay,
  loop,
  spacing,
  backgroundColor
}`;

const beforeAfterProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  beforeImage${imageFields},
  afterImage${imageFields},
  beforeLabel,
  afterLabel,
  spacing,
  backgroundColor
}`;

const codeBlockProjection = `{
  _type,
  _key,
  title,
  language,
  code,
  showLineNumbers,
  highlightLines[],
  spacing,
  backgroundColor
}`;

const embedBlockProjection = `{
  _type,
  _key,
  title,
  embedCode,
  aspectRatio,
  spacing,
  backgroundColor
}`;

// Interactive module projections
const tabsProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  tabs[]{
    title,
    icon,
    content[]
  },
  spacing,
  backgroundColor
}`;

const accordionProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  items[]{
    title,
    content[]
  },
  allowMultiple,
  spacing,
  backgroundColor
}`;

const stepsProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  steps[]{
    title,
    description,
    icon
  },
  orientation,
  spacing,
  backgroundColor
}`;

const timelineProjection = `{
  _type,
  _key,
  badge,
  heading,
  headingHighlight,
  subheading,
  items[]{
    date,
    title,
    description,
    icon
  },
  spacing,
  backgroundColor
}`;

// Engagement module projections
const announcementBarProjection = `{
  _type,
  _key,
  text,
  link,
  linkText,
  dismissible,
  backgroundColor
}`;

const countdownProjection = `{
  _type,
  _key,
  title,
  subtitle,
  targetDate,
  expiredMessage,
  showDays,
  showHours,
  showMinutes,
  showSeconds,
  button${buttonFields},
  variant,
  backgroundColor
}`;

const stickyCtaProjection = `{
  _type,
  _key,
  text,
  buttonText,
  buttonLink,
  showAfterScroll,
  position,
  backgroundColor
}`;

const modalProjection = `{
  _type,
  _key,
  id,
  title,
  content[],
  formModule,
  image${imageFields},
  button${buttonFields},
  trigger,
  triggerValue,
  showOnce,
  variant
}`;

// Utility module projections
const spacerProjection = `{
  _type,
  _key,
  size,
  showDivider,
  dividerStyle,
  backgroundColor
}`;

const anchorPointProjection = `{
  _type,
  _key,
  id,
  label
}`;

const bannerProjection = `{
  _type,
  _key,
  title,
  message,
  type,
  icon,
  link {
    text,
    url
  },
  dismissible,
  variant
}`;

const downloadCardsProjection = `{
  _type,
  _key,
  title,
  subtitle,
  downloads[]{
    title,
    description,
    image${imageFields},
    file{ asset->{ _id, url } },
    fileUrl,
    fileType,
    fileSize,
    gated
  },
  variant,
  columns,
  backgroundColor
}`;

const multiColumnProjection = `{
  _type,
  _key,
  columns,
  columnGap,
  verticalAlignment,
  columnContent[]{
    _key,
    width,
    modules[]{
      _type,
      _key,
      // Content modules
      _type == "richTextBlock" => ${richTextBlockProjection},
      _type == "quote" => ${quoteProjection},
      _type == "statsCounter" => ${statsCounterProjection},
      // Media modules
      _type == "videoEmbed" => ${videoEmbedProjection},
      _type == "codeBlock" => ${codeBlockProjection},
      _type == "beforeAfter" => ${beforeAfterProjection},
      // Interactive
      _type == "tabs" => ${tabsProjection},
      _type == "accordion" => ${accordionProjection},
      _type == "steps" => ${stepsProjection},
      _type == "timeline" => ${timelineProjection},
      // CTA
      _type == "cta.default" => ${ctaDefaultProjection},
      _type == "cta.newsletter" => ${ctaNewsletterProjection},
      // Trust
      _type == "awards" => ${awardsProjection},
      _type == "integrationGrid" => ${integrationGridProjection},
      // Forms
      _type == "formContact" => ${formContactProjection},
      _type == "formNewsletter" => ${formNewsletterProjection},
      // Utility
      _type == "spacer" => ${spacerProjection}
    }
  },
  backgroundColor,
  reverseOnMobile
}`;

// ─────────────────────────────────────────────────────────────────────────────
// E-commerce Module Projections
// ─────────────────────────────────────────────────────────────────────────────

// Shared product card projection (for dereferencing products)
// Includes firstVariantId for quick add-to-cart functionality
const productCardFields = `{
  _key,
  "name": store.title,
  "slug": store.slug.current,
  "price": store.priceRange.minVariantPrice,
  "compareAtPrice": store.priceRange.maxVariantPrice,
  "image": { "src": store.previewImageUrl, "alt": store.title },
  "category": store.productType,
  "availableForSale": store.status == "active" && !store.isDeleted,
  "tags": store.tags,
  "firstVariantId": store.variants[0]->store.gid
}`;

// Product Hero - Full product detail section
const productHeroProjection = `{
  _type,
  _key,
  badge,
  "productName": product->store.title,
  "price": product->store.priceRange.minVariantPrice,
  "compareAtPrice": product->store.priceRange.maxVariantPrice,
  "description": product->store.description,
  "images": [{ "src": product->store.previewImageUrl, "alt": product->store.title }],
  // Option groups for UI (Color, Size, etc.)
  "variants": product->store.options[]{
    "id": _key,
    "name": name,
    "options": values
  },
  // All Shopify variants with their IDs and option values for cart lookup
  "shopifyVariants": product->store.variants[]->store{
    "id": gid,
    "title": title,
    "option1": option1,
    "option2": option2,
    "option3": option3,
    "price": price,
    "availableForSale": inventory.isAvailable
  },
  // First variant ID for simple single-variant products
  "firstVariantId": product->store.variants[0]->store.gid,
  "inStock": product->store.status == "active" && !product->store.isDeleted,
  trustBadges[]{ icon, text },
  ctaText,
  spacing,
  backgroundColor
}`;

// Product Grid - Display multiple products
const productGridProjection = `{
  _type,
  _key,
  badge,
  heading,
  subheading,
  source,
  columns,
  showFilters,
  productsPerPage,
  maxProducts,
  spacing,
  backgroundColor,
  // Manual selection - dereference each product
  "products": select(
    source == "manual" || source == null => products[]{
      _key,
      "name": product->store.title,
      "slug": product->store.slug.current,
      "price": product->store.priceRange.minVariantPrice,
      "compareAtPrice": product->store.priceRange.maxVariantPrice,
      "image": { "src": product->store.previewImageUrl, "alt": product->store.title },
      "category": product->store.productType,
      "availableForSale": product->store.status == "active" && !product->store.isDeleted,
      "badge": displayOverrides.badge,
      "firstVariantId": product->store.variants[0]->store.gid
    },
    // Collection source - fetch up to 24, let component limit based on maxProducts
    source == "collection" => *[_type == "product" && references(^.collection._ref) && !store.isDeleted && store.status == "active"][0...24]${productCardFields},
    // Tag source
    source == "tag" => *[_type == "product" && ^.tag in store.tags && !store.isDeleted && store.status == "active"][0...24]${productCardFields},
    // Featured source
    source == "featured" => *[_type == "product" && "featured" in store.tags && !store.isDeleted && store.status == "active"][0...24]${productCardFields}
  )
}`;

// Product Carousel - Scrollable product display
const productCarouselProjection = `{
  _type,
  _key,
  badge,
  heading,
  subheading,
  source,
  autoplay,
  autoplayInterval,
  maxProducts,
  spacing,
  backgroundColor,
  // Manual selection - dereference each product
  "products": select(
    source == "manual" || source == null => products[]{
      _key,
      "name": product->store.title,
      "slug": product->store.slug.current,
      "price": product->store.priceRange.minVariantPrice,
      "compareAtPrice": product->store.priceRange.maxVariantPrice,
      "image": { "src": product->store.previewImageUrl, "alt": product->store.title },
      "availableForSale": product->store.status == "active" && !product->store.isDeleted,
      "badge": displayOverrides.badge,
      "firstVariantId": product->store.variants[0]->store.gid
    },
    // Collection source - fetch up to 16, let component limit based on maxProducts
    source == "collection" => *[_type == "product" && references(^.collection._ref) && !store.isDeleted && store.status == "active"][0...16]${productCardFields},
    // Tag source
    source == "tag" => *[_type == "product" && ^.tag in store.tags && !store.isDeleted && store.status == "active"][0...16]${productCardFields},
    // Featured source
    source == "featured" => *[_type == "product" && "featured" in store.tags && !store.isDeleted && store.status == "active"][0...16]${productCardFields}
  )
}`;

// Featured Product - Highlight a single product
const featuredProductProjection = `{
  _type,
  _key,
  badge,
  "productName": product->store.title,
  "productSlug": product->store.slug.current,
  "description": coalesce(descriptionOverride, product->store.description),
  "price": product->store.priceRange.minVariantPrice,
  "compareAtPrice": product->store.priceRange.maxVariantPrice,
  "image": { "src": product->store.previewImageUrl, "alt": product->store.title, "width": 800, "height": 800 },
  "inStock": product->store.status == "active" && !product->store.isDeleted,
  features[]{ icon, text },
  ctaText,
  ctaLink,
  imagePosition,
  spacing,
  backgroundColor
}`;

// Collection Grid - Display product collections
// Note: productCount is not available via GROQ as Shopify sync doesn't include collection membership
const collectionGridProjection = `{
  _type,
  _key,
  badge,
  heading,
  subheading,
  columns,
  spacing,
  backgroundColor,
  "collections": collections[]{
    _key,
    "name": collection->store.title,
    "slug": collection->store.slug.current,
    "description": coalesce(displayOverrides.descriptionOverride, collection->store.descriptionHtml),
    "image": { "src": collection->store.imageUrl, "alt": collection->store.title }
  }
}`;

// Related Products - Show related items
const relatedProductsProjection = `{
  _type,
  _key,
  heading,
  source,
  maxProducts,
  layout,
  spacing,
  backgroundColor,
  // Manual selection - dereference each product
  "products": select(
    source == "manual" || source == null => products[]{
      _key,
      "name": product->store.title,
      "slug": product->store.slug.current,
      "price": product->store.priceRange.minVariantPrice,
      "compareAtPrice": product->store.priceRange.maxVariantPrice,
      "image": { "src": product->store.previewImageUrl, "alt": product->store.title },
      "availableForSale": product->store.status == "active" && !product->store.isDeleted,
      "badge": displayOverrides.badge,
      "firstVariantId": product->store.variants[0]->store.gid
    },
    // For sameCollection/sameTags, these require context from the current product page
    // The component will handle fetching based on current product context
    []
  )
}`;

// Recently Viewed - User's recently viewed products (client-side, minimal projection)
const recentlyViewedProjection = `{
  _type,
  _key,
  heading,
  maxItems,
  storageKey,
  spacing,
  backgroundColor
}`;

// Trust Badges - Display trust signals
const trustBadgesProjection = `{
  _type,
  _key,
  heading,
  badges[]{ icon, text, description },
  layout,
  variant,
  spacing,
  backgroundColor
}`;

/**
 * Combined module projection that handles all module types
 * Uses select() to apply the correct projection based on _type
 */
export const moduleProjection = `{
  _type,
  _key,
  // Select the appropriate fields based on module type
  _type == "heroDefault" => ${heroDefaultProjection},
  _type == "heroCentered" => ${heroCenteredProjection},
  _type == "heroSplit" => ${heroSplitProjection},
  _type == "heroVideo" => ${heroVideoProjection},
  _type == "heroMinimal" => ${heroMinimalProjection},
  _type == "featuresGrid" => ${featuresGridProjection},
  _type == "featuresAlternating" => ${featuresAlternatingProjection},
  _type == "featuresIconCards" => ${featuresIconCardsProjection},
  _type == "pricingCards" => ${pricingCardsProjection},
  _type == "pricingComparison" => ${pricingComparisonProjection},
  _type == "pricingSimple" => ${pricingSimpleProjection},
  _type == "testimonialsGrid" => ${testimonialsGridProjection},
  _type == "testimonialsCarousel" => ${testimonialsCarouselProjection},
  _type == "testimonialsFeatured" => ${testimonialsFeaturedProjection},
  _type == "testimonialsCarouselLarge" => ${testimonialsCarouselLargeProjection},
  _type == "teamGrid" => ${teamGridProjection},
  _type == "teamCards" => ${teamCardsProjection},
  _type == "teamCompact" => ${teamCompactProjection},
  _type == "cta.default" => ${ctaDefaultProjection},
  _type == "cta.newsletter" => ${ctaNewsletterProjection},
  _type == "cta.split" => ${ctaSplitProjection},
  _type == "cta.banner" => ${ctaBannerProjection},
  _type == "cta.stats" => ${ctaStatsProjection},
  _type == "socialProof.logos" => ${socialProofLogosProjection},
  _type == "socialProof.stats" => ${socialProofStatsProjection},
  _type == "logoCloudSimple" => ${logoCloudSimpleProjection},
  _type == "logoCloudMarquee" => ${logoCloudMarqueeProjection},
  _type == "logoCloudGrid" => ${logoCloudGridProjection},
  _type == "faqAccordion" => ${faqAccordionProjection},
  _type == "faqTwoColumn" => ${faqTwoColumnProjection},
  _type == "faqWithCategories" => ${faqWithCategoriesProjection},
  _type == "faqSimple" => ${faqSimpleProjection},
  _type == "galleryGrid" => ${galleryGridProjection},
  _type == "galleryMasonry" => ${galleryMasonryProjection},
  _type == "galleryCarousel" => ${galleryCarouselProjection},
  _type == "blogFeaturedPost" => ${blogFeaturedPostProjection},
  _type == "blogGrid" => ${blogGridProjection},
  _type == "blogList" => ${blogListProjection},
  _type == "blogCarousel" => ${blogCarouselProjection},
  _type == "blogMinimal" => ${blogMinimalProjection},
  _type == "formContact" => ${formContactProjection},
  _type == "formNewsletter" => ${formNewsletterProjection},
  _type == "formWithImage" => ${formWithImageProjection},
  _type == "formMultiStep" => ${formMultiStepProjection},
  _type == "formDynamic" => ${formDynamicProjection},
  _type == "awards" => ${awardsProjection},
  _type == "pressMentions" => ${pressMentionsProjection},
  _type == "caseStudyCards" => ${caseStudyCardsProjection},
  _type == "integrationGrid" => ${integrationGridProjection},
  _type == "richTextBlock" => ${richTextBlockProjection},
  _type == "quote" => ${quoteProjection},
  _type == "statsCounter" => ${statsCounterProjection},
  _type == "comparisonTable" => ${comparisonTableProjection},
  _type == "videoEmbed" => ${videoEmbedProjection},
  _type == "beforeAfter" => ${beforeAfterProjection},
  _type == "codeBlock" => ${codeBlockProjection},
  _type == "embedBlock" => ${embedBlockProjection},
  _type == "tabs" => ${tabsProjection},
  _type == "accordion" => ${accordionProjection},
  _type == "steps" => ${stepsProjection},
  _type == "timeline" => ${timelineProjection},
  _type == "announcementBar" => ${announcementBarProjection},
  _type == "countdown" => ${countdownProjection},
  _type == "stickyCta" => ${stickyCtaProjection},
  _type == "modal" => ${modalProjection},
  _type == "spacer" => ${spacerProjection},
  _type == "anchorPoint" => ${anchorPointProjection},
  _type == "banner" => ${bannerProjection},
  _type == "downloadCards" => ${downloadCardsProjection},
  _type == "multiColumn" => ${multiColumnProjection},
  // E-commerce modules
  _type == "productHero" => ${productHeroProjection},
  _type == "productGrid" => ${productGridProjection},
  _type == "productCarousel" => ${productCarouselProjection},
  _type == "featuredProduct" => ${featuredProductProjection},
  _type == "collectionGrid" => ${collectionGridProjection},
  _type == "relatedProducts" => ${relatedProductsProjection},
  _type == "recentlyViewed" => ${recentlyViewedProjection},
  _type == "trustBadges" => ${trustBadgesProjection}
}`;

// Export individual projections for reuse
export const moduleProjections = {
  // Hero
  heroDefault: heroDefaultProjection,
  heroCentered: heroCenteredProjection,
  heroSplit: heroSplitProjection,
  heroVideo: heroVideoProjection,
  heroMinimal: heroMinimalProjection,
  // Features
  featuresGrid: featuresGridProjection,
  featuresAlternating: featuresAlternatingProjection,
  featuresIconCards: featuresIconCardsProjection,
  // Pricing
  pricingCards: pricingCardsProjection,
  pricingComparison: pricingComparisonProjection,
  pricingSimple: pricingSimpleProjection,
  // Testimonials
  testimonialsGrid: testimonialsGridProjection,
  testimonialsCarousel: testimonialsCarouselProjection,
  testimonialsFeatured: testimonialsFeaturedProjection,
  testimonialsCarouselLarge: testimonialsCarouselLargeProjection,
  // Team
  teamGrid: teamGridProjection,
  teamCards: teamCardsProjection,
  teamCompact: teamCompactProjection,
  // CTA
  ctaDefault: ctaDefaultProjection,
  ctaNewsletter: ctaNewsletterProjection,
  ctaSplit: ctaSplitProjection,
  ctaBanner: ctaBannerProjection,
  ctaStats: ctaStatsProjection,
  // Social Proof
  socialProofLogos: socialProofLogosProjection,
  socialProofStats: socialProofStatsProjection,
  // Logo Cloud
  logoCloudSimple: logoCloudSimpleProjection,
  logoCloudMarquee: logoCloudMarqueeProjection,
  logoCloudGrid: logoCloudGridProjection,
  // FAQ
  faqAccordion: faqAccordionProjection,
  faqTwoColumn: faqTwoColumnProjection,
  faqWithCategories: faqWithCategoriesProjection,
  faqSimple: faqSimpleProjection,
  // Gallery
  galleryGrid: galleryGridProjection,
  galleryMasonry: galleryMasonryProjection,
  galleryCarousel: galleryCarouselProjection,
  // Blog Feature
  blogFeaturedPost: blogFeaturedPostProjection,
  blogGrid: blogGridProjection,
  blogList: blogListProjection,
  blogCarousel: blogCarouselProjection,
  blogMinimal: blogMinimalProjection,
  // Form
  formContact: formContactProjection,
  formNewsletter: formNewsletterProjection,
  formWithImage: formWithImageProjection,
  formMultiStep: formMultiStepProjection,
  formDynamic: formDynamicProjection,
  // Trust
  awards: awardsProjection,
  pressMentions: pressMentionsProjection,
  caseStudyCards: caseStudyCardsProjection,
  integrationGrid: integrationGridProjection,
  // Content
  richTextBlock: richTextBlockProjection,
  quote: quoteProjection,
  statsCounter: statsCounterProjection,
  comparisonTable: comparisonTableProjection,
  // Media
  videoEmbed: videoEmbedProjection,
  beforeAfter: beforeAfterProjection,
  codeBlock: codeBlockProjection,
  embedBlock: embedBlockProjection,
  // Interactive
  tabs: tabsProjection,
  accordion: accordionProjection,
  steps: stepsProjection,
  timeline: timelineProjection,
  // Engagement
  announcementBar: announcementBarProjection,
  countdown: countdownProjection,
  stickyCta: stickyCtaProjection,
  modal: modalProjection,
  // Utility
  spacer: spacerProjection,
  anchorPoint: anchorPointProjection,
  banner: bannerProjection,
  downloadCards: downloadCardsProjection,
  multiColumn: multiColumnProjection,
  // E-commerce
  productHero: productHeroProjection,
  productGrid: productGridProjection,
  productCarousel: productCarouselProjection,
  featuredProduct: featuredProductProjection,
  collectionGrid: collectionGridProjection,
  relatedProducts: relatedProductsProjection,
  recentlyViewed: recentlyViewedProjection,
  trustBadges: trustBadgesProjection,
};

// Export shared fields for use in other queries
export const sharedFields = {
  button: buttonFields,
  image: imageFields,
  spacing: spacingRef,
  backgroundColor: backgroundColorRef,
  formFields: formFieldsProjection,
};
