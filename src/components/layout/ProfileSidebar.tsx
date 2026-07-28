import Link from 'next/link'
import { getSiteSettings } from '@/lib/data'

export async function ProfileSidebar() {
  const settings = await getSiteSettings() as any

  const bio = settings.sidebarBio ||
    'I am a therapist who has been practicing sexual therapy, addictions therapy as well as psychoanalytic psychotherapy and psychoanalysis for over 50 years.'

  const buttons = settings.sidebarButtons?.length > 0
    ? settings.sidebarButtons
    : [
        { label: 'Learn More', url: '/about', style: 'primary' },
        { label: 'Read My Blog', url: '/blog', style: 'secondary' },
        { label: 'Ask a Question', url: '/ask', style: 'secondary' },
      ]

  return (
    <aside>
      <div className="card overflow-hidden sticky top-24">
        <div className="pt-6 bg-sage-50">
          <img
            src="/images/vp-profile.jpg"
            alt="Dr. Valerie Pinhas"
            className="w-full max-h-48 object-contain object-top"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-serif text-sage-900 mb-3">Dr. Valerie Pinhas</h3>
          <p className="text-sm text-sage-600 leading-relaxed mb-5">
            {bio}
          </p>
          <div className="flex flex-col gap-3">
            {buttons.map((btn: any, i: number) => (
              <Link
                key={i}
                href={btn.url}
                className={btn.style === 'primary' ? 'btn-primary w-full' : 'btn-secondary w-full'}
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
