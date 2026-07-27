import Link from 'next/link'

export function ProfileSidebar() {
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
            I am a therapist who has been practicing sexual therapy, addictions therapy as well as
            psychoanalytic psychotherapy and psychoanalysis for over 50 years.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/about" className="btn-primary w-full">Learn More</Link>
            <Link href="/blog" className="btn-secondary w-full">Read My Blog</Link>
            <Link href="/ask" className="btn-secondary w-full">Ask a Question</Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
