import type { Metadata } from 'next'
import { ProfileSidebar } from '@/components/layout/ProfileSidebar'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'This web site is provided for information and education purposes only. No doctor/patient relationship is established by your use of this site.',
}

export default function DisclaimerPage() {
  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl text-sage-900">Disclaimer</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="prose-content">
              <p>
                This web site is provided for information and education purposes only. No
                doctor/patient relationship is established by your use of this site. No diagnosis or
                treatment is being provided. No guarantees or warranties are made regarding any of the
                information contained within the web site. This web site is not intended to offer
                specific medical or psychological advice to anyone.
              </p>
              <p>
                This website and the material contained herein, are the sole and exclusive property of
                Dr. Valerie Pinhas and Long Island Sex Therapy. This website is independent of all
                institutions and organizations that may be referred to herein, and nothing herein
                shall be construed to the contrary.
              </p>
            </div>
          </div>

          <ProfileSidebar />
        </div>
      </section>
    </>
  )
}
