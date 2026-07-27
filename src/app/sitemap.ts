import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/answers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/ask`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${siteUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/fees`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${siteUrl}/links`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${siteUrl}/treatment-perspectives`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/psychoanalytic-psychotherapy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/sex-therapy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/addiction-therapy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/treatment-specialties`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  try {
    const payload = await getPayload({ config })

    // Blog posts
    const posts = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      limit: 100,
      sort: '-publishedAt',
    })

    const postEntries: MetadataRoute.Sitemap = posts.docs.map((post: any) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    // Services
    const services = await payload.find({
      collection: 'services',
      where: { _status: { equals: 'published' } },
      limit: 50,
    })

    const serviceEntries: MetadataRoute.Sitemap = services.docs.map((service: any) => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified: service.updatedAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    // CMS pages
    const pages = await payload.find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 50,
    })

    const pageEntries: MetadataRoute.Sitemap = pages.docs.map((page: any) => ({
      url: `${siteUrl}/${page.slug}`,
      lastModified: page.updatedAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    }))

    return [...staticPages, ...postEntries, ...serviceEntries, ...pageEntries]
  } catch {
    return staticPages
  }
}
