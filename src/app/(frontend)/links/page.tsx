import type { Metadata } from 'next'
import { ProfileSidebar } from '@/components/layout/ProfileSidebar'

export const metadata: Metadata = {
  title: 'Links',
  description: 'Recommended resources and professional organizations related to Dr. Valerie Pinhas\'s practice.',
}

const links = [
  {
    title: 'RateMyProfessor',
    url: 'https://www.ratemyprofessors.com/ShowRatings.jsp?tid=466259',
    description: 'This is a site where students can post their reflections of their academic and personal experiences of their professors.',
  },
  {
    title: 'National Psychological Association for Psychoanalysis',
    url: 'https://npap.org',
    description: 'The NPAP Membership Association is an organization of psychoanalysts dedicated to the advancement of psychoanalysis as a science and a profession. It was founded by Theodor Reik in 1948, for the purpose of offering all interested and qualified applicants, including those other than physicians, the opportunity for psychoanalytic study and training in the United States. It has continued to evolve into a vibrant professional association of analysts representing the diversity of theories that comprise contemporary psychoanalytic inquiry.',
  },
]

export default function LinksPage() {
  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">Links</h1>
          <p className="text-lg text-sage-600 prose-max">
            Recommended resources and professional organizations.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="space-y-8">
              {links.map((link) => (
                <div key={link.url} className="card p-6">
                  <h2 className="text-xl text-sage-900 mb-3">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-sage-600"
                    >
                      {link.title}
                    </a>
                  </h2>
                  <p className="text-sage-600 leading-relaxed">{link.description}</p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-sm text-sage-600 font-medium hover:text-sage-800"
                  >
                    Visit {link.title} &rarr;
                  </a>
                </div>
              ))}
            </div>
          </div>

          <ProfileSidebar />
        </div>
      </section>
    </>
  )
}
