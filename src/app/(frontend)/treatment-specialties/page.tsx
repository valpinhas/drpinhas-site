import type { Metadata } from 'next'
import Link from 'next/link'
import { ProfileSidebar } from '@/components/layout/ProfileSidebar'

export const metadata: Metadata = {
  title: 'Treatment Specialties',
  description: 'Dr. Valerie Pinhas offers psychoanalytic psychotherapy, sexual therapy, and addiction therapy in individual, couples, family, and intervention formats.',
}

const specialties = [
  { label: 'Psychoanalytic Psychotherapy', href: '/psychoanalytic-psychotherapy' },
  { label: 'Sexual Therapy', href: '/sex-therapy' },
  { label: 'Addiction Therapy', href: '/addiction-therapy' },
]

export default function TreatmentSpecialtiesPage() {
  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">Treatment Specialties</h1>
          <p className="text-lg text-sage-600 prose-max">
            Specialized areas of practice and treatment modalities.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="prose-content">
              <ul className="space-y-3 mb-8">
                {specialties.map((specialty) => (
                  <li key={specialty.href} className="text-lg">
                    <Link href={specialty.href} className="text-sage-700 underline hover:text-sage-900">
                      {specialty.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p>
                I offer a variety of treatment modalities: Individual psychotherapy, once or twice per
                week, as needed, psychoanalysis, couples therapy, family therapy, and intervention
                therapy for families with a member who has an addiction.
              </p>
            </div>
          </div>

          <ProfileSidebar />
        </div>
      </section>
    </>
  )
}
