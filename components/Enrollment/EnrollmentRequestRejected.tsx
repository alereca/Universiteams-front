import React, { useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Group, LoadingOverlay, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

import { Projects, ProjectsQueryKey } from '@/services/projects'
import sanitize from 'sanitize-html'

interface EnrollmentRequestRejectedProps {
  projectId: number
  requesterMessage?: string
  adminMessage?: string
}

export const EnrollmentRequestRejected = (
  props: EnrollmentRequestRejectedProps
): React.JSX.Element => {
  const queryClient = useQueryClient()

  const cancelEnrollmentRequestMutation = useMutation({
    mutationFn: () => Projects.cancelEnrollmentRequest(props.projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
      notifications.show({
        title: 'Solicitud de inscripción cancelada',
        message: 'Tu solicitud de inscripción ha eliminada correctamente',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error('Error al descartar la solicitud de inscripción', error)
      notifications.show({
        title: 'Error al descartar la solicitud de inscripción',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const handleCancelRequest = () => {
    cancelEnrollmentRequestMutation.mutate()
  }

  const requesterMessageSanitized = useMemo(
    () => sanitize(props.requesterMessage || ''),
    [props.requesterMessage]
  )

  const adminMessageSanitized = useMemo(
    () => sanitize(props.adminMessage || ''),
    [props.adminMessage]
  )

  return (
    <>
      <LoadingOverlay
        visible={cancelEnrollmentRequestMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      {requesterMessageSanitized && (
        <>
          <Text size="lg" fw={700}>
            Tu mensaje
          </Text>
          <div dangerouslySetInnerHTML={{ __html: requesterMessageSanitized }} />
        </>
      )}

      {adminMessageSanitized && (
        <>
          <Text size="lg" fw={700}>
            Mensaje del administrador del proyecto
          </Text>
          <div dangerouslySetInnerHTML={{ __html: adminMessageSanitized }} />
        </>
      )}

      <Group gap="xs" justify="flex-end">
        <Button color="red" fullWidth onClick={handleCancelRequest}>
          Descartar
        </Button>
      </Group>
    </>
  )
}
