import React from 'react'
import Image from 'next/image'
import { ActionIcon, Burger, Center, Container, Group } from '@mantine/core'
import { IconSunMoon } from '@tabler/icons-react'

import SearchBar from '@/components/Common/SearchBar/SearchBar'
import { useRouter } from 'next/navigation'
import useSidebarStore from '../useSidebarStore'

interface HeaderProps {
  showNavAndSearch: boolean
  toggleColorScheme: () => void
}

const Header = (props: HeaderProps) => {
  const router = useRouter()
  const { opened, toggle } = useSidebarStore((state) => ({
    opened: state.opened,
    toggle: state.toggle,
  }))

  return (
    <>
      <Group ml={15} h="100%" gap="xs">
        {props.showNavAndSearch && (
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        )}
        <ActionIcon
          variant="transparent"
          color="blue.4"
          onClick={() => router.push('/')}
          aria-label="Universiteams Icon">
          <Image src="/favicon.ico" alt="Project favicon" width={32} height={32} />
        </ActionIcon>
        <ActionIcon
          variant="filled"
          color="orange.4"
          aria-label="Toggle dark/light theme"
          onClick={props.toggleColorScheme}>
          <IconSunMoon style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
        {props.showNavAndSearch && (
          <Container fluid>
            <Center>
              <SearchBar />
            </Center>
          </Container>
        )}
      </Group>
    </>
  )
}

export default Header
