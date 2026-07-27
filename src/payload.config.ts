import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Services } from './collections/Services'
import { Questions } from './collections/Questions'
import { Comments } from './collections/Comments'
import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      beforeNavLinks: ['@/components/AdminNotice'],
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    Posts,
    Categories,
    Services,
    Questions,
    Comments,
  ],
  globals: [
    SiteSettings,
    Navigation,
  ],
  editor: lexicalEditor(),
  sharp,
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: false,
  }),
  plugins: [
    seoPlugin({
      collections: ['pages', 'posts', 'services'],
      globals: ['site-settings'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => doc.title || 'Dr. Valerie Pinhas — Long Island Sex Therapy',
      generateDescription: ({ doc }) => {
        if (doc.excerpt) return doc.excerpt
        if (doc.metaDescription) return doc.metaDescription
        return 'Dr. Valerie Pinhas, Long Island sex therapist with over 30 years of experience. Compassionate, confidential therapy for individuals and couples.'
      },
    }),
    redirectsPlugin({
      collections: ['pages', 'posts'],
    }),
    nestedDocsPlugin({
      collections: ['categories'],
      generateLabel: (doc: any) => doc.title || 'Untitled',
    }),
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: {
              [Media.slug]: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN || '',
          }),
        ]
      : []),
  ],
  async onInit(payload) {
    const existing = await payload.db.find({
      collection: 'users',
      limit: 1,
    })
    if (existing.docs.length === 0) {
      payload.logger.info('—')
      payload.logger.info('No users found. Visit /admin to create your first admin user.')
      payload.logger.info('—')
    }
  },
})
