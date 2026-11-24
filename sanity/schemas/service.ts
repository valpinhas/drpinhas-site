import { defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Services',
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
      name: 'icon',
      title: 'Icon',
      description: 'Icon shown next to the service title.',
      type: 'string',
      options: {
        list: [
          { title: 'Heart', value: 'heart' },
          { title: 'Users', value: 'users' },
          { title: 'Brain', value: 'brain' },
          { title: 'Shield', value: 'shield' },
          { title: 'Book Open', value: 'book-open' },
          { title: 'Message Circle', value: 'message-circle' },
          { title: 'Hand', value: 'hand' },
          { title: 'Sparkles', value: 'sparkles' },
        ],
      },
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      description: 'One or two sentences shown on the services overview.',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
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
      name: 'order',
      title: 'Order',
      description: 'Lower numbers appear first.',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'shortDescription',
    },
  },
})
