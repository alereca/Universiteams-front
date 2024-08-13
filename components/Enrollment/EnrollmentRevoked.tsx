import React, { useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Group, LoadingOverlay, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

import { Projects, ProjectsQueryKey } from '@/services/projects'
import sanitize from 'sanitize-html'

interface EnrollmentRevokedProps {
  projectId: number
  adminMessage?: string
}

export const EnrollmentRevoked = (props: EnrollmentRevokedProps): React.JSX.Element => {
  const queryClient = useQueryClient()

  const ackKickMutation = useMutation({
    mutationFn: () => Projects.ackKick(props.projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
      notifications.show({
        title: 'Mensaje de expulsion descartado',
        message: 'El mensaje de expulsion ha sido descartado correctamente',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error('Error al descartar la solicitud de inscripción', error)
      notifications.show({
        title: 'Error al descartar el mensaje de expulsion',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const handleCancelRequest = () => {
    ackKickMutation.mutate()
  }

  const adminMessageSanitized = useMemo(
    () => sanitize(props.adminMessage || ''),
    [props.adminMessage]
  )

  return (
    <>
      <LoadingOverlay
        visible={ackKickMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

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
