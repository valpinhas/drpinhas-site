import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

// Locally:  SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET come from .env.local or shell.
// On Vercel: set them in the project's environment variables.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

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
