import Link from 'next/link'
import { Heart, Users, Brain, Shield, BookOpen, MessageCircle, Hand, Sparkles } from 'lucide-react'
import { getPublishedServices } from '@/lib/data'

export const metadata = {
  title: 'Services',
  description: 'Sex therapy, couples therapy, psychotherapy, and addictions therapy services offered by Dr. Valerie Pinhas on Long Island.',
  alternates: {
    canonical: '/services',
  },
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  heart: Heart,
  users: Users,
  brain: Brain,
  shield: Shield,
  'book-open': BookOpen,
  'message-circle': MessageCircle,
  hand: Hand,
  sparkles: Sparkles,
}

export default async function ServicesPage() {
  const services = await getPublishedServices()

  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">Services</h1>
          <p className="text-lg text-sage-600 prose-max">
            Individualized therapy services delivered with warmth, respect, and complete confidentiality.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          {services.docs.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2">
              {services.docs.map((service: any) => {
                const Icon = iconMap[service.icon] || Heart
                return (
                  <article key={service.id} className="card p-6">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center shrink-0">
                        <Icon size={28} className="text-sage-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl text-sage-900 mb-3">
                          <Link href={`/services/${service.slug}`} className="hover:text-sage-700">
                            {service.title}
                          </Link>
                        </h2>
                        <p className="text-sage-600 leading-relaxed mb-4">{service.shortDescription}</p>
                        <Link href={`/services/${service.slug}`} className="text-sm text-sage-600 font-medium hover:text-sage-800">
                          Learn more &rarr;
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="py-16">
              <p className="text-sage-500">Services will be listed here once they are added in the admin panel.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
