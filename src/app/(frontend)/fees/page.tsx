import type { Metadata } from 'next'
import { ProfileSidebar } from '@/components/layout/ProfileSidebar'

export const metadata: Metadata = {
  title: 'Fees & Insurance',
  description: 'Information about insurance reimbursement and fees for therapy sessions with Dr. Valerie Pinhas.',
}

export default function FeesPage() {
  return (
    <>
      <section className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl text-sage-900 mb-4">Fees &amp; Insurance</h1>
          <p className="text-lg text-sage-600 prose-max">
            Reimbursement, confidentiality, and what to expect.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="prose-content">
              <p>
                You are eligible for reimbursement by major insurance companies that have
                out-of-network coverage. I will assist you in filing your claim. Most insurance
                companies do not reimburse for sexual therapy. Other types of psychotherapy are
                reimbursable. If, however, you are seeking a therapist on your insurance panel, and
                confidentiality is important, take into consideration that managed care/HMO plans
                require that your therapist discuss your case to assess determination of treatment,
                discuss your diagnosis/treatment plans and authorize the number of sessions that
                will be covered.
              </p>
              <p>
                I am committed to your well-being and look to establish a trusting, discrete
                relationship that regards confidentiality with the utmost importance.
              </p>
            </div>
          </div>

          <ProfileSidebar />
        </div>
      </section>
    </>
  )
}
