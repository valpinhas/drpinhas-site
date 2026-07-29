import { notFound } from 'next/navigation'
import { getPublishedPages } from '@/lib/data'
import { getPayloadClient } from '@/lib/utils'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ProfileSidebar } from '@/components/layout/ProfileSidebar'

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const pages = await payload.find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 100,
    })
    return pages.docs.map((page: any) => ({ slug: page.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPublishedPages(slug)
  if (!page) return {}
  return {
    title: page.title,
    description: page.excerpt || `${page.title} — Dr. Valerie Pinhas`,
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      title: `${page.title} | Dr. Valerie Pinhas`,
      description: page.excerpt || `${page.title} — Dr. Valerie Pinhas`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`,
    },
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPublishedPages(slug)

  if (!page) notFound()

  const showSidebar = page.showSidebar !== false
  const layout = page.layout || 'standard'

  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">{page.title}</h1>
          {page.subtitle && (
            <p className="text-lg text-sage-600 prose-max">{page.subtitle}</p>
          )}
        </div>
      </section>

      <section className="section-padding">
        {layout === 'centered' ? (
          <div className="container-prose">
            <div className="prose-content text-left">
              <RichText data={page.content} />
            </div>
          </div>
        ) : layout === 'full-width' ? (
          <div className="container-wide">
            <div className="prose-content">
              <RichText data={page.content} />
            </div>
          </div>
        ) : showSidebar ? (
          <div className="container-wide grid gap-12 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="prose-content">
                <RichText data={page.content} />
              </div>
            </div>
            <ProfileSidebar />
          </div>
        ) : (
          <div className="container-wide">
            <div className="prose-content max-w-3xl">
              <RichText data={page.content} />
            </div>
          </div>
        )}
      </section>
    </>
  )
}
