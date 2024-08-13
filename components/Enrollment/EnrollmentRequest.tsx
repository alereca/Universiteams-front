import React from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Button, LoadingOverlay, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

import { Projects, ProjectsQueryKey } from '@/services/projects'
import sanitizeHtml from 'sanitize-html'

import { EnrollmentRequestInput } from '@/entities/Enrollment/EnrollmentRequestInput'
import TextEditor from '../Common/TextEditor/TextEditor'

interface EnrollmentRequestProps {
  projectId: number
}

export const EnrollmentRequestCreate = (props: EnrollmentRequestProps): React.JSX.Element => {
  const form = useForm({ initialValues: { message: '' } })
  const queryClient = useQueryClient()

  const enrollmentRequestMutation = useMutation({
    mutationFn: async (enrollmentRequest: EnrollmentRequestInput) => {
      return Projects.requestEnrollment(props.projectId, enrollmentRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
      notifications.show({
        title: 'Solicitud de inscripción enviada',
        message: 'Espera a que el líder del proyecto acepte tu solicitud',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error('Enrollment request failed:', error)
      notifications.show({
        title: 'Error al enviar la solicitud de inscripción',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    const sanitizedMessage = sanitizeHtml(values.message)
    enrollmentRequestMutation.mutate({ message: sanitizedMessage })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={enrollmentRequestMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Text size="lg">[Opcional] Envía un mensaje al líder o admin del proyecto</Text>
      <Text size="sm">Puedes indicar tus motivaciones, habilidades, disponibilidad, etc.</Text>
      <TextEditor onChange={(content) => form.setValues({ message: content })} />
      <Button type="submit" fullWidth mt="md">
        Solicitar
      </Button>
    </form>
  )
}
