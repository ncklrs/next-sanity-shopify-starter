import { defineField, defineType } from 'sanity'

/**
 * Account Login Module
 * A customizable login block that can be placed on any page.
 * Uses Shopify Customer Account API OAuth flow.
 */
export const accountLogin = defineType({
  name: 'account.login',
  title: 'Account - Login Block',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Sign in to your account',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
      initialValue: 'Access your orders, wishlist, and account settings',
    }),
    defineField({
      name: 'buttonText',
      title: 'Login Button Text',
      type: 'string',
      initialValue: 'Continue with Shopify',
    }),
    defineField({
      name: 'showBenefits',
      title: 'Show Benefits List',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ parent }) => !parent?.showBenefits,
      initialValue: [
        'Track your orders and view order history',
        'Save items to your wishlist',
        'Faster checkout with saved addresses',
        'Exclusive member offers and early access',
      ],
    }),
    defineField({
      name: 'benefitsHeading',
      title: 'Benefits Section Heading',
      type: 'string',
      initialValue: 'Benefits of signing in',
      hidden: ({ parent }) => !parent?.showBenefits,
    }),
    defineField({
      name: 'securityNote',
      title: 'Security Note',
      type: 'string',
      description: 'Small text below login form for security information',
      initialValue: 'Your account is securely managed by Shopify. We never store your password.',
    }),
    defineField({
      name: 'returnTo',
      title: 'Redirect After Login',
      type: 'string',
      description: 'Path to redirect to after successful login (e.g., /account)',
      initialValue: '/account',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Centered', value: 'centered' },
          { title: 'Card', value: 'card' },
          { title: 'Split', value: 'split' },
        ],
        layout: 'radio',
      },
      initialValue: 'centered',
    }),
    defineField({
      name: 'image',
      title: 'Side Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
      hidden: ({ parent }) => parent?.layout !== 'split',
      description: 'Image displayed on the side (only for Split layout)',
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'right',
      hidden: ({ parent }) => parent?.layout !== 'split',
    }),
    defineField({
      name: 'spacing',
      title: 'Spacing',
      type: 'string',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Muted', value: 'muted' },
          { title: 'Accent', value: 'accent' },
        ],
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      layout: 'layout',
    },
    prepare({ title, layout }) {
      return {
        title: title || 'Account - Login Block',
        subtitle: `Layout: ${layout || 'centered'}`,
      }
    },
  },
})
