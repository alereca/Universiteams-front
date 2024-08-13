'use client'
import React from 'react'
import ErrorGeneric from '@/components/Common/Error/ErrorGeneric'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

const Error = (props: ErrorProps) => {
  return <ErrorGeneric error={props.error} reset={props.reset} />
}

export default Error
