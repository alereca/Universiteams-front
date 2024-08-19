import React from 'react'
import Link from 'next/link'
import { Badge, Button, Card, Group, Image, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Theme from 'src/app/theme'

const AboutUniversiteams = () => {
  const isTablet = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
  const isPhone = useMediaQuery(`(max-width: ${Theme.breakpoints?.sm})`)

  return (
    <Card
      id="universiteams"
      shadow="sm"
      my="2rem"
      mx={isPhone ? '2rem' : isTablet ? '3rem' : '20%'}
      p="lg"
      radius="md"
      withBorder>
      <Card.Section p="1rem">
        <Image src="/universiteams_banner.png" alt="Universiteams banner" p="rem" radius="md" />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text size="xl">Universiteams</Text>
        <Badge color="pink">Android/iOS/Web</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        Este proyecto nace con el objetivo de facilitar la creación, gestión y formalización de
        proyectos de investigación universitarios. Tanto estudiantes como profesores tienen la
        posibilidad administrar sus proyectos, que serán visibles para otros estudiantes que quieran
        sumarse al equipo de investigación.
      </Text>
      <Text size="sm" mt="1rem" c="dimmed">
        El proyecto consiste principalmente de una <i>Web App</i>, con una página principal que
        contiene todos los proyectos con el fin de darlos a conocer al público, y aceptar o rechazar
        solicitudes para aquellos que quieran participar en los mismos.
      </Text>
      <Text size="sm" mt="1rem">
        <b>Nuestro principal objetivo es facilitar y promover la divulgación científica.</b>
      </Text>

      <Button color="blue" mt="md" radius="md">
        <Link
          target="_blank"
          href="https://www.universiteams.com"
          style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Visitar Universiteams.com
        </Link>
      </Button>
      <Button color="orange.6" mt="md" radius="md">
        <Link
          target="_blank"
          href="https://api.universiteams.com/Docs"
          style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Visitar API de Universiteams
        </Link>
      </Button>
    </Card>
  )
}

export default AboutUniversiteams
