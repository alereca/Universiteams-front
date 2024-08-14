import React from 'react'
import { AppShell, Divider, Menu, rem, ScrollArea } from '@mantine/core'
import NavbarItem from './NavbarItem'
import {
  IconAlertCircle,
  IconBuildingCommunity,
  IconBulb,
  IconDoorExit,
  IconEdit,
  IconFileDescription,
  IconFolderHeart,
  IconFolders,
  IconSend,
  IconShare,
  IconTerminal2,
  IconUserCircle,
  IconUsers,
} from '@tabler/icons-react'
import { CurrentUserQueryOptions } from '../../../services/currentUser'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { Link } from 'tabler-icons-react'
import { RequestState, ProjectSortAttribute } from '../../../entities/Project/ProjectInList'
import { Account } from '../../../services/account'
import Theme from '../../../src/app/theme'
import UserBanner from './UserBanner'

const mockAppVersion = 'v1.0.0'

// Icon properties
const iconSize = 40

const Navbar = () => {
  const { data: currentUser } = useQuery(CurrentUserQueryOptions.currentUser())

  const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

  const logoutMutation = useMutation({
    mutationFn: () => Account.logout(),
    onSuccess: () => {
      window.location.reload()
    },
    onError: (error) => {
      console.error(error)
      notifications.show({
        title: 'Error',
        message: 'No se pudo cerrar sesión. Intente mas tarde.',
        color: 'red',
      })
    },
  })

  return (
    <>
      {currentUser ? (
        <AppShell.Section>
          <Menu
            loop={false}
            withinPortal={false}
            trapFocus={false}
            menuItemTabIndex={0}
            shadow="md"
            position={isMobile ? 'bottom' : 'right'}
            width={isMobile ? '90%' : undefined}
            withArrow>
            <Menu.Target>
              <UserBanner
                profileIcon={<IconUserCircle size={iconSize} />}
                name={currentUser.user}
                email={currentUser.email}
              />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                component={Link}
                href="/account/profile"
                leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                Editar Perfil
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  logoutMutation.mutate()
                }}
                leftSection={<IconDoorExit style={{ width: rem(14), height: rem(14) }} />}>
                Cerrar Sesión
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </AppShell.Section>
      ) : (
        <AppShell.Section>
          <NavbarItem
            text="Iniciar Sesión"
            link="/account/login"
            icon={<IconUserCircle size={iconSize} />}
          />
        </AppShell.Section>
      )}
      <Divider />
      <AppShell.Section>
        {currentUser && (
          <NavbarItem
            text="Mis Proyectos"
            link={`/projects?requestState=${RequestState.Accepted}&requestState=${RequestState.Kicked}&sortBy=${ProjectSortAttribute.RequestEnrollmentCount}&inAscendingOrder=false`}
            icon={<IconBulb size={iconSize} />}
          />
        )}
        {currentUser && (
          <NavbarItem
            text="Mis Solicitudes"
            link={`/projects?requestState=${RequestState.Pending}&requestState=${RequestState.Rejected}`}
            icon={<IconSend size={iconSize} />}
          />
        )}
        <NavbarItem text="Proyectos" link="/projects" icon={<IconFolders size={iconSize} />} />
        {currentUser && (
          <NavbarItem
            text="Proyectos Favoritos"
            link="/projects?isFavorite=true"
            icon={<IconFolderHeart size={iconSize} />}
          />
        )}
        {currentUser && (
          <NavbarItem text="Usuarios" link="/users" icon={<IconUsers size={iconSize} />} />
        )}
      </AppShell.Section>
      <Divider />
      <AppShell.Section grow component={ScrollArea}>
        <NavbarItem
          text="Sobre Nosotros"
          link="/about"
          icon={<IconBuildingCommunity size={iconSize} />}
        />
        <NavbarItem
          text="Términos y Condiciones"
          link="/terminos"
          icon={<IconFileDescription size={iconSize} />}
        />
        <NavbarItem text="Compartir Aplicación" icon={<IconShare size={iconSize} />} />
        <NavbarItem text="Reportar un Bug" icon={<IconAlertCircle size={iconSize} />} />
      </AppShell.Section>
      <Divider />
      <AppShell.Section>
        <NavbarItem
          text={`Universiteams ${mockAppVersion}`}
          icon={<IconTerminal2 size={30} />}
          small
        />
      </AppShell.Section>
    </>
  )
}

export default Navbar
