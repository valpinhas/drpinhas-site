/**
 * Payload → Sanity content migration.
 *
 * Reads every document from the Payload Local API (Postgres), converts
 * Lexical rich text to Sanity Portable Text, uploads media, and writes
 * everything to a Sanity dataset via @sanity/client.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=... npx tsx src/scripts/migrate-to-sanity.ts
 *
 * Idempotent: uses deterministic Sanity document IDs (payload-{collection}-{id})
 * and createOrReplace, so re-running is safe.
 */
import { getPayload } from 'payload'
import { createClient } from '@sanity/client'
import config from '../payload.config'

// ── Sanity client ────────────────────────────────────────────────

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN!,
  apiVersion: '2024-10-22',
  useCdn: false,
})

// ── Lexical → Portable Text converter ────────────────────────────

function lexicalSpans(children: any[]): any[] {
  const spans: any[] = []
  for (const child of children || []) {
    if (child.type !== 'text') continue
    const marks: string[] = []
    if (child.format & 1) marks.push('strong') // bold
    if (child.format & 2) marks.push('em') // italic
    if (!child.text) continue
    spans.push({
      _type: 'span',
      text: child.text,
      marks,
    })
  }
  return spans.length ? spans : [{ _type: 'span', text: '', marks: [] }]
}

function lexicalToPortableText(lexical: any): any[] {
  const root = lexical?.root?.children
  if (!Array.isArray(root)) return []

  const blocks: any[] = []

  for (const node of root) {
    if (node.type === 'paragraph') {
      blocks.push({
        _type: 'block',
        _key: randomKey(),
        style: 'normal',
        markDefs: [],
        children: lexicalSpans(node.children),
      })
    } else if (node.type === 'heading') {
      blocks.push({
        _type: 'block',
        _key: randomKey(),
        style: node.tag || 'h2',
        markDefs: [],
        children: lexicalSpans(node.children),
      })
    } else if (node.type === 'list') {
      for (const item of node.children || []) {
        if (item.type !== 'listitem') continue
        for (const inner of item.children || []) {
          if (inner.type === 'paragraph') {
            blocks.push({
              _type: 'block',
              _key: randomKey(),
              style: 'normal',
              listItem: node.listType === 'bullet' ? 'bullet' : 'number',
              level: 1,
              markDefs: [],
              children: lexicalSpans(inner.children),
            })
          }
        }
      }
    } else if (node.type === 'quote') {
      blocks.push({
        _type: 'block',
        _key: randomKey(),
        style: 'blockquote',
        markDefs: [],
        children: lexicalSpans(node.children),
      })
    }
    // Unknown node types are skipped; content on this site only uses
    // paragraph, heading, list, and text nodes (see blog migration history).
  }

  return blocks
}

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

// ── Media upload ─────────────────────────────────────────────────

async function uploadMedia(mediaDoc: any): Promise<any | undefined> {
  if (!mediaDoc?.url) return undefined
  try {
    const res = await fetch(mediaDoc.url)
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
    const body = Buffer.from(await res.arrayBuffer())
    const filename = mediaDoc.filename || `media-${mediaDoc.id}`
    const asset = await sanity.assets.upload('image', body, {
      filename,
      contentType: mediaDoc.mimeType || 'image/jpeg',
    })
    return {
      _type: 'image',
      _key: randomKey(),
      asset: { _type: 'imageAsset', _ref: asset._id },
      alt: mediaDoc.alt || '',
    }
  } catch (err: any) {
    console.warn(`  ! media upload failed for ${mediaDoc.url}: ${err.message}`)
    return undefined
  }
}

// ── Migration ────────────────────────────────────────────────────

async function run() {
  const payload = await getPayload({ config })
  const log = payload.logger

  // 1. Authors (from Payload users)
  const users = await payload.find({ collection: 'users', limit: 100 })
  for (const user of users.docs) {
    await sanity.createOrReplace({
      _id: `payload-user-${user.id}`,
      _type: 'author',
      name: user.name || user.email,
      email: user.email,
    })
  }
  log.info(`Authors: ${users.docs.length}`)

  // 2. Categories
  const categories = await payload.find({ collection: 'categories', limit: 100 })
  const categoryIds = new Map<string, string>() // payloadId → sanity _id
  for (const cat of categories.docs) {
    const sanityId = `payload-category-${cat.id}`
    categoryIds.set(String(cat.id), sanityId)
    await sanity.createOrReplace({
      _id: sanityId,
      _type: 'category',
      title: cat.title,
      slug: { _type: 'slug', current: cat.slug },
      ...(cat.description ? { description: cat.description } : {}),
    })
  }
  log.info(`Categories: ${categories.docs.length}`)

  // 3. Posts (+ media)
  const posts = await payload.find({ collection: 'posts', limit: 200, depth: 1 })
  const postIds = new Map<string, string>()
  for (const post of posts.docs) {
    const sanityId = `payload-post-${post.id}`
    postIds.set(String(post.id), sanityId)

    let featuredImage: any = undefined
    if (post.featuredImage && typeof post.featuredImage === 'object') {
      featuredImage = await uploadMedia(post.featuredImage)
    }

    const authorId =
      post.author && typeof post.author === 'object'
        ? `payload-user-${post.author.id}`
        : post.author
          ? `payload-user-${post.author}`
          : undefined

    await sanity.createOrReplace({
      _id: sanityId,
      _type: 'post',
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      ...(post.excerpt ? { excerpt: post.excerpt } : {}),
      content: lexicalToPortableText(post.content),
      ...(featuredImage ? { featuredImage } : {}),
      ...(post.category
        ? {
            category: {
              _type: 'reference',
              _ref: categoryIds.get(String((post.category as any).id ?? post.category)) || `payload-category-${post.category}`,
            },
          }
        : {}),
      ...(post.publishedAt ? { publishedAt: post.publishedAt } : {}),
      ...(authorId ? { author: { _type: 'reference', _ref: authorId } } : {}),
    })
  }
  log.info(`Posts: ${posts.docs.length}`)

  // 4. Comments (266, threaded)
  const comments = await payload.find({ collection: 'comments', limit: 500, depth: 0 })
  for (const c of comments.docs) {
    const postRef =
      typeof c.post === 'object' ? postIds.get(String(c.post.id)) : postIds.get(String(c.post))
    if (!postRef) continue // comment on a post that doesn't exist

    const parentRef = c.parentComment
      ? {
          _type: 'reference',
          _ref:
            typeof c.parentComment === 'object'
              ? `payload-comment-${c.parentComment.id}`
              : `payload-comment-${c.parentComment}`,
        }
      : undefined

    await sanity.createOrReplace({
      _id: `payload-comment-${c.id}`,
      _type: 'comment',
      post: { _type: 'reference', _ref: postRef },
      authorName: c.authorName,
      content: c.content,
      ...(c.createdAt ? { commentedAt: c.createdAt } : {}),
      ...(c.isAuthorReply ? { isAuthorReply: true } : {}),
      ...(parentRef ? { parentComment: parentRef } : {}),
    })
  }
  log.info(`Comments: ${comments.docs.length}`)

  // 5. Pages
  const pages = await payload.find({ collection: 'pages', limit: 100 })
  for (const page of pages.docs) {
    await sanity.createOrReplace({
      _id: `payload-page-${page.id}`,
      _type: 'page',
      title: page.title,
      slug: { _type: 'slug', current: page.slug },
      ...(page.subtitle ? { subtitle: page.subtitle } : {}),
      ...(page.excerpt ? { excerpt: page.excerpt } : {}),
      content: lexicalToPortableText(page.content),
      ...(page.showSidebar === false ? { showSidebar: false } : { showSidebar: true }),
      layout: page.layout || 'standard',
    })
  }
  log.info(`Pages: ${pages.docs.length}`)

  // 6. Services
  const services = await payload.find({ collection: 'services', limit: 100 })
  for (const s of services.docs) {
    await sanity.createOrReplace({
      _id: `payload-service-${s.id}`,
      _type: 'service',
      title: s.title,
      slug: { _type: 'slug', current: s.slug },
      ...(s.icon ? { icon: s.icon } : {}),
      shortDescription: s.shortDescription,
      content: lexicalToPortableText(s.content),
      ...(typeof s.order === 'number' ? { order: s.order } : {}),
    })
  }
  log.info(`Services: ${services.docs.length}`)

  // 7. Questions
  const questions = await payload.find({ collection: 'questions', limit: 200 })
  for (const q of questions.docs) {
    await sanity.createOrReplace({
      _id: `payload-question-${q.id}`,
      _type: 'question',
      question: q.question,
      category: q.category || 'general',
      ...(q.submittedBy ? { submittedBy: q.submittedBy } : {}),
      ...(q.answer ? { answer: lexicalToPortableText(q.answer) } : {}),
      ...(q.answeredAt ? { answeredAt: q.answeredAt } : {}),
      ...(q.isAnonymous === false ? { isAnonymous: false } : { isAnonymous: true }),
    })
  }
  log.info(`Questions: ${questions.docs.length}`)

  // 8. Globals → singleton documents
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const mkButton = (typeName: string) => (b: any) => ({
    _type: typeName,
    _key: randomKey(),
    label: b.label,
    url: b.url,
    style: b.style || 'secondary',
  })

  await sanity.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: settings.siteName,
    ...(settings.tagline ? { tagline: settings.tagline } : {}),
    ...(settings.description ? { description: settings.description } : {}),
    contactEmail: settings.contactEmail,
    ...(settings.phoneNumber ? { phoneNumber: settings.phoneNumber } : {}),
    ...(settings.address ? { address: settings.address } : {}),
    ...(settings.officeHours ? { officeHours: settings.officeHours } : {}),
    ...(settings.licenseInfo ? { licenseInfo: settings.licenseInfo } : {}),
    ...(settings.sidebarBio ? { sidebarBio: settings.sidebarBio } : {}),
    sidebarButtons: (settings.sidebarButtons || []).map(mkButton('sidebarButton')),
    socialLinks: (settings.socialLinks || []).map((s: any) => ({
      _type: 'socialLink',
      _key: randomKey(),
      platform: s.platform,
      url: s.url,
    })),
  })

  const navigation = await payload.findGlobal({ slug: 'navigation' })
  await sanity.createOrReplace({
    _id: 'navigation',
    _type: 'navigation',
    mainNav: (navigation.mainNav || []).map((item: any) => ({
      _type: 'navItem',
      _key: randomKey(),
      label: item.label,
      url: item.url,
      ...(item.newTab ? { newTab: true } : {}),
      children: (item.children || []).map((child: any) => ({
        _type: 'navChild',
        _key: randomKey(),
        label: child.label,
        url: child.url,
      })),
    })),
    footerNav: (navigation.footerNav || []).map((item: any) => ({
      _type: 'footerNavItem',
      _key: randomKey(),
      label: item.label,
      url: item.url,
    })),
  })

  const homepage = await payload.findGlobal({ slug: 'homepage' })
  await sanity.createOrReplace({
    _id: 'homepage',
    _type: 'homepage',
    ...(homepage.heroHeading ? { heroHeading: homepage.heroHeading } : {}),
    ...(homepage.heroDescription ? { heroDescription: homepage.heroDescription } : {}),
    heroButtons: (homepage.heroButtons || []).map(mkButton('heroButton')),
    ...(homepage.welcomeHeading ? { welcomeHeading: homepage.welcomeHeading } : {}),
    ...(homepage.welcomeText ? { welcomeText: lexicalToPortableText(homepage.welcomeText) } : {}),
    ...(homepage.welcomeLinkLabel ? { welcomeLinkLabel: homepage.welcomeLinkLabel } : {}),
    ...(homepage.welcomeLinkUrl ? { welcomeLinkUrl: homepage.welcomeLinkUrl } : {}),
    ...(homepage.qaHeading ? { qaHeading: homepage.qaHeading } : {}),
    ...(homepage.qaText ? { qaText: homepage.qaText } : {}),
    qaButtons: (homepage.qaButtons || []).map(mkButton('qaButton')),
  })

  log.info('Globals: siteSettings, navigation, homepage')
  log.info('Migration complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
