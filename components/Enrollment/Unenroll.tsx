import React from 'react'
import { LoadingOverlay, Textarea, Button } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Projects } from '../../services/projects'

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
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      notifications.show({
        title: 'Desinscripción ejecutada',
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
      <Textarea
        label="[Opcional] Indica el motivo de tu desinscripción"
        description="Puedes indicar porque te quieres desinscribir, sugerencias, etc."
        placeholder="Escribe aquí tu mensaje"
        data-autofocus
        resize="vertical"
        {...form.getInputProps('message')}
      />
      <Button type="submit" fullWidth mt="md" color="red">
        Darse de baja
      </Button>
    </form>
  )
}
