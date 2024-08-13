import React from 'react'
import Link from 'next/link'

import { Button, Flex, Text } from '@mantine/core'
import Theme from 'src/app/theme'

const ErrorNotFound = () => {
  return (
    <Flex direction={'column'} align={'center'}>
      <Text mt={50} size={'2.5rem'}>
        UNIVERSITEAMS
      </Text>
      <Text size={'8rem'}>404</Text>
      <Text my={'2rem'} pt={'2rem'} style={{ borderTop: '1px solid orange' }}>
        Error: Página o recurso no encontrado
      </Text>
      <Link href="/">
        <Button color={Theme.primaryColor}>Volver al inicio</Button>
      </Link>
    </Flex>
  )
}

export default ErrorNotFound
