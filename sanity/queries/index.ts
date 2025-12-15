/**
 * Sanity GROQ Queries
 *
 * Centralized query exports organized by category.
 * All queries use explicit field projections to avoid over-querying.
 *
 * Usage:
 *   import { pageBySlugQuery, siteSettingsQuery } from '@/sanity/queries';
 *   // or import specific category
 *   import { allPostsQuery, postBySlugQuery } from '@/sanity/queries/posts';
 */

// Page queries
export {
  pageBySlugQuery,
  homepageQuery,
  allPageSlugsQuery,
  pageMetadataQuery,
  pagesBySlugArrayQuery,
  allPagesForSitemapQuery,
} from "./pages";

// Blog post queries
export {
  allPostsQuery,
  paginatedPostsQuery,
  postBySlugQuery,
  allPostSlugsQuery,
  postMetadataQuery,
  recentPostsQuery,
  postsByCategoryQuery,
  allPostsForSitemapQuery,
  postCountQuery,
  searchPostsQuery,
} from "./posts";

// Form queries
export {
  formConfigWithActionsQuery,
  formConfigByIdQuery,
  formConfigByIdentifierQuery,
  allFormIdentifiersQuery,
  allFormsSummaryQuery,
  formExistsByIdentifierQuery,
} from "./forms";

// Site settings queries
export {
  siteSettingsQuery,
  headerNavigationQuery,
  footerNavigationQuery,
  homepageReferenceQuery,
  siteMetadataQuery,
  socialLinksQuery,
} from "./settings";

// Subscriber queries
export {
  subscriberExistsQuery,
  subscriberCountQuery,
  activeSubscribersQuery,
  recentSubscribersQuery,
} from "./subscribers";

// Engagement queries
export {
  allActiveEngagementsQuery,
  engagementsForPageQuery,
  engagementsForHomepageQuery,
  engagementsForBlogQuery,
  engagementByIdQuery,
} from "./engagement";

// Customer queries
export {
  customerByShopifyIdQuery,
  customerByEmailQuery,
  customerWishlistQuery,
  customerRecentlyViewedQuery,
  customerAddressesQuery,
  customerAddressByIdQuery,
  customerCountQuery,
  recentCustomersQuery,
  customersWithWishlistQuery,
  customerPreferencesQuery,
} from "./customers";

// Product queries (Sanity-synced Shopify products)
export {
  allProductsQuery,
  productByHandleQuery,
  productsByHandlesQuery,
  productsByTypeQuery,
  productsByTagQuery,
  featuredProductsQuery,
  relatedProductsQuery,
  productCountQuery,
  allProductHandlesQuery,
} from "./products";

// Collection queries (Sanity-synced Shopify collections)
export {
  allCollectionsQuery,
  collectionByHandleQuery,
  allCollectionHandlesQuery,
} from "./collections";

// Module projections (for custom queries)
export { moduleProjection, moduleProjections, sharedFields } from "./modules";

// Query fetcher functions (use these in pages instead of sanityFetch directly)
export {
  // Types
  type SeoData,
  type PageData,
  type PostData,
  type PostListItem,
  type SiteSettings,
  // Page fetchers
  getHomepage,
  getPageBySlug,
  getPageMetadata,
  getAllPageSlugs,
  // Settings fetchers
  getSiteSettings,
  // Post fetchers
  getAllPosts,
  getPostBySlug,
  getAllPostSlugs,
  // Combined fetchers
  getHomepageWithSettings,
  getPageWithSettings,
  // Engagement fetchers
  type EngagementData,
  getEngagementsForPage,
  getEngagementsForHomepage,
  getEngagementsForBlog,
  getHomepageWithSettingsAndEngagement,
  getPageWithSettingsAndEngagement,
  // Blog layout fetcher
  getBlogLayoutData,
} from "./fetchers";
