import React from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Button, LoadingOverlay, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

import { Projects, ProjectsQueryKey } from '@/services/projects'
import sanitizeHtml from 'sanitize-html'

import Enrollment from '@/entities/Enrollment/Enrollment'
import { EnrollmentRequestAdmin } from '@/entities/Enrollment/EnrollmentRequestReject'
import TextEditor from '../Common/TextEditor/TextEditor'

interface EnrollmentRequestProps {
  projectId: number
  enrollment: Enrollment
}

export const EnrollmentRevoke = (props: EnrollmentRequestProps): React.JSX.Element => {
  const form = useForm({ initialValues: { message: '' } })
  const queryClient = useQueryClient()

  const revokeEnrollmentMutation = useMutation({
    mutationFn: async (adminOptions: EnrollmentRequestAdmin) =>
      Projects.revokeEnrollment(props.projectId, props.enrollment.user.id, adminOptions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey, props.projectId] })
      notifications.show({
        title: 'Inscripción revocada',
        message: 'El usuario ya no es miembro del proyecto',
        color: 'blue',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error(error)
      notifications.show({
        title: 'Error al revocar la inscripción',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    const sanitizedMessage = sanitizeHtml(values.message)
    revokeEnrollmentMutation.mutate({
      message: sanitizedMessage,
    })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={revokeEnrollmentMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Text style={{ marginBottom: '1rem' }}>
        [Opcional] Puedes enviar un mensaje al usuario para explicar la decisión de revocar la
        inscripción
      </Text>
      <TextEditor onChange={(content) => form.setValues({ message: content })} />
      <Button type="submit" fullWidth mt="md" aria-label="Revocar inscripción" color="red">
        Revocar inscripción
      </Button>
    </form>
  )
}
