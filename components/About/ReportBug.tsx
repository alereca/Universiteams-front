import React from 'react'
import { Badge, Button, Card, Flex, Group, Image, Text, TextInput } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import {
  IconAlignBoxLeftBottom,
  IconInfoSquareRounded,
  IconMail,
  IconUser,
} from '@tabler/icons-react'
import Env from 'utils/config/Env'
import Theme from 'src/app/theme'

const AboutUniversiteams = () => {
  const isTablet = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
  const isPhone = useMediaQuery(`(max-width: ${Theme.breakpoints?.sm})`)

  // Report form inputs
  type ReportInputs = {
    name: string
    email: string
    subject: string
    message: string
  }

  // Format mail body
  const bodyFormat = (values: ReportInputs) => {
    const newLine = '%0D%0A'
    return `[Name: ${values.name}]${newLine}[Email: ${values.email}]${newLine}${newLine}${values.message}`
  }

  const handleSubmit = (values: ReportInputs) => {
    window.location.href = `mailto:${Env.contactMail}?subject=[UNIVERSITEAMS] ${
      values.subject
    }&body=${bodyFormat(values)}`
  }

  const form = useForm<ReportInputs>({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  return (
    <Card
      id="reportBug"
      shadow="sm"
      my="2rem"
      mx={isPhone ? '2rem' : isTablet ? '3rem' : '20%'}
      p="lg"
      radius="md"
      withBorder>
      <Card.Section p="1rem">
        <Flex justify="center">
          <Image src="/bug.jpeg" h="200" w="auto" alt="Bug report" p="rem" radius="md" />
        </Flex>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text size="xl">Reportar bug</Text>
        <Badge color="pink">Si encuentras uno</Badge>
      </Group>

      <form onSubmit={form.onSubmit((values: ReportInputs) => handleSubmit(values))}>
        <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
          <IconUser size={'2rem'} />
          <TextInput
            flex={1}
            label="Nombre"
            placeholder="Juan Doe"
            required
            {...form.getInputProps('name')}
          />
        </Flex>
        <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
          <IconMail size={'2rem'} />
          <TextInput
            flex={1}
            label="Email"
            placeholder="juandoe@gmail.com"
            required
            {...form.getInputProps('email')}
          />
        </Flex>
        <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
          <IconInfoSquareRounded size={'2rem'} />
          <TextInput
            flex={1}
            label="Asunto"
            placeholder="Error al filtrar proyectos"
            required
            {...form.getInputProps('subject')}
          />
        </Flex>
        <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
          <IconAlignBoxLeftBottom size={'2rem'} />
          <TextInput
            flex={1}
            label="Mensaje"
            placeholder="Cuando entro a proyectos y filtro por intereses, no se muestran los proyectos"
            required
            {...form.getInputProps('message')}
          />
        </Flex>

        <Button type="submit" color="blue" mt="xl" radius="md" fullWidth>
          Reportar bug
        </Button>
      </form>
    </Card>
  )
}

export default AboutUniversiteams
