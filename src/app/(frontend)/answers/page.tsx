import Link from 'next/link'
import { getAnsweredQuestions } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const metadata = {
  title: 'Q&A Answers',
  description: 'Answers to questions from visitors and students, answered by Dr. Valerie Pinhas.',
}

export default async function AnswersPage() {
  const questions = await getAnsweredQuestions({ limit: 20 })

  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">Q&amp;A</h1>
          <p className="text-lg text-sage-600 prose-max">
            Questions from visitors and students, answered by Dr. Pinhas. Have a question of your own?
          </p>
          <Link href="/ask" className="btn-primary mt-6">
            Ask a Question
          </Link>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-prose">
          {questions.docs.length > 0 ? (
            <div className="space-y-10">
              {questions.docs.map((qa: any) => (
                <article key={qa.id} className="card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-medium text-sage-500 uppercase tracking-wide">
                      {qa.category?.replace('-', ' ')}
                    </span>
                    {qa.answeredAt && (
                      <time className="text-xs text-sage-400">{formatDate(qa.answeredAt)}</time>
                    )}
                  </div>

                  <h2 className="text-xl text-sage-900 mb-4 font-serif">
                    {qa.question}
                  </h2>

                  {!qa.isAnonymous && qa.submittedBy && (
                    <p className="text-sm text-sage-500 mb-4">
                      Asked by {qa.submittedBy}
                    </p>
                  )}

                  <div className="prose-content border-l-4 border-sage-200 pl-6">
                    <RichText data={qa.answer} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-16">
              <p className="text-sage-500 mb-6">
                No answered questions yet. Be the first to ask!
              </p>
              <Link href="/ask" className="btn-primary">Ask a Question</Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
