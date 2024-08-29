import React from 'react'
import { Title, Flex, TextInput, Button, Stack, LoadingOverlay } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { modals } from '@mantine/modals'
import { MRT_TableInstance } from 'mantine-react-table'
import Validation from '../../utils/string/Validation'
import { DepartmentsQueryKey, ResearchDepartments } from '../../services/departments'
import { DepartmentUpdateDto } from '../../entities/Department/DepartmentUpdateDto'
import ResearchDepartment from '../../entities/ResearchDepartment'
import { AxiosError } from 'axios'

export interface DepartmentUpdateFormProps {
  facility: ResearchDepartment
  table: MRT_TableInstance<ResearchDepartment>
}

const DepartmentUpdateForm: React.FC<DepartmentUpdateFormProps> = ({
  table,
  facility: department,
}: DepartmentUpdateFormProps) => {
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: (updatedDepartment: DepartmentUpdateDto) =>
      ResearchDepartments.updateDepartment(updatedDepartment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DepartmentsQueryKey] })
      notifications.show({
        title: 'Departamento actualizada',
        message: 'La repartamento se ha actualizado exitosamente',
        color: 'green',
      })
      table.setEditingRow(null)
      modals.closeAll()
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: 'Error al actualizar el departamento',
        message: (error.response?.data as { message: string }).message ?? error.message,
        color: 'red',
      })
    },
  })

  const form = useForm<DepartmentUpdateDto>({
    initialValues: {
      id: department.id,
      name: department.name,
      abbreviation: department.abbreviation,
      web: department.web,
    },
    validate: {
      name: (value) => (value ? null : 'Se require un nombre'),
      abbreviation: (value) => (value ? null : 'Se requiere una abreviatura'),
      web: Validation.url,
    },
  })

  const handleSubmit = (values: DepartmentUpdateDto) => {
    updateMutation.mutate(values)
  }

  return (
    <Stack>
      <LoadingOverlay visible={updateMutation.isPending} />
      <Title order={3}>Editar Departamento</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Nombre"
          placeholder="Ingrese el nombre de el departamento"
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Abreviatura"
          placeholder="Ingrese la abreviatura de el departamento"
          {...form.getInputProps('abbreviation')}
        />
        <TextInput
          label="Web"
          placeholder="Ingrese el sitio web de el departamento"
          {...form.getInputProps('web')}
        />
        <Flex justify="flex-end" mt="xl">
          <Button type="submit">Guardar Cambios</Button>
        </Flex>
      </form>
    </Stack>
  )
}

export default DepartmentUpdateForm
