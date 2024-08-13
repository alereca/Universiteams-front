import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { AppShell, Divider, ScrollArea } from '@mantine/core'
import NavbarItem from './NavbarItem'
import {
  IconAlertCircle,
  IconBuildingCommunity,
  IconBulb,
  IconFileDescription,
  IconFolderHeart,
  IconFolders,
  IconSend,
  IconShare,
  IconTerminal2,
  IconUserCircle,
  IconUsers,
} from '@tabler/icons-react'
import { CurrentUserQueryOptions } from '@/services/currentUser'
import { ProjectSortAttribute, RequestState } from '@/entities/Project/ProjectInList'

const mockAppVersion = 'v1.0.0'

// Icon properties
const iconSize = 40

const Navbar = () => {
  const { data: currentUser } = useQuery(CurrentUserQueryOptions.currentUser())

  return (
    <>
      {currentUser ? (
        <AppShell.Section>
          <NavbarItem
            text={currentUser.user}
            textSecondLine={currentUser.email}
            link="/account/profile"
            icon={<IconUserCircle size={iconSize} />}
          />
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
