import { client } from "../../sanity/lib/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Re-export queries from centralized location
// This maintains backwards compatibility while using the new query structure
export {
  pageBySlugQuery as pageQuery,
  homepageQuery,
  siteSettingsQuery,
  shopSettingsQuery,
  hiddenProductHandlesQuery,
  getShopSettings,
  getHiddenProductHandles,
  getSanityProductByHandle,
  getSanityCollectionByHandle,
  type ShopSettings,
  type SanityProductData,
  type SanityCollectionData,
} from "../../sanity/queries";
