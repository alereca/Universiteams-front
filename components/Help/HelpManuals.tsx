import React from 'react'
import Link from 'next/link'
import { Anchor, Badge, Button, Card, Group, Image, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Env from 'utils/config/Env'
import Theme from 'src/app/theme'

const HelpManuals = () => {
  const isTablet = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
  const isPhone = useMediaQuery(`(max-width: ${Theme.breakpoints?.sm})`)

  return (
    <Card
      id="universiteamsHelp"
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
        <Text size="xl">Manuales de usuario | Universiteams</Text>
        <Badge color="pink">Manuales de ayuda</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        ¿Necesitas ayuda para utilizar esta plataforma? Aquí encontrarás manuales de usuario para
        aprender a utilizar Universiteams. Si tienes alguna duda, no dudes en contactar con el
        equipo de soporte técnico{' '}
        <Anchor
          href={`mailto:${Env.contactMail}`}
          target="_blank"
          underline="hover"
          style={{ color: '#fd7e14' }}>
          {Env.contactMail}
        </Anchor>
        .
      </Text>

      <Button color="blue" mt="md" radius="md">
        <Link
          href="https://px6qytsypezat9xj.public.blob.vercel-storage.com/Manual%20-%20Usuario%20visitante.pdf"
          style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Manual de usuario visitante
        </Link>
      </Button>
      <Button color="blue" mt="md" radius="md">
        <Link
          href="https://px6qytsypezat9xj.public.blob.vercel-storage.com/Manual%20-%20Usuario%20registrado.pdf"
          style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Manual de usuario registrado
        </Link>
      </Button>
      <Button color="orange.6" mt="md" radius="md">
        <Link
          href="https://px6qytsypezat9xj.public.blob.vercel-storage.com/Manual%20-%20Usuario%20Lider%20o%20Admin%20de%20Proyecto.pdf"
          style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Manual de usuario líder o administrador de proyecto
        </Link>
      </Button>
      <Button color="orange.6" mt="md" radius="md">
        <Link
          href="https://px6qytsypezat9xj.public.blob.vercel-storage.com/Manual%20-%20Usuario%20Administrador%20de%20Sistema.pdf"
          style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Manual de usuario administrador de sistema
        </Link>
      </Button>
    </Card>
  )
}

export default HelpManuals
