import Link from 'next/link'
import { getPublishedPosts, getCategories } from '@/lib/data'
import { formatDate, truncate } from '@/lib/utils'

export const metadata = {
  title: 'Blog',
  description: 'Articles and insights from Dr. Valerie Pinhas on sex therapy, relationships, psychotherapy, and well-being.',
  alternates: {
    canonical: '/blog',
  },
}

const POSTS_PER_PAGE = 12

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || '1', 10))

  const [posts, categories] = await Promise.all([
    getPublishedPosts({ limit: POSTS_PER_PAGE, page: currentPage }),
    getCategories(),
  ])

  const totalPages = posts.totalPages || 1

  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">Blog</h1>
          <p className="text-lg text-sage-600 prose-max">
            Insights and reflections on therapy, relationships, sexuality, and personal growth.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          {categories.docs.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/blog"
                className="px-4 py-2 rounded-full text-sm font-medium bg-sage-600 text-cream-50"
              >
                All
              </Link>
              {categories.docs.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/blog/category/${cat.slug}`}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-sage-100 text-sage-700 hover:bg-sage-200"
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          )}

          {posts.docs.length > 0 ? (
            <>
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
                      {post.category && (
                        <span className="text-xs font-medium text-sage-500 uppercase tracking-wide">
                          {post.category.title}
                        </span>
                      )}
                      <h2 className="text-xl text-sage-900 mt-2 mb-2">
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

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  {currentPage > 1 && (
                    <Link
                      href={`/blog?page=${currentPage - 1}`}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-sage-100 text-sage-700 hover:bg-sage-200"
                    >
                      &larr; Previous
                    </Link>
                  )}
                  <span className="text-sm text-sage-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  {currentPage < totalPages && (
                    <Link
                      href={`/blog?page=${currentPage + 1}`}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-sage-100 text-sage-700 hover:bg-sage-200"
                    >
                      Next &rarr;
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-16">
              <p className="text-sage-500">Blog posts will appear here once they are published.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
