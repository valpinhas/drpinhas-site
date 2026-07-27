import type { Metadata } from 'next'
import { ProfileSidebar } from '@/components/layout/ProfileSidebar'

export const metadata: Metadata = {
  title: 'Psychoanalytic Psychotherapy',
  description: 'Psychoanalytic psychotherapy with Dr. Valerie Pinhas for depression, anxiety, self-esteem, anger, relationship difficulties, and more.',
}

const issues = [
  'Depression and anxiety',
  'Self-esteem issues / self-sabotage / self-punishment',
  'Anger management',
  'Fears and panic anxieties',
  'Work related difficulties',
  'Relationship difficulties / couple communication problems',
  'Parenting concerns',
  'Impulse disorders',
]

export default function PsychoanalyticPsychotherapyPage() {
  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">Psychoanalytic Psychotherapy</h1>
          <p className="text-lg text-sage-600 prose-max">
            Areas of practice and concerns treated.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="prose-content">
              <ul className="space-y-3">
                {issues.map((issue) => (
                  <li key={issue} className="text-lg text-sage-800">{issue}</li>
                ))}
              </ul>
            </div>
          </div>

          <ProfileSidebar />
        </div>
      </section>
    </>
  )
}
