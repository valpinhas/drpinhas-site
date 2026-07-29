import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServiceBySlug, getPublishedServices } from '@/lib/data'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ProfileSidebar } from '@/components/layout/ProfileSidebar'

export async function generateStaticParams() {
  try {
    const services = await getPublishedServices()
    return services.docs.map((service: any) => ({ slug: service.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}
  return {
    title: service.title,
    description: service.shortDescription,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title: `${service.title} | Dr. Valerie Pinhas`,
      description: service.shortDescription || '',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/${slug}`,
    },
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) notFound()

  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <Link href="/services" className="text-sm text-sage-500 hover:text-sage-700 mb-4 inline-block">
            &larr; All Services
          </Link>
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">{service.title}</h1>
          {service.shortDescription && (
            <p className="text-lg text-sage-600 prose-max">{service.shortDescription}</p>
          )}
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="prose-content">
              <RichText data={service.content} />
            </div>
          </div>

          <ProfileSidebar />
        </div>
      </section>
    </>
  )
}
