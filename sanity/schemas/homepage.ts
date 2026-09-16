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

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      description: 'Main heading displayed in the hero section.',
      type: 'string',
      initialValue: 'Compassionate, confidential therapy for individuals and couples',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      description: 'Paragraph text below the hero heading. Falls back to the site description if empty.',
      type: 'text',
      initialValue:
        'Dr. Valerie Pinhas is a sex therapist, psychoanalyst, and professor emeritus with over 50 years of experience helping people find insight, relief, and growth.',
    }),
    defineField({
      name: 'heroButtons',
      title: 'Hero Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'heroButton',
          title: 'Button',
          fields: buttonFields,
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        },
      ],
      initialValue: [
        { label: 'Schedule a Consultation', url: '/contact', style: 'primary' },
        { label: 'Learn About Dr. Pinhas', url: '/about', style: 'secondary' },
        { label: 'Read My Blog', url: '/blog', style: 'secondary' },
      ],
    }),
    defineField({
      name: 'welcomeHeading',
      title: 'Welcome Heading',
      type: 'string',
      initialValue: 'Welcome',
    }),
    defineField({
      name: 'welcomeText',
      title: 'Welcome Text',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'welcomeLinkLabel',
      title: 'Welcome Link Label',
      type: 'string',
      initialValue: 'Read more about Dr. Pinhas',
    }),
    defineField({
      name: 'welcomeLinkUrl',
      title: 'Welcome Link URL',
      type: 'string',
      initialValue: '/about',
    }),
    defineField({
      name: 'qaHeading',
      title: 'Q&A Heading',
      type: 'string',
      initialValue: 'Have a question?',
    }),
    defineField({
      name: 'qaText',
      title: 'Q&A Text',
      type: 'text',
      initialValue:
        'Feel free to ask a question and check out answers posted from other visitors and students.',
    }),
    defineField({
      name: 'qaButtons',
      title: 'Q&A Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'qaButton',
          title: 'Button',
          fields: buttonFields,
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        },
      ],
      initialValue: [
        { label: 'Ask a Question', url: '/ask', style: 'primary' },
        { label: 'Browse Answers', url: '/answers', style: 'secondary' },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Homepage' }),
  },
})
