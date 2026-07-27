import { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Long Island Sex Therapy',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Dr. Valerie Pinhas',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        'Dr. Valerie Pinhas is a sex therapist, psychoanalyst, and professor emeritus with over 30 years of experience serving the Long Island community.',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'contactEmail',
      type: 'email',
      required: true,
      defaultValue: 'vlp@longislandsextherapy.com',
    },
    {
      name: 'phoneNumber',
      type: 'text',
      defaultValue: '(516) 482-8314',
    },
    {
      name: 'address',
      type: 'textarea',
      defaultValue: 'Great Neck, Long Island, New York',
    },
    {
      name: 'officeHours',
      type: 'textarea',
      admin: {
        description: 'e.g. "Monday–Friday, 9am–6pm"',
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'select', options: ['LinkedIn', 'Facebook', 'Instagram', 'Twitter/X', 'YouTube'], required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'footerText',
      type: 'richText',
    },
    {
      name: 'licenseInfo',
      type: 'text',
      admin: {
        description: 'Professional license number(s) for the footer.',
      },
    },
  ],
}
