'use client'

import { useState } from 'react'

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `New contact form submission from ${form.name}`,
          from_name: 'Dr. Pinhas Website',
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.message || 'Something went wrong. Please try again or email directly.')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section className="page-header">
        <div className="container-prose">
          <h1 className="text-3xl text-sage-900 mb-4">Thank You</h1>
          <p className="text-lg text-sage-700 mb-8">
            Your message has been sent. Dr. Pinhas will get back to you as soon as possible.
          </p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">Contact/Location</h1>
          <p className="text-lg text-sage-600 prose-max">
            Reach out to schedule a consultation, ask a question, or learn more about services.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl text-sage-900 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot for spam protection */}
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-sage-700 mb-2">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-sage-700 mb-2">
                  Phone <span className="text-sage-400">(optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-sage-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field"
                  placeholder="How can I help you?"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-clay-50 border border-clay-200 p-4 text-sm text-clay-700">
                  {error}
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            <p className="mt-6 text-sm text-sage-500">
              Note: This form is for general inquiries only. Please do not include sensitive personal
              or health information. If you are experiencing a crisis, please call 988 or go to your
              nearest emergency room.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-sage-900 mb-6">Location &amp; Contact</h2>
            <div className="card p-6 space-y-5">
              <div>
                <h3 className="text-sm font-medium text-sage-500 uppercase tracking-wide mb-1">Office</h3>
                <p className="text-sage-800">Great Neck, Long Island, New York</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-sage-500 uppercase tracking-wide mb-1">Email</h3>
                <p className="text-sage-800">
                  <a href="mailto:vlp@longislandsextherapy.com" className="hover:text-sage-600">
                    vlp@longislandsextherapy.com
                  </a>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-sage-500 uppercase tracking-wide mb-1">Phone</h3>
                <p className="text-sage-800">
                  <a href="tel:+15164828314" className="hover:text-sage-600">(516) 482-8314</a>
                  <br />
                  <a href="tel:+15169876943" className="hover:text-sage-600">(516) 987-6943</a>
                </p>
              </div>
              <div className="pt-4 border-t border-sage-100">
                <p className="text-sm text-sage-600 leading-relaxed">
                  Conveniently located in Great Neck, approachable from all parts of Long Island,
                  Queens, the Bronx, Westchester, and New Jersey. A 24-minute LIRR ride from
                  Manhattan's Penn Station.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
