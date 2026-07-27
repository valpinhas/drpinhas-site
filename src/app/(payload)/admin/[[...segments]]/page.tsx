/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE RE-AUTHORED AT ANY TIME. */

import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

import React from 'react'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  return generatePageMetadata({ config, params, searchParams })
}

const Page = async ({ params, searchParams }: Args) => {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  return (
    <RootPage
      params={Promise.resolve({ segments: resolvedParams.segments })}
      searchParams={Promise.resolve(resolvedSearchParams)}
      config={config}
      importMap={importMap}
    />
  )
}

export default Page
