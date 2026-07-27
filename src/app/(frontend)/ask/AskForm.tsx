'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AskForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    question: '',
    category: 'general',
    submittedBy: '',
    isAnonymous: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          _status: 'draft',
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Something went wrong. Please try again.')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <>
        <section className="page-header">
          <div className="container-prose">
            <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">Thank You</h1>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-prose">
            <p className="text-lg text-sage-700 mb-8">
              Your question has been received. Dr. Pinhas will review it and may post an answer on the
              Answers page. Thank you for reaching out.
            </p>
            <button onClick={() => router.push('/answers')} className="btn-primary">
              Browse Answers
            </button>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="page-header">
        <div className="container-prose">
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">Ask a Question</h1>
          <p className="text-lg text-sage-600">
            Feel free to ask a question. Your question will be reviewed by Dr. Pinhas, and the answer
            may be published on the Answers page. You can remain anonymous.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-prose">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-sage-700 mb-2">
                Your Question *
              </label>
              <textarea
                id="question"
                required
                rows={5}
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                className="input-field"
                placeholder="What would you like to ask?"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-sage-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              >
                <option value="general">General</option>
                <option value="sex-therapy">Sex Therapy</option>
                <option value="couples-therapy">Couples Therapy</option>
                <option value="addictions">Addictions</option>
                <option value="psychotherapy">Psychotherapy</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="submittedBy" className="block text-sm font-medium text-sage-700 mb-2">
                Your Name <span className="text-sage-400">(optional)</span>
              </label>
              <input
                id="submittedBy"
                type="text"
                value={form.submittedBy}
                onChange={(e) => setForm({ ...form, submittedBy: e.target.value })}
                className="input-field"
                placeholder="Optional"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="isAnonymous"
                type="checkbox"
                checked={form.isAnonymous}
                onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                className="w-5 h-5 rounded border-sage-300 text-sage-600 focus:ring-sage-400"
              />
              <label htmlFor="isAnonymous" className="text-sm text-sage-700">
                Keep me anonymous (my name will not be shown if the answer is published)
              </label>
            </div>

            {error && (
              <div className="rounded-xl bg-clay-50 border border-clay-200 p-4 text-sm text-clay-700">
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Submitting...' : 'Submit Question'}
            </button>
          </form>

          <p className="mt-8 text-sm text-sage-500">
            Note: Submitting a question does not establish a therapeutic relationship.
            If you need immediate support, please contact a crisis line or emergency services.
          </p>
        </div>
      </section>
    </>
  )
}
