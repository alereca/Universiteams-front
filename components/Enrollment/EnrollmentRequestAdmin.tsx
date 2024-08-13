import React from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Button, LoadingOverlay, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'

import { EnrollmentRequestsQueryKey, Projects } from '@/services/projects'
import sanitizeHtml from 'sanitize-html'

import { EnrollmentRequestAdmin } from '@/entities/Enrollment/EnrollmentRequestReject'
import { EnrollmentRequestShow } from '@/entities/Enrollment/EnrollmentRequestShow'
import TextEditor from '../Common/TextEditor/TextEditor'

interface AdminMutation {
  userId: number
  adminOptions: EnrollmentRequestAdmin
}

interface EnrollmentRequestProps {
  projectId: number
  request: EnrollmentRequestShow
  action: 'approve' | 'reject'
}

export const EnrollmentRequestAdminForm = (props: EnrollmentRequestProps): React.JSX.Element => {
  const form = useForm({ initialValues: { message: '' } })
  const queryClient = useQueryClient()

  const approveEnrollmentRequestMutation = useMutation({
    mutationFn: async (params: AdminMutation) =>
      Projects.approveEnrollmentRequest(props.projectId, params.userId, params.adminOptions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EnrollmentRequestsQueryKey, props.projectId] })
      notifications.show({
        title: 'Solicitud de inscripción aprobada',
        message: 'El usuario ahora es miembro del proyecto',
        color: 'blue',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error(error)
      notifications.show({
        title: 'Error al aprobar la solicitud de inscripción',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const rejectEnrollmentRequestMutation = useMutation({
    mutationFn: async (params: AdminMutation) =>
      Projects.rejectEnrollmentRequest(props.projectId, params.userId, params.adminOptions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EnrollmentRequestsQueryKey, props.projectId] })
      notifications.show({
        title: 'Solicitud de inscripción rechazada',
        message: 'El usuario sera notificado de la decisión',
        color: 'blue',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error(error)
      notifications.show({
        title: 'Error al rechazar la solicitud de inscripción',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    const sanitizedMessage = sanitizeHtml(values.message)

    switch (props.action) {
      case 'approve':
        approveEnrollmentRequestMutation.mutate({
          userId: props.request.user.id,
          adminOptions: {
            message: sanitizedMessage,
          },
        })
        break
      case 'reject':
        rejectEnrollmentRequestMutation.mutate({
          userId: props.request.user.id,
          adminOptions: {
            message: sanitizedMessage,
          },
        })
        break
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={
          props.action === 'approve'
            ? approveEnrollmentRequestMutation.isPending
            : rejectEnrollmentRequestMutation.isPending
        }
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Text style={{ marginBottom: '1rem' }}>
        {props.action === 'reject'
          ? `[Opcional] ¿Por qué rechazas la solicitud de inscripción? Este mensaje será enviado al usuario`
          : '[Opcional] Indica un mensaje para el usuario aceptado. Por ejemplo, instrucciones para comenzar a colaborar'}
      </Text>
      <TextEditor onChange={(content) => form.setValues({ message: content })} />
      <Button
        type="submit"
        fullWidth
        mt="md"
        aria-label="Rechazar solicitud"
        color={props.action === 'approve' ? 'blue' : 'red'}>
        {props.action === 'approve' ? 'Aprobar solicitud' : 'Rechazar solicitud'}
      </Button>
    </form>
  )
}
