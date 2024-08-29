import React from 'react'
import Link from 'next/link'

import { Button, Flex, Group, Text } from '@mantine/core'
import Theme from 'src/app/theme'

const ErrorNotFound = () => {
  return (
    <Flex mt={'2rem'} direction={'column'} align={'center'}>
      <Text mt={'2rem'} size={'2.5rem'}>
        UNIVERSITEAMS
      </Text>
      <Text size={'8rem'}>404</Text>
      <Text mt={'2rem'} pt={'2rem'} style={{ borderTop: '1px solid orange' }}>
        Error: Página o recurso no encontrado
      </Text>
      <Group mt={'2rem'}>
        <Link href="/">
          <Button color={Theme.primaryColor}>Volver al inicio</Button>
        </Link>
      </Group>
      <Group mt={'2rem'}>
        <Link href="/help#reportBug">
          <Button color="orange.6">Reportar bug</Button>
        </Link>
      </Group>
    </Flex>
  )
}

export default ErrorNotFound
