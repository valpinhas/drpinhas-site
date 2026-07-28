import { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'heroHeading',
      type: 'text',
      defaultValue: 'Compassionate, confidential therapy for individuals and couples',
      admin: {
        description: 'Main heading displayed in the hero section.',
      },
    },
    {
      name: 'heroDescription',
      type: 'textarea',
      defaultValue:
        'Dr. Valerie Pinhas is a sex therapist, psychoanalyst, and professor emeritus with over 50 years of experience helping people find insight, relief, and growth.',
      admin: {
        description: 'Paragraph text below the hero heading. Falls back to the site description if empty.',
      },
    },
    {
      name: 'heroButtons',
      type: 'array',
      label: 'Hero Buttons',
      defaultValue: [
        { label: 'Schedule a Consultation', url: '/contact', style: 'primary' },
        { label: 'Learn About Dr. Pinhas', url: '/about', style: 'secondary' },
        { label: 'Read My Blog', url: '/blog', style: 'secondary' },
      ],
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'secondary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
        },
      ],
    },
    {
      name: 'welcomeHeading',
      type: 'text',
      defaultValue: 'Welcome',
    },
    {
      name: 'welcomeText',
      type: 'richText',
    },
    {
      name: 'welcomeLinkLabel',
      type: 'text',
      defaultValue: 'Read more about Dr. Pinhas',
    },
    {
      name: 'welcomeLinkUrl',
      type: 'text',
      defaultValue: '/about',
    },
    {
      name: 'qaHeading',
      type: 'text',
      defaultValue: 'Have a question?',
    },
    {
      name: 'qaText',
      type: 'textarea',
      defaultValue:
        'Feel free to ask a question and check out answers posted from other visitors and students.',
    },
    {
      name: 'qaButtons',
      type: 'array',
      label: 'Q&A Buttons',
      defaultValue: [
        { label: 'Ask a Question', url: '/ask', style: 'primary' },
        { label: 'Browse Answers', url: '/answers', style: 'secondary' },
      ],
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'secondary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
        },
      ],
    },
  ],
}
