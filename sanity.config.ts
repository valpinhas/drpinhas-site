import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

// Env vars (NEXT_PUBLIC_* are inlined by Next.js for the embedded Studio):
//   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'drpinhas-site',
  title: 'Dr. Pinhas — Site Content',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('post').title('Blog Posts'),
            S.documentTypeListItem('comment').title('Comments'),
            S.documentTypeListItem('question').title('Questions'),
            S.divider(),
            S.documentTypeListItem('page').title('Pages'),
            S.documentTypeListItem('service').title('Services'),
            S.documentTypeListItem('category').title('Categories'),
            S.divider(),
            S.documentTypeListItem('homepage').title('Homepage'),
            S.documentTypeListItem('siteSettings').title('Site Settings'),
            S.documentTypeListItem('navigation').title('Navigation'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
