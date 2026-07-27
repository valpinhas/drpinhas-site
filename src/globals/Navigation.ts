import { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'mainNav',
      type: 'array',
      label: 'Main Navigation',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Internal path (e.g. /about) or external URL.',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown Items',
          admin: {
            description: 'Optional sub-links that appear on hover.',
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
      defaultValue: [
        {
          label: 'Treatment Specialties',
          url: '/treatment-specialties',
          children: [
            { label: 'Psychoanalytic Psychotherapy', url: '/psychoanalytic-psychotherapy' },
            { label: 'Sexual Therapy', url: '/sex-therapy' },
            { label: 'Addiction Therapy', url: '/addiction-therapy' },
          ],
        },
        { label: 'Treatment Perspectives', url: '/treatment-perspectives' },
        { label: 'About Me', url: '/about' },
        { label: 'Fees', url: '/fees' },
        { label: 'Contact/Location', url: '/contact' },
        { label: 'Links', url: '/links' },
        { label: 'Disclaimer', url: '/disclaimer' },
      ],
    },
    {
      name: 'footerNav',
      type: 'array',
      label: 'Footer Navigation',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
      defaultValue: [
        { label: 'About', url: '/about' },
        { label: 'Services', url: '/services' },
        { label: 'Treatment Specialties', url: '/treatment-specialties' },
        { label: 'Sex Therapy', url: '/sex-therapy' },
        { label: 'Psychoanalytic Psychotherapy', url: '/psychoanalytic-psychotherapy' },
        { label: 'Addiction Therapy', url: '/addiction-therapy' },
        { label: 'Treatment Perspectives', url: '/treatment-perspectives' },
        { label: 'Fees & Insurance', url: '/fees' },
        { label: 'Blog', url: '/blog' },
        { label: 'Q&A', url: '/answers' },
        { label: 'Links', url: '/links' },
        { label: 'Contact', url: '/contact' },
        { label: 'Disclaimer', url: '/disclaimer' },
      ],
    },
  ],
}
