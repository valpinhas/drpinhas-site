import { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'icon', '_status'],
  },
  versions: {
    drafts: {
      autosave: { interval: 200 },
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        _status: { equals: 'published' },
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'icon',
      type: 'select',
      options: [
        { label: 'Heart', value: 'heart' },
        { label: 'Users', value: 'users' },
        { label: 'Brain', value: 'brain' },
        { label: 'Shield', value: 'shield' },
        { label: 'Book Open', value: 'book-open' },
        { label: 'Message Circle', value: 'message-circle' },
        { label: 'Hand', value: 'hand' },
        { label: 'Sparkles', value: 'sparkles' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Icon shown next to the service title.',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      admin: {
        description: 'One or two sentences shown on the services overview.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
  ],
}
