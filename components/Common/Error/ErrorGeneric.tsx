import React, { useEffect } from 'react'
import Link from 'next/link'

import { Button, Flex, Text } from '@mantine/core'
import Theme from 'src/app/theme'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

const ErrorGeneric = (props: ErrorProps) => {
  useEffect(() => {
    console.error(props.error)
  }, [props.error])

  return (
    <Flex direction={'column'} align={'center'}>
      <Text mt={50} size={'2.5rem'}>
        UNIVERSITEAMS
      </Text>
      <Text size={'6rem'}>Error</Text>
      <Text my={'2rem'} pt={'2rem'} style={{ borderTop: `1px solid $'orange.4'` }}>
        Ha ocurrido un problema en la pantalla anterior
      </Text>
      <Button mb={20} color="orange.4" onClick={() => props.reset()}>
        Intentar nuevamente
      </Button>
      <Link href="/">
        <Button color={Theme.primaryColor}>Volver al inicio</Button>
      </Link>
    </Flex>
  )
}

export default ErrorGeneric
