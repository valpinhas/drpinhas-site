import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

// Sanity webhook endpoint (Project → API → Webhooks):
//   URL: https://your-domain/api/revalidate
//   Trigger on: create, update, delete
//   Projection: { "type": _type, "slug": slug.current, "post": post->slug.current }
//   Header: X-Revalidate-Secret: <REVALIDATION_SECRET>

export async function POST(req: Request) {
  const secret = req.headers.get('x-revalidate-secret')
  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
  }

  const paths = new Set<string>(['/', '/blog', '/answers', '/sitemap.xml'])

  switch (body.type) {
    case 'post':
      if (body.slug) paths.add(`/blog/${body.slug}`)
      break
    case 'service':
      if (body.slug) paths.add(`/services/${body.slug}`)
      break
    case 'page':
      if (body.slug) paths.add(`/${body.slug}`)
      break
    case 'comment':
      if (body.post) paths.add(`/blog/${body.post}`)
      break
    case 'question':
      paths.add('/answers')
      break
    case 'category':
      if (body.slug) paths.add(`/blog/category/${body.slug}`)
      break
    // siteSettings / navigation / homepage singletons — revalidate everything
  }

  // Globals (homepage, siteSettings, navigation): revalidate all pages
  if (['homepage', 'siteSettings', 'navigation'].includes(body.type)) {
    paths.add('/__all__')
  }

  if (paths.has('/__all__')) {
    revalidatePath('/', 'layout')
  } else {
    for (const path of paths) revalidatePath(path)
  }

  return NextResponse.json({ revalidated: [...paths] })
}
