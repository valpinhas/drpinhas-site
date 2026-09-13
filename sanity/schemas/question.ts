import { defineField, defineType } from 'sanity'

export const question = defineType({
  name: 'question',
  title: 'Questions',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      description: "The visitor's question.",
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Sex Therapy', value: 'sex-therapy' },
          { title: 'Couples Therapy', value: 'couples-therapy' },
          { title: 'Addictions', value: 'addictions' },
          { title: 'Psychotherapy', value: 'psychotherapy' },
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'general',
    }),
    defineField({
      name: 'submittedBy',
      title: 'Submitted By',
      description: 'Optional name from the visitor.',
      type: 'string',
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      description: 'Write an answer to publish this question on the Answers page.',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'answeredAt',
      title: 'Answered At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'isAnonymous',
      title: 'Keep Anonymous',
      description: 'If checked, the submitter name is hidden on the public site.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
    },
  },
})
