import { defineField, defineType } from 'sanity'

export const comment = defineType({
  name: 'comment',
  title: 'Comments',
  type: 'document',
  fields: [
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'post' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      description: 'The name of the person who wrote the comment.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'commentedAt',
      title: 'Commented At',
      type: 'datetime',
    }),
    defineField({
      name: 'isAuthorReply',
      title: 'Dr. Pinhas Reply',
      description: 'Check if this is a reply from Dr. Pinhas.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'parentComment',
      title: 'Parent Comment',
      description: 'If this is a reply to another comment, link it here.',
      type: 'reference',
      to: [{ type: 'comment' }],
    }),
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'content',
    },
  },
})
