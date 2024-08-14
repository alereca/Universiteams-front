import React from 'react'
import { AppShell, Divider, rem, ScrollArea } from '@mantine/core'
import NavbarItem from './NavbarItem'
import {
  IconBuilding,
  IconBulb,
  IconDoorExit,
  IconEdit,
  IconFolderHeart,
  IconFolders,
  IconMapPin,
  IconSchool,
  IconSend,
  IconTent,
  IconTerminal2,
  IconUserCircle,
  IconUsers,
} from '@tabler/icons-react'
import { CurrentUserQueryOptions, UserSystemRole } from '../../../services/currentUser'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { RequestState, ProjectSortAttribute } from '../../../entities/Project/ProjectInList'
import { Account } from '../../../services/account'
import UserBanner from './UserBanner'
import { useRouter } from 'next/navigation'

const mockAppVersion = 'v1.0.0'

// Icon properties
const iconSize = 40

const Navbar = () => {
  const { data: currentUser } = useQuery(CurrentUserQueryOptions.currentUser())

  const [userMenuOpened, userMenuHandlers] = useDisclosure(false)

  const router = useRouter()

  const logoutMutation = useMutation({
    mutationFn: () => Account.logout(),
    onSuccess: () => {
      router.push('/account/login')
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
          <UserBanner
            profileIcon={<IconUserCircle size={iconSize} />}
            name={currentUser.user}
            email={currentUser.email}
            onClick={userMenuHandlers.toggle}
          />
          {userMenuOpened && (
            <>
              <NavbarItem
                text="Editar Perfil"
                link="/account/profile"
                icon={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                small
                background="var(--mantine-color-gray-lightest)"
              />
              <NavbarItem
                text="Cerrar Sesión"
                icon={<IconDoorExit style={{ width: rem(14), height: rem(14) }} />}
                small
                background="var(--mantine-color-gray-lightest)"
                onClick={logoutMutation.mutate}
                link="#"
              />
            </>
          )}
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
      {currentUser && currentUser.systemRole === UserSystemRole.ADMIN && (
        <>
          <Divider />
          <AppShell.Section component={ScrollArea}>
            <NavbarItem
              text="Instituciones"
              link="/institutions"
              icon={<IconSchool size={iconSize} />}
            />
            <NavbarItem
              text="Regionales"
              link="/facilities"
              icon={<IconMapPin size={iconSize} />}
            />
            <NavbarItem
              text="Departamentos"
              link="/departments"
              icon={<IconBuilding size={iconSize} />}
            />
          </AppShell.Section>
        </>
      )}
      <AppShell.Section grow>
        <NavbarItem text="Sobre Nosotros" link="/about" icon={<IconTent size={iconSize} />} />
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
