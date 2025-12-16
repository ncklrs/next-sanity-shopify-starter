import {
  page,
  post,
  siteSettings,
  shopSettings,
  formSubmission,
  subscriber,
  form,
  engagement,
  customer,
  customerAddress,
  // Shopify synced documents
  product,
  productVariant,
  collection,
} from "./documents";
import * as objects from "./objects";
import * as modules from "./modules";

export const schemaTypes = [
  // Documents
  page,
  post,
  siteSettings,
  shopSettings,
  formSubmission,
  subscriber,
  form,
  engagement,
  customer,
  customerAddress,
  // Shopify synced documents
  product,
  productVariant,
  collection,
  // Objects
  ...Object.values(objects),
  // Modules
  ...Object.values(modules),
];
