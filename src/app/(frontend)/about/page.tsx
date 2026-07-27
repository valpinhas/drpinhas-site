import { getPublishedPages } from '@/lib/data'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ProfileSidebar } from '@/components/layout/ProfileSidebar'

export const metadata = {
  title: 'About Dr. Valerie Pinhas',
  description: 'Learn about Dr. Valerie Pinhas, a sex therapist, psychoanalyst, and professor emeritus with over 50 years of experience on Long Island.',
}

export default async function AboutPage() {
  const page = await getPublishedPages('about')

  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">About Dr. Pinhas</h1>
          <p className="text-lg text-sage-600 prose-max">
            Over five decades of compassionate care in sex therapy, psychoanalysis, and addictions treatment.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            {page ? (
              <div className="prose-content">
                <RichText data={page.content} />
              </div>
            ) : (
              <div className="prose-content">
                <p>
                  I am a licensed New York State R-LCSW #034069-1, and a Licensed New York State
                  Psychoanalyst #000033. I am Board Certified as a Sexual Therapist and Supervisor
                  from the American Board of Sexology #1775. I am a New York State certified
                  Alcoholism and Substance Abuse Counselor Emeritus #1578. I received my doctoral
                  training at New York University, specializing in Human Sexuality and Alcoholism
                  Psychotherapy, and my psychoanalytic training at the National Psychological
                  Association for Psychoanalysis. Throughout the decades, in addition to my private
                  practice, I have trained many professionals in Addictions therapy and Sexual
                  therapy at private psychiatric hospitals, psychiatric institutes, Colleges and
                  Universities, and nationally recognized training programs throughout the country
                  and internationally.
                </p>
                <p>
                  I love to teach. There is something magical and exciting about interpersonal
                  engagement in a classroom. (It also doesn't hurt that the subject matter is
                  brimming with aliveness and relevancy!) For 38 years, Nassau Community College has
                  been my home where I have authored and taught courses in Human Sexuality,
                  Alcoholism, Addictions and other Abusive Behaviors, and Death and Dying for both
                  honors and regular college students. In addition, I have taught adjunct courses
                  at the graduate school level at Queens College and Adelphi University.
                </p>
              </div>
            )}
          </div>

          <ProfileSidebar />
        </div>
      </section>
    </>
  )
}
