import { defineField, defineType } from 'sanity'

const buttonFields = [
  defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
  defineField({ name: 'url', title: 'URL', type: 'string', validation: (rule) => rule.required() }),
  defineField({
    name: 'style',
    title: 'Style',
    type: 'string',
    options: {
      list: [
        { title: 'Primary', value: 'primary' },
        { title: 'Secondary', value: 'secondary' },
      ],
    },
    initialValue: 'secondary',
  }),
]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Long Island Sex Therapy',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'Dr. Valerie Pinhas',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      initialValue:
        'Dr. Valerie Pinhas is a sex therapist, psychoanalyst, and professor emeritus with over 50 years of experience serving the Long Island community.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'vlp@longislandsextherapy.com',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      initialValue: '(516) 482-8314',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      initialValue: 'Great Neck, Long Island, New York',
    }),
    defineField({
      name: 'officeHours',
      title: 'Office Hours',
      description: 'e.g. "Monday–Friday, 9am–6pm"',
      type: 'text',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          title: 'Social Link',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: ['LinkedIn', 'Facebook', 'Instagram', 'Twitter/X', 'YouTube'],
              },
              validation: (rule) => rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'string',
              validation: (rule) => rule.required(),
            },
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'licenseInfo',
      title: 'License Info',
      description: 'Professional license number(s) for the footer.',
      type: 'string',
    }),
    defineField({
      name: 'sidebarBio',
      title: 'Sidebar Bio',
      description: 'Bio text shown in the profile sidebar.',
      type: 'text',
      initialValue:
        'I am a therapist who has been practicing sexual therapy, addictions therapy as well as psychoanalytic psychotherapy and psychoanalysis for over 50 years.',
    }),
    defineField({
      name: 'sidebarButtons',
      title: 'Sidebar Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'sidebarButton',
          title: 'Button',
          fields: buttonFields,
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
