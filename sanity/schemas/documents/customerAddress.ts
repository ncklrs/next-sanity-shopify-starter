import { defineField, defineType } from "sanity";

export const customerAddress = defineType({
  name: "customerAddress",
  title: "Customer Address",
  type: "document",
  fields: [
    defineField({
      name: "customer",
      title: "Customer",
      type: "reference",
      to: [{ type: "customer" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shopifyAddressId",
      title: "Shopify Address ID",
      type: "string",
      description: "The unique Shopify address ID",
      readOnly: true,
    }),
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "address1",
      title: "Address Line 1",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address2",
      title: "Address Line 2",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "province",
      title: "Province/State",
      type: "string",
    }),
    defineField({
      name: "provinceCode",
      title: "Province/State Code",
      type: "string",
      description: "Two-letter code (e.g., CA, NY)",
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "countryCode",
      title: "Country Code",
      type: "string",
      description: "Two-letter ISO country code (e.g., US, CA)",
    }),
    defineField({
      name: "zip",
      title: "ZIP/Postal Code",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "isDefault",
      title: "Default Address",
      type: "boolean",
      description: "Is this the customer's default address?",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      address1: "address1",
      city: "city",
      country: "country",
      isDefault: "isDefault",
      customerName: "customer.firstName",
    },
    prepare({ address1, city, country, isDefault, customerName }) {
      return {
        title: `${address1 || "No address"}${isDefault ? " (Default)" : ""}`,
        subtitle: [city, country].filter(Boolean).join(", "),
      };
    },
  },
});
