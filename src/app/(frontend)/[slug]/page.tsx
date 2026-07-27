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
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPublishedPages(slug)

  if (!page) notFound()

  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl text-sage-900">{page.title}</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="prose-content">
              <RichText data={page.content} />
            </div>
          </div>

          <ProfileSidebar />
        </div>
      </section>
    </>
  )
}
