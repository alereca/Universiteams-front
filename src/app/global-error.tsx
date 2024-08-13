'use client'
import React from 'react'
import Head from 'next/head'
import ErrorGeneric from '@/components/Common/Error/ErrorGeneric'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

const GlobalError = (props: ErrorProps) => {
  return (
    <html>
      <Head>
        <title>Universiteams</title>
        <meta name="description" content="Pro Scientific Dissemination & Volunteering" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <ErrorGeneric error={props.error} reset={props.reset} />
      </body>
    </html>
  )
}

export default GlobalError
