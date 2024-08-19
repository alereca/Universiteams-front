import React from 'react'
import Link from 'next/link'
import { Badge, Button, Card, Flex, Group, Image, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Theme from 'src/app/theme'

const AboutUniversiteams = () => {
  const isTablet = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
  const isPhone = useMediaQuery(`(max-width: ${Theme.breakpoints?.sm})`)

  return (
    <Card
      id="team120"
      shadow="sm"
      my="4rem"
      mx={isPhone ? '2rem' : isTablet ? '3rem' : '20%'}
      p="lg"
      radius="md"
      withBorder>
      <Card.Section p="1rem">
        <Flex justify="center">
          <Image src="/team120.jpeg" h="200" w="auto" alt="Team 120 logo" p="rem" radius="md" />
        </Flex>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text size="xl">Team 120</Text>
        <Badge color="pink">GitHub org</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        Somos una pequeña <i>GitHub organization</i> formada por graduados de la{' '}
        <b>Universidad Tecnológica Nacional</b> (Argentina), con ganas de desarrollar aplicaciones
        que consideramos pueden ser útiles pero que aún no existen.
      </Text>
      <Text size="sm" mt="1rem" c="dimmed">
        Todo nuestro código fuente es de acceso público y se puede visualizar en línea en{' '}
        <i>GitHub</i>. Para <b>Universiteams</b> tenemos 2 repositorios de código: Universiteams
        (backend) y Universiteams-front (frontend).
      </Text>

      <Button color="blue" mt="md" radius="md">
        <Link
          target="_blank"
          href="https://github.com/team120"
          style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Visitar GitHub.com/Team120
        </Link>
      </Button>
      <Button color="orange.6" mt="md" radius="md">
        <Link
          target="_blank"
          href="https://github.com/team120/Universiteams"
          style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Visitar Universiteams backend repo
        </Link>
      </Button>
      <Button color="orange.6" mt="md" radius="md">
        <Link
          target="_blank"
          href="https://github.com/team120/Universiteams-front  "
          style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Visitar Universiteams frontend repo
        </Link>
      </Button>
    </Card>
  )
}

export default AboutUniversiteams
