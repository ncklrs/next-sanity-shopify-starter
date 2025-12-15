import {
  page,
  post,
  siteSettings,
  formSubmission,
  subscriber,
  form,
  engagement,
  customer,
  customerAddress,
} from "./documents";
import * as objects from "./objects";
import * as modules from "./modules";

export const schemaTypes = [
  // Documents
  page,
  post,
  siteSettings,
  formSubmission,
  subscriber,
  form,
  engagement,
  customer,
  customerAddress,
  // Objects
  ...Object.values(objects),
  // Modules
  ...Object.values(modules),
];
