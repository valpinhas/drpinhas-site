import { getPayload } from 'payload'
import { readFileSync } from 'fs'
import config from '../payload.config'

interface WPComment {
  id: number
  parent: number
  author: number
  author_name: string
  date: string
  content: { rendered: string }
}

interface WPPost {
  id: number
  date: string
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  author: number
  categories: number[]
  tags: number[]
  _embedded?: {
    author?: Array<{ name: string }>
    replies?: WPComment[][]
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string; taxonomy: string }>>
  }
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '--')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#8230;/g, '...')
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<[^>]*>/g, '')
      .replace(/\[.*?\]|Read More.*$/g, '')
      .trim()
  )
}

// Simple HTML to Lexical converter
// Handles <p>, <strong>, <em>, <br>, <a> tags
function htmlToLexical(html: string): any {
  const children: any[] = []

  // Split content into paragraphs by <p> tags
  // The WordPress content uses <p>...</p> tags
  const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/g
  let match
  let foundParagraphs = false

  while ((match = paragraphRegex.exec(html)) !== null) {
    foundParagraphs = true
    const paragraphContent = match[1].trim()
    if (paragraphContent) {
      children.push(createParagraphNode(paragraphContent))
    }
  }

  // If no <p> tags found, treat the entire content as one paragraph
  if (!foundParagraphs) {
    const text = stripHtml(html)
    if (text) {
      children.push(createParagraphNode(text))
    }
  }

  // If no children, create an empty paragraph
  if (children.length === 0) {
    children.push(createParagraphNode(''))
  }

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children,
    },
  }
}

function createParagraphNode(content: string): any {
  // Parse inline formatting: <strong>, <em>, <a>
  const children: any[] = []
  const segments = parseInlineContent(content)
  for (const seg of segments) {
    children.push(seg)
  }

  if (children.length === 0) {
    children.push({
      type: 'text',
      format: 0,
      version: 1,
      text: '',
    })
  }

  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children,
  }
}

function parseInlineContent(content: string): any[] {
  const nodes: any[] = []
  // Handle <strong>...</strong> and <em>...</em> tags
  // Simple approach: split by tags and create text nodes with appropriate format

  let remaining = content
  const regex = /<(strong|em|a[^>]*)>([\s\S]*?)<\/(strong|em|a)>/g
  let match
  let lastIndex = 0

  while ((match = regex.exec(remaining)) !== null) {
    // Add text before the tag
    if (match.index > lastIndex) {
      const textBefore = remaining.substring(lastIndex, match.index)
      if (textBefore) {
        nodes.push({
          type: 'text',
          format: 0,
          version: 1,
          text: decodeHtmlEntities(textBefore),
        })
      }
    }

    const tag = match[1].toLowerCase()
    const innerContent = match[2]

    if (tag === 'strong') {
      nodes.push({
        type: 'text',
        format: 1, // bold
        version: 1,
        text: decodeHtmlEntities(innerContent),
      })
    } else if (tag === 'em') {
      nodes.push({
        type: 'text',
        format: 2, // italic
        version: 1,
        text: decodeHtmlEntities(innerContent),
      })
    } else if (tag.startsWith('a')) {
      // For links, just extract the text
      nodes.push({
        type: 'text',
        format: 0,
        version: 1,
        text: decodeHtmlEntities(innerContent),
      })
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < remaining.length) {
    const textAfter = remaining.substring(lastIndex)
    if (textAfter) {
      nodes.push({
        type: 'text',
        format: 0,
        version: 1,
        text: decodeHtmlEntities(textAfter),
      })
    }
  }

  if (nodes.length === 0) {
    nodes.push({
      type: 'text',
      format: 0,
      version: 1,
      text: decodeHtmlEntities(content),
    })
  }

  return nodes
}

async function main() {
  const dataPath = '/tmp/wp_posts_data.json'
  console.log(`Reading WordPress data from: ${dataPath}`)
  const posts: WPPost[] = JSON.parse(readFileSync(dataPath, 'utf-8'))
  console.log(`Loaded ${posts.length} posts`)

  console.log('Initializing Payload...')
  const payload = await getPayload({ config })

  // Extract all categories from posts
  const categoryMap = new Map<number, string>()
  for (const post of posts) {
    if (post._embedded?.['wp:term']) {
      for (const termGroup of post._embedded['wp:term']) {
        for (const term of termGroup) {
          if (term.taxonomy === 'category') {
            categoryMap.set(term.id, term.name)
          }
        }
      }
    }
  }

  console.log(`Found categories: ${Array.from(categoryMap.entries()).map(([id, name]) => `${id}=${name}`).join(', ')}`)

  // Create categories in Payload
  const payloadCategoryMap = new Map<number, string>()
  for (const [wpId, name] of categoryMap) {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    let categoryId: string
    if (existing.docs.length > 0) {
      categoryId = String(existing.docs[0].id)
      console.log(`Category "${name}" already exists (ID: ${categoryId})`)
    } else {
      const category = await payload.create({
        collection: 'categories',
        data: { title: name, slug },
      })
      categoryId = String(category.id)
      console.log(`Created category "${name}" (ID: ${categoryId})`)
    }
    payloadCategoryMap.set(wpId, categoryId)
  }

  // Get the first admin user for author assignment
  const users = await payload.find({ collection: 'users', limit: 1 })
  const authorId = users.docs.length > 0 ? String(users.docs[0].id) : undefined
  console.log(`Author ID: ${authorId}`)

  let created = 0
  let skipped = 0
  let failed = 0

  for (const post of posts) {
    const title = decodeHtmlEntities(post.title.rendered)
    console.log(`\nProcessing: ${title}`)

    // Check if post already exists by slug
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: post.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  Already exists, skipping`)
      skipped++
      continue
    }

    // Convert HTML content to Lexical using our simple converter
    const htmlContent = post.content.rendered
    const lexicalContent = htmlToLexical(htmlContent)

    // Get the primary category
    const primaryCategoryId = post.categories[0]
    const payloadCatId = payloadCategoryMap.get(primaryCategoryId)

    // Create excerpt
    let excerpt = stripHtml(post.excerpt.rendered)
    if (excerpt.length > 200) {
      excerpt = excerpt.substring(0, 200) + '...'
    }

    // Create the post
    const postData: any = {
      title,
      slug: post.slug,
      content: lexicalContent,
      excerpt,
      publishedAt: post.date,
      _status: 'published',
    }

    if (payloadCatId) postData.category = Number(payloadCatId)
    // Don't set author - the beforeChange hook will set it from req.user

    try {
      const createdPost = await payload.create({
        collection: 'posts',
        data: postData,
        overrideAccess: true,
        req: {
          user: users.docs[0],
        } as any,
      })

      console.log(`  Created post (ID: ${createdPost.id})`)
      created++

      // Process comments
      const comments = post._embedded?.replies?.[0]
      if (comments && comments.length > 0) {
        console.log(`  Processing ${comments.length} comments`)

        const sortedComments = [...comments].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        const commentIdMap = new Map<number, string>()

        for (const comment of sortedComments) {
          const isAuthorReply = comment.author === 2
          const commentContent = decodeHtmlEntities(stripHtml(comment.content.rendered))

          const commentData: any = {
            post: Number(createdPost.id),
            authorName: comment.author_name,
            content: commentContent,
            createdAt: comment.date,
            isAuthorReply,
          }

          if (comment.parent !== 0 && commentIdMap.has(comment.parent)) {
            commentData.parentComment = Number(commentIdMap.get(comment.parent))
          }

          try {
            const createdComment = await payload.create({
              collection: 'comments',
              data: commentData,
              overrideAccess: true,
              req: {
                user: users.docs[0],
              } as any,
            })
            commentIdMap.set(comment.id, String(createdComment.id))
            console.log(`    Comment by ${comment.author_name} (${comment.date})`)
          } catch (err) {
            console.error(`    Failed to create comment: ${err}`)
          }
        }
      }
    } catch (err) {
      console.error(`  Failed to create post: ${err}`)
      failed++
    }
  }

  console.log(`\n=== Migration complete ===`)
  console.log(`Created: ${created}, Skipped: ${skipped}, Failed: ${failed}`)
  await payload.destroy()
  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
