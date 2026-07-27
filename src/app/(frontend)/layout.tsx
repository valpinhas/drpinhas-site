import React from 'react'
import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getSiteSettings, getNavigation } from '@/lib/data'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
      default: `${settings.siteName} — ${settings.tagline || 'Long Island Sex Therapy'}`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.description || 'Dr. Valerie Pinhas, Long Island sex therapist with over 30 years of experience.',
    keywords: ['sex therapy', 'Long Island', 'psychotherapy', 'couples therapy', 'addictions therapy', 'psychoanalyst', 'Dr. Valerie Pinhas'],
    authors: [{ name: settings.siteName }],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: process.env.NEXT_PUBLIC_SITE_URL,
      siteName: settings.siteName,
      title: `${settings.siteName} — ${settings.tagline || 'Long Island Sex Therapy'}`,
      description: settings.description || '',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${settings.siteName} — ${settings.tagline || 'Long Island Sex Therapy'}`,
      description: settings.description || '',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL,
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, navigation] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
  ])

  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header
          navItems={navigation.mainNav || []}
          siteName={settings.siteName}
          tagline={settings.tagline || ''}
        />
        <main className="flex-1">{children}</main>
        <Footer
          footerNav={navigation.footerNav || []}
          settings={{
            siteName: settings.siteName || 'Dr. Valerie Pinhas',
            tagline: settings.tagline || '',
            contactEmail: settings.contactEmail || '',
            phoneNumber: settings.phoneNumber || undefined,
            address: settings.address || undefined,
            officeHours: settings.officeHours || undefined,
            licenseInfo: settings.licenseInfo || undefined,
            socialLinks: settings.socialLinks || undefined,
          }}
        />
      </body>
    </html>
  )
}
