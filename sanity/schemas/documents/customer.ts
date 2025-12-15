import { defineField, defineType } from "sanity";

export const customer = defineType({
  name: "customer",
  title: "Customer",
  type: "document",
  fields: [
    defineField({
      name: "shopifyCustomerId",
      title: "Shopify Customer ID",
      type: "string",
      description: "The unique Shopify customer ID (gid://shopify/Customer/...)",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
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
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "acceptsMarketing",
      title: "Accepts Marketing",
      type: "boolean",
      description: "Customer has opted in to receive marketing emails",
      initialValue: false,
    }),
    defineField({
      name: "wishlist",
      title: "Wishlist",
      type: "array",
      of: [{ type: "string" }],
      description: "Array of Shopify product handles in the customer's wishlist",
    }),
    defineField({
      name: "recentlyViewed",
      title: "Recently Viewed",
      type: "array",
      of: [{ type: "string" }],
      description: "Array of recently viewed product handles (most recent first)",
    }),
    defineField({
      name: "preferences",
      title: "Preferences",
      type: "object",
      fields: [
        defineField({
          name: "currency",
          title: "Preferred Currency",
          type: "string",
        }),
        defineField({
          name: "language",
          title: "Preferred Language",
          type: "string",
        }),
        defineField({
          name: "notifications",
          title: "Notification Preferences",
          type: "object",
          fields: [
            defineField({
              name: "orderUpdates",
              title: "Order Updates",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "promotions",
              title: "Promotional Emails",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "backInStock",
              title: "Back in Stock Alerts",
              type: "boolean",
              initialValue: true,
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "totalOrders",
      title: "Total Orders",
      type: "number",
      description: "Total number of orders placed",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "totalSpent",
      title: "Total Spent",
      type: "number",
      description: "Total amount spent (in cents)",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      description: "When the customer account was created in Shopify",
      readOnly: true,
    }),
    defineField({
      name: "lastLoginAt",
      title: "Last Login",
      type: "datetime",
      description: "When the customer last logged in",
    }),
  ],
  preview: {
    select: {
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
    },
    prepare({ firstName, lastName, email }) {
      const name = [firstName, lastName].filter(Boolean).join(" ");
      return {
        title: name || email,
        subtitle: name ? email : undefined,
      };
    },
  },
});
