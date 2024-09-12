import React from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { LoadingOverlay, Button, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

import { Projects, ProjectsQueryKey } from '@/services/projects'
import TextEditor from '../Common/TextEditor/TextEditor'

interface EnrollmentCancelProps {
  projectId: number
}

export const UnenrollModal = (props: EnrollmentCancelProps): React.JSX.Element => {
  const form = useForm({ initialValues: { message: '' } })
  const queryClient = useQueryClient()

  const unenrollMutation = useMutation({
    mutationFn: async (unenrollOptions: Unenroll) => {
      return Projects.unenroll(props.projectId, unenrollOptions)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
      notifications.show({
        title: 'Inscripción cancelada',
        message: 'Te has dado de baja del proyecto correctamente',
      })
      modals.closeAll()
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    unenrollMutation.mutate({ message: values.message })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={unenrollMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      <Text>[Opcional] Indica el motivo de tu desvinculación</Text>
      <Text size="sm" c="gray">
        Puedes indicar porque te quieres desvincular del proyecto, sugerencias, etc.
      </Text>

      <TextEditor onChange={(content) => form.setValues({ message: content })} />

      <Button type="submit" fullWidth mt="md" color="red">
        Darse de baja
      </Button>
    </form>
  )
}
