import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPublishedPosts, getCommentsByPost } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import { RichText } from '@payloadcms/richtext-lexical/react'

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts({ limit: 100 })
    return posts.docs.map((post: any) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt || `${post.title} — Dr. Valerie Pinhas`,
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.publishedAt,
      ...(post.featuredImage && typeof post.featuredImage === 'object' && post.featuredImage.url
        ? { images: [{ url: post.featuredImage.url }] }
        : {}),
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  // Fetch comments for this post
  const commentsResult = await getCommentsByPost(String(post.id))
  const comments = commentsResult.docs || []

  return (
    <article>
      <section className="page-header">
        <div className="container-prose">
          <Link href="/blog" className="text-sm text-sage-500 hover:text-sage-700 mb-4 inline-block">
            &larr; Back to Blog
          </Link>
          {post.category && typeof post.category === 'object' && (
            <span className="block text-sm font-medium text-sage-500 uppercase tracking-wide mb-3">
              {post.category.title}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl text-sage-900 mb-4">{post.title}</h1>
          {post.publishedAt && (
            <time className="text-sm text-sage-500">{formatDate(post.publishedAt)}</time>
          )}
        </div>
      </section>

      {post.featuredImage && typeof post.featuredImage === 'object' && post.featuredImage.url && (
        <div className="container-wide mb-12">
          <img
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            className="w-full max-h-[480px] object-cover rounded-3xl"
          />
        </div>
      )}

      <section className="section-padding">
        <div className="container-prose">
          <div className="prose-content">
            <RichText data={post.content} />
          </div>
        </div>
      </section>

      {comments.length > 0 && (
        <section className="border-t border-sage-100 py-12">
          <div className="container-prose">
            <h2 className="text-2xl text-sage-900 mb-6">Comments ({comments.length})</h2>
            <div className="space-y-6">
              {comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className={`rounded-lg p-5 ${
                    comment.isAuthorReply
                      ? 'bg-sage-50 border border-sage-200'
                      : 'bg-cream-50 border border-sage-100'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-sage-800">
                      {comment.authorName}
                    </span>
                    {comment.isAuthorReply && (
                      <span className="text-xs bg-sage-600 text-cream-50 px-2 py-0.5 rounded-full">
                        Dr. Pinhas
                      </span>
                    )}
                    {comment.createdAt && (
                      <span className="text-xs text-sage-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-sage-600 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-sage-100 py-12">
        <div className="container-prose">
          <p className="text-sage-600 mb-4">Have a question about this topic?</p>
          <div className="flex gap-4">
            <Link href="/ask" className="btn-primary">Ask a Question</Link>
            <Link href="/contact" className="btn-secondary">Contact Dr. Pinhas</Link>
          </div>
        </div>
      </section>
    </article>
  )
}
