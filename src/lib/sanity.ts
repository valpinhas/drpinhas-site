import { createClient } from 'next-sanity'

// During first build (or local dev before the Sanity project is created)
// the env vars may be absent — fall back to a placeholder so the client
// constructs; every fetch goes through sanityFetch, which catches errors.
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-22',
  useCdn: false,
})

export async function sanityFetch<T = any>(query: string, params: Record<string, any> = {}): Promise<T | null> {
  try {
    return await client.fetch<T>(query, params)
  } catch (err) {
    console.warn('Sanity fetch failed:', (err as Error).message)
    return null
  }
}
