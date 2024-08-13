import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, LoadingOverlay } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

import { Projects, ProjectsQueryKey } from '@/services/projects'
import sanitizeHtml from 'sanitize-html'

import { EnrollmentRequestInput } from '@/entities/Enrollment/EnrollmentRequestInput'
import TextEditor from '../Common/TextEditor/TextEditor'

interface EnrollmentRequestRevisionProps {
  projectId: number
  content?: string
}

export const EnrollmentRequestRevision = (props: EnrollmentRequestRevisionProps) => {
  const form = useForm({ initialValues: { message: '' } })
  const queryClient = useQueryClient()

  const enrollmentRequestUpdateMutation = useMutation({
    mutationFn: async (enrollmentRequest: EnrollmentRequestInput) => {
      return Projects.updateEnrollmentRequest(props.projectId, enrollmentRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
      notifications.show({
        title: 'Solicitud de inscripción actualizada',
        message: 'Espera a que el líder del proyecto acepte tu solicitud',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error('Enrollment request failed:', error)
      notifications.show({
        title: 'Error al actualizar la solicitud de inscripción',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    const sanitizedMessage = sanitizeHtml(values.message)
    enrollmentRequestUpdateMutation.mutate({ message: sanitizedMessage })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={enrollmentRequestUpdateMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <TextEditor
        content={props.content}
        onChange={(content) => form.setValues({ message: content })}
      />

      <Button type="submit" fullWidth mt="md">
        Actualizar
      </Button>
    </form>
  )
}
