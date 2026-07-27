import type { Metadata } from 'next'
import { ProfileSidebar } from '@/components/layout/ProfileSidebar'

export const metadata: Metadata = {
  title: 'Sex Therapy',
  description: 'Sex therapy with Dr. Valerie Pinhas for sexual dysfunctions, infertility, menopausal concerns, sexual trauma, gender identity, and more.',
}

const issues = [
  'Sexual Dysfunctions: sexual desire and arousal problems / erectile inhibition / lack of lubrication / rapid ejaculation / inhibited female orgasm / inhibited male orgasm / vaginismus / painful intercourse',
  'Infertility',
  'Menopausal concerns',
  'Sexual shyness / fears',
  'Sexual abuse and coercion, and trauma',
  'Gender identity conflicts / Cross-dressing / Transgender issues',
]

export default function SexTherapyPage() {
  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">Sex Therapy</h1>
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
