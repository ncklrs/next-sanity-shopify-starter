import { defineField, defineType, defineArrayMember } from 'sanity';
import { IconPickerInput } from '../../components/IconPickerInput';

// Announcement Bar - Top page banner
export const announcementBar = defineType({
  name: 'announcementBar',
  title: 'Announcement Bar',
  type: 'object',
  fields: [
    defineField({
      name: 'message',
      title: 'Message',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Link Text',
          type: 'string',
        }),
        defineField({
          name: 'url',
          title: 'URL',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              allowRelative: true,
              scheme: ['http', 'https', 'mailto', 'tel'],
            }),
        }),
      ],
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Select an icon',
      components: {
        input: IconPickerInput,
      },
    }),
    defineField({
      name: 'dismissible',
      title: 'Dismissible',
      type: 'boolean',
      description: 'Allow users to close the announcement',
      initialValue: true,
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Gradient', value: 'gradient' },
          { title: 'Highlight', value: 'highlight' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
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
          { title: 'Warning', value: 'warning' },
          { title: 'Success', value: 'success' },
          { title: 'Error', value: 'error' },
        ],
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: {
      title: 'message',
      variant: 'variant',
    },
    prepare({ title, variant }) {
      return {
        title: title || 'Announcement Bar',
        subtitle: `Variant: ${variant}`,
      };
    },
  },
});

// Countdown - Event countdown timer
export const countdown = defineType({
  name: 'countdown',
  title: 'Countdown Timer',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'targetDate',
      title: 'Target Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'expiredMessage',
      title: 'Expired Message',
      type: 'string',
      description: 'Message to display when countdown reaches zero',
      initialValue: 'This event has ended',
    }),
    defineField({
      name: 'showDays',
      title: 'Show Days',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showHours',
      title: 'Show Hours',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showMinutes',
      title: 'Show Minutes',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showSeconds',
      title: 'Show Seconds',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'button',
      title: 'Call to Action',
      type: 'simpleButton',
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Compact', value: 'compact' },
          { title: 'Hero', value: 'hero' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
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
          { title: 'Warning', value: 'warning' },
          { title: 'Success', value: 'success' },
          { title: 'Error', value: 'error' },
        ],
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      targetDate: 'targetDate',
      variant: 'variant',
    },
    prepare({ title, targetDate, variant }) {
      return {
        title: title || 'Countdown Timer',
        subtitle: `${variant} - ${targetDate ? new Date(targetDate).toLocaleDateString() : 'No date set'}`,
      };
    },
  },
});

// Sticky CTA - Fixed floating CTA button
export const stickyCta = defineType({
  name: 'stickyCta',
  title: 'Sticky CTA',
  type: 'object',
  description: 'Fixed position floating call-to-action button',
  fields: [
    defineField({
      name: 'text',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({
          allowRelative: true,
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Select an icon',
      components: {
        input: IconPickerInput,
      },
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
      options: {
        list: [
          { title: 'Bottom Right', value: 'bottom-right' },
          { title: 'Bottom Left', value: 'bottom-left' },
          { title: 'Bottom Center', value: 'bottom-center' },
        ],
        layout: 'radio',
      },
      initialValue: 'bottom-right',
    }),
    defineField({
      name: 'showAfterScroll',
      title: 'Show After Scroll',
      type: 'number',
      description: 'Number of pixels scrolled before showing the button',
      initialValue: 300,
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Button', value: 'button' },
          { title: 'Pill', value: 'pill' },
          { title: 'Expanded', value: 'expanded' },
        ],
        layout: 'radio',
      },
      initialValue: 'button',
    }),
  ],
  preview: {
    select: {
      title: 'text',
      position: 'position',
      variant: 'variant',
    },
    prepare({ title, position, variant }) {
      return {
        title: title || 'Sticky CTA',
        subtitle: `${variant} - ${position}`,
      };
    },
  },
});

// Modal - Popup/modal content (triggered)
export const modal = defineType({
  name: 'modal',
  title: 'Modal',
  type: 'object',
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'string',
      description: 'Unique identifier for triggering this modal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'formModule',
      title: 'Embedded Form',
      type: 'object',
      description: 'Optionally embed a form in the modal',
      fields: [
        defineField({
          name: 'formType',
          title: 'Form Type',
          type: 'string',
          options: {
            list: [
              { title: 'Contact Form', value: 'contact' },
              { title: 'Newsletter Form', value: 'newsletter' },
              { title: 'Custom Form', value: 'custom' },
            ],
          },
        }),
        defineField({
          name: 'customFields',
          title: 'Custom Form Fields',
          type: 'array',
          hidden: ({ parent }) => parent?.formType !== 'custom',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'name', title: 'Field Name', type: 'string' }),
                defineField({ name: 'label', title: 'Label', type: 'string' }),
                defineField({
                  name: 'type',
                  title: 'Field Type',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Text', value: 'text' },
                      { title: 'Email', value: 'email' },
                      { title: 'Phone', value: 'phone' },
                      { title: 'Textarea', value: 'textarea' },
                      { title: 'Select', value: 'select' },
                    ],
                  },
                }),
                defineField({ name: 'required', title: 'Required', type: 'boolean' }),
                defineField({ name: 'placeholder', title: 'Placeholder', type: 'string' }),
                defineField({
                  name: 'options',
                  title: 'Select Options',
                  type: 'array',
                  description: 'Options for select field (one per line)',
                  hidden: ({ parent }) => parent?.type !== 'select',
                  of: [{ type: 'string' }],
                }),
              ],
            },
          ],
        }),
        defineField({
          name: 'submitButtonText',
          title: 'Submit Button Text',
          type: 'string',
          initialValue: 'Submit',
        }),
        defineField({
          name: 'successMessage',
          title: 'Success Message',
          type: 'string',
          initialValue: 'Thank you for your submission!',
        }),
      ],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'button',
      title: 'Call to Action',
      type: 'simpleButton',
    }),
    defineField({
      name: 'trigger',
      title: 'Trigger',
      type: 'string',
      options: {
        list: [
          { title: 'Exit Intent', value: 'exit-intent' },
          { title: 'Time Delay', value: 'time-delay' },
          { title: 'Scroll Depth', value: 'scroll-depth' },
          { title: 'Manual', value: 'manual' },
        ],
        layout: 'radio',
      },
      initialValue: 'manual',
    }),
    defineField({
      name: 'triggerValue',
      title: 'Trigger Value',
      type: 'number',
      description: 'Seconds for time-delay, percentage (0-100) for scroll-depth',
      hidden: ({ parent }) =>
        parent?.trigger !== 'time-delay' && parent?.trigger !== 'scroll-depth',
    }),
    defineField({
      name: 'showOnce',
      title: 'Show Once',
      type: 'boolean',
      description: 'Only show this modal once per session',
      initialValue: false,
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Fullscreen', value: 'fullscreen' },
          { title: 'Slide In', value: 'slide-in' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      id: 'id',
      trigger: 'trigger',
      variant: 'variant',
    },
    prepare({ title, id, trigger, variant }) {
      return {
        title: title || id || 'Modal',
        subtitle: `${variant} - ${trigger}`,
      };
    },
  },
});

// Export all engagement schemas
export const engagementSchemas = [
  announcementBar,
  countdown,
  stickyCta,
  modal,
];
