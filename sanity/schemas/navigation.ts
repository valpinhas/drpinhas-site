import { defineField, defineType } from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'mainNav',
      title: 'Main Navigation',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          title: 'Nav Item',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              description: 'Internal path (e.g. /about) or external URL.',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'newTab',
              title: 'Open in New Tab',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'children',
              title: 'Dropdown Items',
              description: 'Optional sub-links that appear on hover.',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'navChild',
                  title: 'Dropdown Item',
                  fields: [
                    { name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() },
                    { name: 'url', title: 'URL', type: 'string', validation: (rule) => rule.required() },
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'url' },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'footerNav',
      title: 'Footer Navigation',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'footerNavItem',
          title: 'Footer Link',
          fields: [
            { name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() },
            { name: 'url', title: 'URL', type: 'string', validation: (rule) => rule.required() },
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Navigation' }),
  },
})
