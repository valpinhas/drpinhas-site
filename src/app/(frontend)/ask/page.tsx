import type { Metadata } from 'next'
import { AskForm } from './AskForm'

export const metadata: Metadata = {
  title: 'Ask a Question',
  description: 'Submit a question to Dr. Valerie Pinhas. Your question may be answered and published (anonymously) on the Answers page.',
}

export default function AskPage() {
  return <AskForm />
}
