import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings' })

    // Store as a question in draft status for Dr. Pinhas to review
    await payload.create({
      collection: 'questions',
      data: {
        question: `Contact form: ${message}`,
        submittedBy: name,
        category: 'general',
        isAnonymous: false,
        _status: 'draft',
      },
    })

    payload.logger.info(`Contact form submission from ${name} <${email}>`)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred processing your message.' },
      { status: 500 }
    )
  }
}
