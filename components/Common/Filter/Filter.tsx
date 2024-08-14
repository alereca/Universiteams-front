import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ActionIcon, Button, Drawer, Flex, Group, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconFilter, IconXboxX } from '@tabler/icons-react'
import Theme from 'src/app/theme'

interface FilterProps {
  counter: number
  newButtonDirection?: string
  children: React.ReactNode
  content: React.ReactNode
}

const Filter = (props: FilterProps) => {
  const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
  const [opened, setOpened] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (isMobile === true) {
      setOpened(false)
    } else {
      setOpened(true)
    }
  }, [isMobile])

  const toggle = () => {
    setOpened((prevOpened) => !prevOpened)
  }

  const handleNewProject = () => {
    if (!props.newButtonDirection) return
    router.push(props.newButtonDirection)
  }

  const resultsCounter =
    props.counter && props.counter > 0 ? (
      <Text>
        {props.counter} {props.counter != 1 ? 'Resultados' : 'Resultado'}
      </Text>
    ) : (
      <Text>Sin resultados</Text>
    )

  return (
    <>
      {props.newButtonDirection && (
        <Group
          justify={isMobile ? 'flex-end' : 'flex-start'}
          mt={'1rem'}
          mx={isMobile ? '1rem' : '1.4rem'}>
          <Button onClick={() => handleNewProject()}>Nuevo proyecto</Button>
        </Group>
      )}
      <Group justify={isMobile ? 'flex-end' : 'flex-start'} gap="xs">
        <Group my={'1rem'}>{isMobile && resultsCounter}</Group>
        <ActionIcon
          variant="transparent"
          aria-label="Filter"
          size="lg"
          onClick={() => toggle()}
          ml={!isMobile ? 'xs' : 0}>
          <IconFilter style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
        <Group my={'1rem'}>{!isMobile && resultsCounter}</Group>
      </Group>

      {isMobile ? (
        <>
          <Drawer
            opened={opened}
            onClose={() => setOpened(false)}
            closeButtonProps={{
              icon: <IconXboxX size={20} />,
            }}
            padding="xl"
            size="100vw"
            position="right">
            {props.content}
          </Drawer>
          {props.children}
        </>
      ) : (
        <Flex direction="row-reverse">
          <div
            style={{
              minWidth: opened ? '210px' : '0',
              maxWidth: opened ? '294px' : '0',
              padding: opened ? '1rem' : '0',
              overflow: 'hidden',
              transition: 'width 0.3s ease, padding 0.3s ease',
            }}>
            {opened && props.content}
          </div>
          <div style={{ flex: 1 }}>{props.children}</div>
        </Flex>
      )}
    </>
  )
}

export default Filter
