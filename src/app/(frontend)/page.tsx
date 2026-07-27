import Link from 'next/link'
import { Heart, Users, Brain, Shield, BookOpen, MessageCircle } from 'lucide-react'
import { getPublishedServices, getPublishedPosts, getSiteSettings } from '@/lib/data'
import { formatDate, truncate } from '@/lib/utils'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  heart: Heart,
  users: Users,
  brain: Brain,
  shield: Shield,
  'book-open': BookOpen,
  'message-circle': MessageCircle,
}

export default async function HomePage() {
  const [services, recentPosts, settings] = await Promise.all([
    getPublishedServices(),
    getPublishedPosts({ limit: 3 }),
    getSiteSettings(),
  ])

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden page-header">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-serif text-sage-900 leading-tight mb-6">
              Compassionate, confidential therapy for individuals and couples
            </h1>
            <p className="text-lg md:text-xl text-sage-700 leading-relaxed mb-8">
              {settings.description || 'Dr. Valerie Pinhas is a sex therapist, psychoanalyst, and professor emeritus with over three decades of experience helping people find insight, relief, and growth.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary">
                Schedule a Consultation
              </Link>
              <Link href="/about" className="btn-secondary">
                Learn About Dr. Pinhas
              </Link>
              <Link href="/blog" className="btn-secondary">
                Read My Blog
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sage-200 to-transparent" />
      </section>

      {/* Welcome message */}
      <section className="section-padding">
        <div className="container-prose text-center">
          <h2 className="text-3xl md:text-4xl text-sage-900 mb-6">Welcome</h2>
          <p className="text-lg text-sage-700 leading-relaxed mb-4">
            Your decision to inquire about sexual therapy, psychotherapy, couples therapy, or addictions therapy is a courageous one.
            I wholeheartedly support your inclination to look inside yourself to obtain insight and relief.
          </p>
          <p className="text-lg text-sage-700 leading-relaxed mb-8">
            My name is Dr. Valerie Pinhas. I have been a practicing sex therapist, addictions therapist, and psychoanalytic psychotherapist for over three decades.
            I am also a professor emeritus of Human Sexuality and Alcoholism, Addictions and Abusive Behaviors at Nassau Community College.
          </p>
          <Link href="/about" className="text-sage-600 font-medium hover:text-sage-800 underline">
            Read more about Dr. Pinhas &rarr;
          </Link>
        </div>
      </section>

      {/* Services */}
      {services.docs.length > 0 && (
        <section className="section-padding bg-sage-50">
          <div className="container-wide">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl text-sage-900 mb-4">Services</h2>
              <p className="text-lg text-sage-600 prose-max">
                Individualized care tailored to your needs, delivered with warmth and respect.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.docs.map((service: any) => {
                const Icon = iconMap[service.icon] || Heart
                return (
                  <Link key={service.id} href={`/services/${service.slug}`} className="card p-6 group">
                    <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center mb-5">
                      <Icon size={24} className="text-sage-600" />
                    </div>
                    <h3 className="text-xl text-sage-900 mb-3 group-hover:text-sage-700">{service.title}</h3>
                    <p className="text-sage-600 leading-relaxed">{service.shortDescription}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Q&A invite */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="rounded-3xl bg-clay-50 border border-clay-100 p-8 md:p-10 text-center">
            <h2 className="text-3xl md:text-4xl text-clay-800 mb-4">Have a question?</h2>
            <p className="text-lg text-clay-600 prose-max mb-8 mx-auto">
              Feel free to ask a question and check out answers posted from other visitors and students.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/ask" className="btn-primary">Ask a Question</Link>
              <Link href="/answers" className="btn-secondary">Browse Answers</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent blog posts */}
      {recentPosts.docs.length > 0 && (
        <section className="section-padding bg-sage-50">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl text-sage-900">From the Blog</h2>
              <Link href="/blog" className="text-sage-600 font-medium hover:text-sage-800">
                View all &rarr;
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {recentPosts.docs.map((post: any) => (
                <article key={post.id} className="card overflow-hidden">
                  {post.featuredImage && (
                    <Link href={`/blog/${post.slug}`}>
                      <img
                        src={typeof post.featuredImage === 'object' ? post.featuredImage.url : ''}
                        alt={post.featuredImage?.alt || post.title}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="text-xs font-medium text-sage-500 uppercase tracking-wide">
                        {post.category.title}
                      </span>
                    )}
                    <h3 className="text-lg text-sage-900 mt-2 mb-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-sage-700">
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-sage-600 leading-relaxed mb-3">
                        {truncate(post.excerpt, 120)}
                      </p>
                    )}
                    {post.publishedAt && (
                      <time className="text-xs text-sage-400">{formatDate(post.publishedAt)}</time>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
