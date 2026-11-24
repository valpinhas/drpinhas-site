import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

// Public question submission endpoint.
// Mirrors the old Payload collection's public create access:
// anyone may submit a question as a draft; only editors can publish.

// Lazy client: the Sanity project may not exist yet during first builds.
let sanity: ReturnType<typeof createClient> | null = null
function getSanity() {
  if (!sanity) {
    sanity = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      token: process.env.SANITY_API_WRITE_TOKEN || '', // server-side only
      apiVersion: '2024-10-22',
      useCdn: false,
    })
  }
  return sanity
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const question = (body.question || '').toString().trim()
    if (!question) {
      return NextResponse.json({ message: 'Question is required.' }, { status: 400 })
    }
    if (question.length > 2000) {
      return NextResponse.json({ message: 'Question is too long.' }, { status: 400 })
    }

    const category = ['general', 'sex-therapy', 'couples-therapy', 'addictions', 'psychotherapy', 'other']
      .includes(body.category) ? body.category : 'general'
    const submittedBy = (body.submittedBy || '').toString().trim().slice(0, 100)
    const isAnonymous = body.isAnonymous !== false

    const doc = {
      _type: 'question',
      question,
      category,
      ...(submittedBy ? { submittedBy } : {}),
      isAnonymous,
      // No answer field → stays off the public Answers page until Dr. Pinhas answers it.
    }

    const created = await getSanity().create(doc)

    return NextResponse.json({ id: created._id }, { status: 201 })
  } catch (err: any) {
    console.error('Question submission failed:', err.message)
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
