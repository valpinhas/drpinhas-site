import { defineField, defineType } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'Tagline shown below the page title.',
      type: 'string',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'Short summary used for SEO and previews.',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'showSidebar',
      title: 'Show Profile Sidebar',
      description: 'Show the profile sidebar on this page.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Standard (content + sidebar)', value: 'standard' },
          { title: 'Centered (no sidebar)', value: 'centered' },
          { title: 'Full Width (no sidebar)', value: 'full-width' },
        ],
        layout: 'radio',
      },
      initialValue: 'standard',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
})
