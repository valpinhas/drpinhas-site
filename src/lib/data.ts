import { sanityFetch } from './sanity'

// ── Fallback defaults (used when Sanity is unreachable, e.g. first build) ──

const defaultSettings = {
  siteName: 'Long Island Sex Therapy',
  tagline: 'Dr. Valerie Pinhas',
  description: 'Dr. Valerie Pinhas is a sex therapist, psychoanalyst, and professor emeritus with over 50 years of experience serving the Long Island community.',
  contactEmail: 'vlp@longislandsextherapy.com',
  phoneNumber: '(516) 482-8314',
  address: 'Great Neck, Long Island, New York',
  officeHours: '',
  licenseInfo: '',
  socialLinks: [],
  logo: null,
  sidebarBio:
    'I am a therapist who has been practicing sexual therapy, addictions therapy as well as psychoanalytic psychotherapy and psychoanalysis for over 50 years.',
  sidebarButtons: [
    { label: 'Learn More', url: '/about', style: 'primary' },
    { label: 'Read My Blog', url: '/blog', style: 'secondary' },
    { label: 'Ask a Question', url: '/ask', style: 'secondary' },
  ],
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
  footerNav: [
    { label: 'About', url: '/about' },
    { label: 'Services', url: '/services' },
    { label: 'Treatment Specialties', url: '/treatment-specialties' },
    { label: 'Sex Therapy', url: '/sex-therapy' },
    { label: 'Psychoanalytic Psychotherapy', url: '/psychoanalytic-psychotherapy' },
    { label: 'Addiction Therapy', url: '/addiction-therapy' },
    { label: 'Treatment Perspectives', url: '/treatment-perspectives' },
    { label: 'Fees & Insurance', url: '/fees' },
    { label: 'Blog', url: '/blog' },
    { label: 'Q&A', url: '/answers' },
    { label: 'Links', url: '/links' },
    { label: 'Contact', url: '/contact' },
    { label: 'Disclaimer', url: '/disclaimer' },
  ],
}

const defaultHomepage = {
  heroHeading: 'Compassionate, confidential therapy for individuals and couples',
  heroDescription:
    'Dr. Valerie Pinhas is a sex therapist, psychoanalyst, and professor emeritus with over 50 years of experience helping people find insight, relief, and growth.',
  heroButtons: [
    { label: 'Schedule a Consultation', url: '/contact', style: 'primary' },
    { label: 'Learn About Dr. Pinhas', url: '/about', style: 'secondary' },
    { label: 'Read My Blog', url: '/blog', style: 'secondary' },
  ],
  welcomeHeading: 'Welcome',
  welcomeText: null,
  welcomeLinkLabel: 'Read more about Dr. Pinhas',
  welcomeLinkUrl: '/about',
  qaHeading: 'Have a question?',
  qaText:
    'Feel free to ask a question and check out answers posted from other visitors and students.',
  qaButtons: [
    { label: 'Ask a Question', url: '/ask', style: 'primary' },
    { label: 'Browse Answers', url: '/answers', style: 'secondary' },
  ],
}

// ── Globals ───────────────────────────────────────────────────────

export async function getSiteSettings() {
  const result = await sanityFetch(`*[_type == "siteSettings"][0]{
    siteName, tagline, description, contactEmail, phoneNumber, address,
    officeHours, licenseInfo, sidebarBio,
    "socialLinks": socialLinks[]{platform, url},
    "logo": logo.asset->url
  }`)
  return result || defaultSettings
}

export async function getNavigation() {
  const result = await sanityFetch(`*[_type == "navigation"][0]{
    "mainNav": mainNav[]{label, url, newTab, "children": children[]{label, url}},
    "footerNav": footerNav[]{label, url}
  }`)
  return result || defaultNavigation
}

export async function getHomepage() {
  const result = await sanityFetch(`*[_type == "homepage"][0]{
    heroHeading, heroDescription,
    "heroButtons": heroButtons[]{label, url, style},
    welcomeHeading, welcomeText, welcomeLinkLabel, welcomeLinkUrl,
    qaHeading, qaText,
    "qaButtons": qaButtons[]{label, url, style}
  }`)
  return result || defaultHomepage
}

// ── Posts ─────────────────────────────────────────────────────────

export async function getPublishedPosts({
  limit = 10,
  page = 1,
  category,
}: { limit?: number; page?: number; category?: string } = {}) {
  const start = (page - 1) * limit
  const query = category
    ? `{
        "docs": *[_type == "post" && slug.current != null && category->slug.current == $category] | order(publishedAt desc) [$start...$end] {
          ..., "slug": slug.current, "id": _id, "category": category->{title, "slug": slug.current},
          "featuredImage": featuredImage{..., "url": asset->url}
        },
        "total": count(*[_type == "post" && category->slug.current == $category]),
        "page": $page
      }`
    : `{
        "docs": *[_type == "post" && slug.current != null] | order(publishedAt desc) [$start...$end] {
          ..., "slug": slug.current, "id": _id, "category": category->{title, "slug": slug.current},
          "featuredImage": featuredImage{..., "url": asset->url}
        },
        "total": count(*[_type == "post" && slug.current != null]),
        "page": $page
      }`

  const result = await sanityFetch(query, { start, end: start + limit, page, category })
  if (!result) return { docs: [], totalPages: 1, page: 1 }
  return {
    docs: result.docs || [],
    totalPages: Math.max(1, Math.ceil((result.total || 0) / limit)),
    page: result.page || 1,
  }
}

export async function getPostBySlug(slug: string) {
  return sanityFetch(`*[_type == "post" && slug.current == $slug][0]{
    ..., "slug": slug.current, "id": _id,
    "category": category->{title, "slug": slug.current},
    "featuredImage": featuredImage{..., "url": asset->url}
  }`, { slug })
}

// ── Pages ─────────────────────────────────────────────────────────

export async function getPublishedPages(slug: string) {
  return sanityFetch(`*[_type == "page" && slug.current == $slug][0]{
    ..., "slug": slug.current, "id": _id
  }`, { slug })
}

export async function getAllPageSlugs(): Promise<string[]> {
  const result = await sanityFetch(`*[_type == "page" && slug.current != null].slug.current`)
  return result || []
}

// ── Services ──────────────────────────────────────────────────────

export async function getPublishedServices() {
  const result = await sanityFetch(`*[_type == "service" && slug.current != null] | order(order asc) {
    ..., "slug": slug.current, "id": _id,
    "featuredImage": featuredImage{..., "url": asset->url}
  }`)
  return { docs: result || [] }
}

export async function getServiceBySlug(slug: string) {
  return sanityFetch(`*[_type == "service" && slug.current == $slug][0]{
    ..., "slug": slug.current, "id": _id,
    "featuredImage": featuredImage{..., "url": asset->url}
  }`, { slug })
}

export async function getAllServiceSlugs(): Promise<string[]> {
  const result = await sanityFetch(`*[_type == "service" && slug.current != null].slug.current`)
  return result || []
}

// ── Questions ─────────────────────────────────────────────────────

export async function getAnsweredQuestions({ limit = 10, page = 1 }: { limit?: number; page?: number } = {}) {
  const start = (page - 1) * limit
  const result = await sanityFetch(`{
    "docs": *[_type == "question" && defined(answer)] | order(answeredAt desc) [$start...$end],
    "total": count(*[_type == "question" && defined(answer)])
  }`, { start, end: start + limit })
  if (!result) return { docs: [], totalPages: 1, page: 1 }
  return {
    docs: result.docs || [],
    totalPages: Math.max(1, Math.ceil((result.total || 0) / limit)),
    page,
  }
}

// ── Categories ───────────────────────────────────────────────────

export async function getCategories() {
  const result = await sanityFetch(`*[_type == "category"]{
    title, "slug": slug.current, description, "id": _id
  }`)
  return { docs: result || [] }
}

// ── Comments ─────────────────────────────────────────────────────

export async function getCommentsByPost(postId: string) {
  const result = await sanityFetch(`*[_type == "comment" && post._ref == $postId] | order(commentedAt asc) {
    ..., "id": _id, "createdAt": commentedAt,
    "parentComment": {"id": parentComment._ref}
  }`, { postId })
  return { docs: result || [] }
}
