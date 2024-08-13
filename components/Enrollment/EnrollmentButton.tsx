import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ActionIcon, Menu } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

import {
  IconUserPlus,
  IconSend,
  IconTrash,
  IconUserCheck,
  IconUserOff,
  IconPencil,
  IconEye,
} from '@tabler/icons-react'
import { CurrentUserQueryOptions } from '@/services/currentUser'
import { ProjectsQueryKey, Projects } from '@/services/projects'
import sanitize from 'sanitize-html'

import { EnrollmentRequestCreate } from './EnrollmentRequest'
import { EnrollmentRequestRejected } from './EnrollmentRequestRejected'
import { EnrollmentRequestRevision } from './EnrollmentRequestRevision'
import { EnrollmentRevoked } from './EnrollmentRevoked'
import { NotLoggedError } from '../Account/NotLoggedError'
import { RequestState } from '@/entities/Project/ProjectInList'
import { UnenrollModal } from './Unenroll'
import { verifyEmailNotification as verifyEmailErrorNotification } from '../Account/VerifyEmailNotification'

interface ActionIconComponentProps {
  projectId: number
  requestState?: RequestState | null
  requesterMessage?: string
  adminMessage?: string
}

const EnrollmentButton: React.FC<ActionIconComponentProps> = ({
  requestState,
  requesterMessage,
  adminMessage,
  projectId,
}) => {
  const queryClient = useQueryClient()

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const cancelEnrollmentRequestMutation = useMutation({
    mutationFn: () => Projects.cancelEnrollmentRequest(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
      notifications.show({
        title: 'Solicitud de inscripción cancelada',
        message: 'Tu solicitud de inscripción ha sido cancelada',
      })
    },
  })

  const handleEnrollmentRequestClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (errorCurrentUser || !currentUser) {
      notifications.show({
        title: 'Debes iniciar sesión para solicitar inscripciones',
        color: 'red',
        message: <NotLoggedError action="solicitar inscripciones" />,
      })

      return
    }

    if (currentUser?.isEmailVerified === false) {
      notifications.show(verifyEmailErrorNotification('solicitar inscripciones'))

      return
    }

    modals.open({
      title: 'Solicitar inscripción',
      centered: true,
      children: <EnrollmentRequestCreate projectId={projectId} />,
    })
  }

  const handleViewRequestClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    modals.open({
      title: 'Solicitud de inscripción',
      centered: true,
      children: <EnrollmentRequestRevision content={requesterMessage} projectId={projectId} />,
    })
  }

  const handleViewAdminMessageClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    modals.open({
      title: 'Mensaje del administrador',
      centered: true,
      children: <div dangerouslySetInnerHTML={{ __html: sanitize(adminMessage ?? '') }} />,
    })
  }

  const handleEnrollmentRequestCancelClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    cancelEnrollmentRequestMutation.mutate()
  }

  const handleEnrollmentRejectedClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    modals.open({
      title: 'Solicitud rechazada',
      centered: true,
      children: (
        <EnrollmentRequestRejected
          projectId={projectId}
          adminMessage={adminMessage}
          requesterMessage={requesterMessage}
        />
      ),
    })
  }

  const handleEnrollmentRevokedClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    modals.open({
      title: 'Inscripción revocada',
      centered: true,
      children: <EnrollmentRevoked projectId={projectId} adminMessage={adminMessage} />,
    })
  }

  const handleUnenrollClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    modals.open({
      title: 'Desinscribirse del proyecto',
      centered: true,
      children: <UnenrollModal projectId={projectId} />,
    })
  }

  switch (requestState) {
    case RequestState.Unenrolled:
    case undefined:
    case null:
      return (
        <ActionIcon
          variant="transparent"
          aria-label="Solicitar inscripción"
          onClick={handleEnrollmentRequestClick}
          size="lg"
          color="gray">
          <IconUserPlus />
        </ActionIcon>
      )
    case RequestState.Rejected:
      return (
        <ActionIcon
          variant="transparent"
          aria-label="Has sido rechazado"
          onClick={handleEnrollmentRejectedClick}
          size="lg"
          color="red">
          <IconUserOff />
        </ActionIcon>
      )
    case RequestState.Kicked:
      return (
        <ActionIcon
          variant="transparent"
          aria-label="Has sido expulsado"
          onClick={handleEnrollmentRevokedClick}
          size="lg"
          color="red">
          <IconUserOff />
        </ActionIcon>
      )
    case RequestState.Pending:
      return (
        <Menu position="bottom" offset={0}>
          <Menu.Target>
            <ActionIcon
              variant="transparent"
              aria-label="Opciones de solicitud"
              size="lg"
              color="blue"
              onClick={(event) => event.stopPropagation()}>
              <IconSend />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {requesterMessage && (
              <Menu.Item leftSection={<IconPencil size={14} />} onClick={handleViewRequestClick}>
                Revisar solicitud
              </Menu.Item>
            )}
            <Menu.Item
              leftSection={<IconTrash color="red" size={14} />}
              onClick={handleEnrollmentRequestCancelClick}>
              Cancelar solicitud
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )
    case RequestState.Accepted:
      return (
        <Menu position="bottom" offset={0}>
          <Menu.Target>
            <ActionIcon
              variant="transparent"
              aria-label="Ver opciones de inscripción"
              size="lg"
              color="blue"
              onClick={(event) => event.stopPropagation()}>
              <IconUserCheck />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {adminMessage && (
              <Menu.Item leftSection={<IconEye size={14} />} onClick={handleViewAdminMessageClick}>
                Ver mensaje del administrador
              </Menu.Item>
            )}
            <Menu.Item
              leftSection={<IconTrash color="red" size={14} />}
              onClick={handleUnenrollClick}>
              Cancelar inscripción
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )
    default:
      return <></>
  }
}

export default EnrollmentButton
