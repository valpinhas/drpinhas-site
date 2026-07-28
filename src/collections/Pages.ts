import { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', '_status'],
    preview: (doc) => {
      if (!doc?.slug) return null
      return `${process.env.NEXT_PUBLIC_SITE_URL}/${doc.slug}`
    },
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
        description: 'The URL path, e.g. "about" makes the page available at /about',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Tagline shown below the page title.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary used for SEO and previews.',
        position: 'sidebar',
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
      name: 'showSidebar',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Show the profile sidebar on this page.',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard (content + sidebar)', value: 'standard' },
        { label: 'Centered (no sidebar)', value: 'centered' },
        { label: 'Full Width (no sidebar)', value: 'full-width' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Controls the page layout.',
      },
    },
  ],
}
