import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Dr. Valerie Pinhas to schedule a consultation. Located in Great Neck, Long Island.',
}

export default function ContactPage() {
  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">Contact/Location</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-prose">
          <div className="prose-content">
            <p className="text-lg text-sage-700 leading-relaxed">
              I am conveniently located in Great Neck, Long Island, approachable from all parts of
              Long Island, Queens, the Bronx, Westchester and New Jersey. I am a 24-minute LIRR ride
              from Manhattan&rsquo;s PENN station. To make an appointment for a consultation at my
              Great Neck office, contact me at{' '}
              <a
                href="mailto:vlp@longislandsextherapy.com"
                className="text-sage-600 underline hover:text-sage-800"
              >
                vlp@longislandsextherapy.com
              </a>{' '}
              or{' '}
              <a href="tel:+15164828314" className="text-sage-600 underline hover:text-sage-800">
                (516) 482-8314
              </a>{' '}
              or{' '}
              <a href="tel:+15169876943" className="text-sage-600 underline hover:text-sage-800">
                (516) 987-6943
              </a>
            </p>
            <p className="text-lg text-sage-700 leading-relaxed mt-4">
              Pandemic has made remote work a viable internet option. I am available for virtual work as well.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
