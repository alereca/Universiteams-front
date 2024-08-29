import React from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Button, LoadingOverlay, Select } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

import Localize from 'utils/string/Localize'
import { Projects, ProjectsQueryKey } from '@/services/projects'

import Enrollment, { ProjectRole } from '@/entities/Enrollment/Enrollment'
import { EnrollmentChangeRole } from '@/entities/Enrollment/EnrollmentChangeRole'

interface EnrollmentChangeRoleProps {
  projectId: number
  enrollment: Enrollment
  currentRole: ProjectRole
}

export const EnrollmentChangeRoleForm = (props: EnrollmentChangeRoleProps): React.JSX.Element => {
  const form = useForm({ initialValues: { role: props.currentRole } })
  const queryClient = useQueryClient()

  const enrollmentChangeRoleMutation = useMutation({
    mutationFn: (changeRoleInput: EnrollmentChangeRole) =>
      Projects.changeEnrollmentRole(props.projectId, props.enrollment.user.id, changeRoleInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey, props.projectId] })
      notifications.show({
        title: 'Rol cambiado',
        message: 'El rol ha sido cambiado correctamente',
      })
      modals.closeAll()
    },
    onError: (error) => {
      console.error('Error al cambiar el rol', error)
      notifications.show({
        title: 'Error al cambiar el rol',
        message: 'Por favor, inténtalo de nuevo más tarde',
        color: 'red',
      })
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    enrollmentChangeRoleMutation.mutate({ role: values.role })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={enrollmentChangeRoleMutation.isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      <Select
        label={`Rol de ${props.enrollment.user.firstName} ${props.enrollment.user.lastName}`}
        placeholder="Pick value"
        data={Object.values(ProjectRole).map((role) => ({
          value: role,
          label: Localize.projectRole(role),
        }))}
        {...form.getInputProps('role')}
      />

      <Button type="submit" fullWidth mt="md">
        Cambiar
      </Button>
    </form>
  )
}
