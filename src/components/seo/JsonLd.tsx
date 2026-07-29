import { getSiteSettings } from '@/lib/data'

export async function JsonLd() {
  const settings = await getSiteSettings() as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://longislandsextherapy.com'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': siteUrl,
    name: settings.siteName || 'Long Island Sex Therapy',
    description:
      settings.description ||
      'Dr. Valerie Pinhas is a sex therapist, psychoanalyst, and professor emeritus with over 50 years of experience serving the Long Island community.',
    url: siteUrl,
    telephone: settings.phoneNumber || '(516) 482-8314',
    email: settings.contactEmail || 'vlp@longislandsextherapy.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Great Neck',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
    areaServed: 'Long Island, New York',
    medicalSpecialty: ['Sexual Therapy', 'Psychoanalysis', 'Addiction Medicine'],
    founder: {
      '@type': 'Person',
      name: 'Dr. Valerie Pinhas',
      jobTitle: 'Sex Therapist, Psychoanalyst, Professor Emeritus',
    },
    sameAs: (settings.socialLinks || []).map((link: any) => link.url).filter(Boolean),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
