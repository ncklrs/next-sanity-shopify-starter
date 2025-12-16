import { defineField, defineType } from 'sanity';
import ModulePickerInput from '../../components/ModulePickerInput';
import { IconPickerInput } from '../../components/IconPickerInput';

export const spacer = defineType({
  name: 'spacer',
  title: 'Spacer',
  type: 'object',
  fields: [
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
          { title: 'Extra Large', value: 'xlarge' },
        ],
      },
      initialValue: 'medium',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showDivider',
      title: 'Show Divider',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'dividerStyle',
      title: 'Divider Style',
      type: 'string',
      options: {
        list: [
          { title: 'Solid', value: 'solid' },
          { title: 'Dashed', value: 'dashed' },
          { title: 'Gradient', value: 'gradient' },
        ],
      },
      initialValue: 'solid',
      hidden: ({ parent }) => !parent?.showDivider,
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
      size: 'size',
      showDivider: 'showDivider',
    },
    prepare({ size, showDivider }) {
      return {
        title: 'Spacer',
        subtitle: `${size || 'medium'}${showDivider ? ' with divider' : ''}`,
      };
    },
  },
});

export const anchorPoint = defineType({
  name: 'anchorPoint',
  title: 'Anchor Point',
  type: 'object',
  fields: [
    defineField({
      name: 'id',
      title: 'Anchor ID',
      type: 'string',
      description: 'The anchor ID (e.g., "features") - used for navigation links',
      validation: (Rule) => Rule.required().regex(/^[a-z0-9-]+$/, {
        name: 'slug',
        invert: false,
      }).error('Must be lowercase letters, numbers, and hyphens only'),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'For CMS reference only - not rendered on the page',
    }),
  ],
  preview: {
    select: {
      id: 'id',
      label: 'label',
    },
    prepare({ id, label }) {
      return {
        title: label || id || 'Anchor Point',
        subtitle: `#${id || 'no-id'}`,
      };
    },
  },
});

export const banner = defineType({
  name: 'banner',
  title: 'Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Info', value: 'info' },
          { title: 'Warning', value: 'warning' },
          { title: 'Success', value: 'success' },
          { title: 'Error', value: 'error' },
        ],
      },
      initialValue: 'info',
      validation: (Rule) => Rule.required(),
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
        }),
      ],
    }),
    defineField({
      name: 'dismissible',
      title: 'Dismissible',
      type: 'boolean',
      description: 'Allow users to dismiss this banner',
      initialValue: true,
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Bordered', value: 'bordered' },
          { title: 'Filled', value: 'filled' },
        ],
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      message: 'message',
      type: 'type',
    },
    prepare({ title, message, type }) {
      return {
        title: title || message || 'Banner',
        subtitle: `${type || 'info'} banner`,
      };
    },
  },
});

export const downloadCards = defineType({
  name: 'downloadCards',
  title: 'Download Cards',
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
      name: 'downloads',
      title: 'Downloads',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              description: 'Preview image or thumbnail',
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
              name: 'file',
              title: 'File',
              type: 'file',
              description: 'The downloadable file (upload)',
            }),
            defineField({
              name: 'fileUrl',
              title: 'File URL',
              type: 'url',
              description: 'Alternative to file upload - provide a direct URL',
            }),
            defineField({
              name: 'fileType',
              title: 'File Type',
              type: 'string',
              description: 'e.g., "PDF", "ZIP", "DOCX"',
              placeholder: 'PDF',
            }),
            defineField({
              name: 'fileSize',
              title: 'File Size',
              type: 'string',
              description: 'e.g., "2.4 MB"',
              placeholder: '2.4 MB',
            }),
            defineField({
              name: 'gated',
              title: 'Gated',
              type: 'boolean',
              description: 'Require email to download',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'fileType',
              media: 'image',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Download',
                subtitle: subtitle || 'File',
                media,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'List', value: 'list' },
          { title: 'Compact', value: 'compact' },
        ],
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [
          { title: '2 Columns', value: 2 },
          { title: '3 Columns', value: 3 },
          { title: '4 Columns', value: 4 },
        ],
      },
      initialValue: 3,
      hidden: ({ parent }) => parent?.variant !== 'grid',
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
      title: 'title',
      downloadCount: 'downloads.length',
    },
    prepare({ title, downloadCount }) {
      return {
        title: title || 'Download Cards',
        subtitle: `${downloadCount || 0} download${downloadCount !== 1 ? 's' : ''}`,
      };
    },
  },
});

export const multiColumn = defineType({
  name: 'multiColumn',
  title: 'Multi-Column Layout',
  type: 'object',
  fields: [
    defineField({
      name: 'columns',
      title: 'Number of Columns',
      type: 'string',
      options: {
        list: [
          { title: '2 Columns', value: '2' },
          { title: '3 Columns', value: '3' },
          { title: '4 Columns', value: '4' },
        ],
        layout: 'radio',
      },
      initialValue: '2',
    }),
    defineField({
      name: 'columnGap',
      title: 'Column Gap',
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
      name: 'verticalAlignment',
      title: 'Vertical Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Top', value: 'start' },
          { title: 'Center', value: 'center' },
          { title: 'Bottom', value: 'end' },
          { title: 'Stretch', value: 'stretch' },
        ],
      },
      initialValue: 'start',
    }),
    defineField({
      name: 'columnContent',
      title: 'Column Content',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'column',
          title: 'Column',
          fields: [
            defineField({
              name: 'width',
              title: 'Column Width',
              type: 'string',
              description: 'Relative width (leave empty for equal widths)',
              options: {
                list: [
                  { title: 'Auto (Equal)', value: 'auto' },
                  { title: 'Narrow (1/4)', value: 'narrow' },
                  { title: 'Medium (1/3)', value: 'medium' },
                  { title: 'Wide (1/2)', value: 'wide' },
                  { title: 'Full (2/3)', value: 'full' },
                ],
              },
              initialValue: 'auto',
            }),
            defineField({
              name: 'modules',
              title: 'Modules',
              type: 'array',
              of: [
                // Content modules
                { type: 'richTextBlock' },
                { type: 'quote' },
                { type: 'statsCounter' },
                // Media modules
                { type: 'videoEmbed' },
                { type: 'codeBlock' },
                { type: 'beforeAfter' },
                // Interactive
                { type: 'tabs' },
                { type: 'accordion' },
                { type: 'steps' },
                { type: 'timeline' },
                // CTA
                { type: 'cta.default' },
                { type: 'cta.newsletter' },
                // Trust
                { type: 'awards' },
                { type: 'integrationGrid' },
                // Forms
                { type: 'formContact' },
                { type: 'formNewsletter' },
                // Utility
                { type: 'spacer' },
              ],
              components: {
                input: ModulePickerInput,
              },
            }),
          ],
          preview: {
            select: {
              modules: 'modules',
              width: 'width',
            },
            prepare({ modules, width }) {
              return {
                title: `Column (${width || 'auto'})`,
                subtitle: `${modules?.length || 0} modules`,
              }
            },
          },
        },
      ],
      validation: (rule) => rule.max(4).error('Maximum 4 columns allowed'),
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
    defineField({
      name: 'reverseOnMobile',
      title: 'Reverse Order on Mobile',
      type: 'boolean',
      description: 'Reverse the column order when stacked on mobile',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      columns: 'columns',
      content: 'columnContent',
    },
    prepare({ columns, content }) {
      return {
        title: `${columns || 2}-Column Layout`,
        subtitle: `${content?.length || 0} columns configured`,
      }
    },
  },
});

export const utilitySchemas = [spacer, anchorPoint, banner, downloadCards, multiColumn];
