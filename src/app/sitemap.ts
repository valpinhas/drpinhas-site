import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Only include pages that are NOT CMS-managed (those come from the pages query below)
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/answers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/ask`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  // All queries run against Sanity. If Sanity is unreachable the
  // sanityFetch helper returns null and we fall back to static pages only.
  const [posts, services, pages] = await Promise.all([
    sanityFetch(`*[_type == "post" && slug.current != null] | order(publishedAt desc) {
      "url": slug.current, "lastModified": coalesce(publishedAt, _updatedAt)
    }`),
    sanityFetch(`*[_type == "service" && slug.current != null] {
      "url": slug.current, "lastModified": _updatedAt
    }`),
    sanityFetch(`*[_type == "page" && slug.current != null] {
      "url": slug.current, "lastModified": _updatedAt
    }`),
  ])

  const postEntries: MetadataRoute.Sitemap = (posts || []).map((post: any) => ({
    url: `${siteUrl}/blog/${post.url}`,
    lastModified: new Date(post.lastModified),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const serviceEntries: MetadataRoute.Sitemap = (services || []).map((service: any) => ({
    url: `${siteUrl}/services/${service.url}`,
    lastModified: new Date(service.lastModified),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const pageEntries: MetadataRoute.Sitemap = (pages || []).map((page: any) => ({
    url: `${siteUrl}/${page.url}`,
    lastModified: new Date(page.lastModified),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...postEntries, ...serviceEntries, ...pageEntries]
}
