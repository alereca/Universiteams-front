import React, { useEffect } from 'react'
import Link from 'next/link'

import { Button, Flex, Group, Text } from '@mantine/core'
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
    <Flex mt={'2rem'} direction={'column'} align={'center'}>
      <Text mt={'2rem'} size={'2.5rem'}>
        UNIVERSITEAMS
      </Text>
      <Text size={'6rem'}>Error</Text>
      <Text mt={'2rem'} pt={'2rem'} style={{ borderTop: `1px solid $'orange.4'` }}>
        Ha ocurrido un problema en la pantalla anterior
      </Text>
      <Group mt={'2rem'}>
        <Link href="/">
          <Button color={Theme.primaryColor}>Volver al inicio</Button>
        </Link>
      </Group>
      <Group mt={'2rem'}>
        <Link href="/about#reportBug">
          <Button color="orange.6">Reportar bug</Button>
        </Link>
      </Group>
      <Button mt={'2rem'} color="orange.6" onClick={() => props.reset()}>
        Intentar nuevamente
      </Button>
    </Flex>
  )
}

export default ErrorGeneric
