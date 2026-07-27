import Link from 'next/link'
import { getPublishedPosts, getCategories } from '@/lib/data'
import { formatDate, truncate } from '@/lib/utils'

export async function generateStaticParams() {
  try {
    const categories = await getCategories()
    return categories.docs.map((cat: any) => ({ slug: cat.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categories = await getCategories()
  const cat = categories.docs.find((c: any) => c.slug === slug)
  return {
    title: cat?.title || 'Category',
    description: cat?.description || `Blog posts in the ${cat?.title} category.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.docs.find((c: any) => c.slug === slug)

  const posts = await getPublishedPosts({ limit: 100, category: slug })

  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <Link href="/blog" className="text-sm text-sage-500 hover:text-sage-700 mb-4 inline-block">
            &larr; All Posts
          </Link>
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">{category?.title || 'Category'}</h1>
          {category?.description && (
            <p className="text-lg text-sage-600 prose-max">{category.description}</p>
          )}
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          {posts.docs.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.docs.map((post: any) => (
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
                    <h2 className="text-xl text-sage-900 mb-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-sage-700">
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-sage-600 leading-relaxed mb-3">
                        {truncate(post.excerpt, 140)}
                      </p>
                    )}
                    {post.publishedAt && (
                      <time className="text-xs text-sage-400">{formatDate(post.publishedAt)}</time>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-16">
              <p className="text-sage-500">No posts in this category yet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
