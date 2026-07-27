import { CollectionConfig, Where } from 'payload'

export const Questions: CollectionConfig = {
  slug: 'questions',
  admin: {
    useAsTitle: 'question',
    group: 'Q&A',
    defaultColumns: ['question', 'status', 'category', 'createdAt'],
    description: 'Questions submitted by visitors. Answer them to publish on the Answers page.',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      const where: Where = {
        and: [
          { _status: { equals: 'published' } },
          { answer: { exists: true } },
        ],
      }
      return where
    },
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  versions: {
    drafts: {
      autosave: { interval: 200 },
    },
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: 'Question',
      admin: {
        description: 'The visitor\'s question.',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Sex Therapy', value: 'sex-therapy' },
        { label: 'Couples Therapy', value: 'couples-therapy' },
        { label: 'Addictions', value: 'addictions' },
        { label: 'Psychotherapy', value: 'psychotherapy' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'general',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'submittedBy',
      type: 'text',
      label: 'Submitted By',
      admin: {
        description: 'Optional name from the visitor.',
        position: 'sidebar',
      },
    },
    {
      name: 'answer',
      type: 'richText',
      label: 'Answer',
      admin: {
        description: 'Write an answer to publish this question on the Answers page.',
      },
    },
    {
      name: 'answeredAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data?.answer && data?._status === 'published') {
              return new Date().toISOString()
            }
            return data?.answeredAt
          },
        ],
      },
    },
    {
      name: 'isAnonymous',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'If checked, the submitter name is hidden on the public site.',
      },
    },
  ],
}
