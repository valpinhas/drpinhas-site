/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE RE-AUTHENTICATED AT ANY TIME. */

import type { Metadata } from 'next'
import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import '@payloadcms/next/css'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap'

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

export const metadata: Metadata = {
  title: {
    default: 'Payload Admin',
    template: '%s — Payload Admin',
  },
}

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => (
  <html lang="en">
    <body>
      <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
        {children}
      </RootLayout>
    </body>
  </html>
)

export default Layout
