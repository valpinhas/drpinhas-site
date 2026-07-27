import { getPayloadClient } from './utils'

// Fallback defaults used when the database is not available (e.g. during build without DB)
const defaultSettings = {
  siteName: 'Long Island Sex Therapy',
  tagline: 'Dr. Valerie Pinhas',
  description: 'Dr. Valerie Pinhas is a sex therapist, psychoanalyst, and professor emeritus with over 30 years of experience serving the Long Island community.',
  contactEmail: 'vlp@longislandsextherapy.com',
  phoneNumber: '(516) 482-8314',
  address: 'Great Neck, Long Island, New York',
  officeHours: '',
  licenseInfo: '',
  socialLinks: [],
  logo: null,
}

const defaultNavigation = {
  mainNav: [
    {
      label: 'Treatment Specialties',
      url: '/treatment-specialties',
      children: [
        { label: 'Psychoanalytic Psychotherapy', url: '/psychoanalytic-psychotherapy' },
        { label: 'Sexual Therapy', url: '/sex-therapy' },
        { label: 'Addiction Therapy', url: '/addiction-therapy' },
      ],
    },
    { label: 'Treatment Perspectives', url: '/treatment-perspectives' },
    { label: 'About Me', url: '/about' },
    { label: 'Fees', url: '/fees' },
    { label: 'Contact/Location', url: '/contact' },
    { label: 'Links', url: '/links' },
    { label: 'Disclaimer', url: '/disclaimer' },
  ],
  footerNav: [],
}

export async function getSiteSettings() {
  try {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'site-settings', depth: 2 })
  } catch {
    return defaultSettings
  }
}

export async function getNavigation() {
  try {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'navigation', depth: 2 })
  } catch {
    return defaultNavigation
  }
}

export async function getPublishedPosts({ limit = 10, page = 1, category }: { limit?: number; page?: number; category?: string } = {}) {
  try {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      limit,
      page,
      sort: '-publishedAt',
      depth: 2,
      ...(category ? { where: { 'category.slug': { equals: category } } } : {}),
    })
  } catch {
    return { docs: [], totalPages: 1, page: 1 }
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { slug: { equals: slug } },
          { _status: { equals: 'published' } },
        ],
      },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

export async function getPublishedPages(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: {
        and: [
          { slug: { equals: slug } },
          { _status: { equals: 'published' } },
        ],
      },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

export async function getPublishedServices() {
  try {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'services',
      where: { _status: { equals: 'published' } },
      sort: 'order',
      depth: 2,
    })
  } catch {
    return { docs: [] }
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'services',
      where: {
        and: [
          { slug: { equals: slug } },
          { _status: { equals: 'published' } },
        ],
      },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

export async function getAnsweredQuestions({ limit = 10, page = 1 }: { limit?: number; page?: number } = {}) {
  try {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'questions',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { answer: { exists: true } },
        ],
      },
      limit,
      page,
      sort: '-answeredAt',
      depth: 1,
    })
  } catch {
    return { docs: [] }
  }
}

export async function getCategories() {
  try {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'categories',
      limit: 50,
      depth: 1,
    })
  } catch {
    return { docs: [] }
  }
}

export async function getCommentsByPost(postId: string) {
  try {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'comments',
      where: { post: { equals: postId } },
      sort: 'createdAt',
      depth: 1,
      limit: 100,
    })
  } catch {
    return { docs: [] }
  }
}
