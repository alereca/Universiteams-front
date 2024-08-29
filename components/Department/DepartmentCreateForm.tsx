import React, { useMemo } from 'react'
import { Title, TextInput, Button, Stack, LoadingOverlay, Select, Group } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MRT_TableInstance } from 'mantine-react-table'
import SelectItem from '../../entities/HelpTypes/SelectItem'
import Validation from '../../utils/string/Validation'
import { DepartmentsQueryKey, ResearchDepartments } from '../../services/departments'
import { DepartmentCreateDto } from '../../entities/Department/DepartmentCreateDto'
import ResearchDepartment from '../../entities/ResearchDepartment'
import { Facilities, FacilitiesQueryKey, FacilityRelations } from '../../services/facilities'
import { AxiosError } from 'axios'

export interface DepartmentCreateFormProps {
  table: MRT_TableInstance<ResearchDepartment>
}

const DepartmentCreateForm: React.FC<DepartmentCreateFormProps> = ({
  table,
}: DepartmentCreateFormProps) => {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (newDepartment: DepartmentCreateDto) =>
      ResearchDepartments.createDepartment(newDepartment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DepartmentsQueryKey] })
      notifications.show({
        title: 'Departamento creado',
        message: 'El departamento se ha creado exitosamente',
        color: 'green',
      })
      table.setCreatingRow(null)
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: 'Error al crear el departamento',
        message: (error.response?.data as { message: string }).message ?? error.message,
        color: 'red',
      })
    },
  })

  const facilitiesQuery = useQuery({
    queryKey: [FacilitiesQueryKey],
    queryFn: () => Facilities.getFacilities({ relations: [FacilityRelations.institution] }),
  })

  const form = useForm<DepartmentCreateDto>({
    initialValues: {
      name: '',
      abbreviation: '',
      web: '',
      facilityId: null,
    },
    validate: {
      name: (value) => (value ? null : 'Se require un nombre'),
      abbreviation: (value) => (value ? null : 'Se requiere una abreviatura'),
      facilityId: (value) => (value ? null : 'Se requiere una regional'),
      web: Validation.url,
    },
  })

  const handleSubmit = (values: DepartmentCreateDto) => {
    createMutation.mutate(values)
  }

  const facilities: SelectItem[] = useMemo(() => {
    return (
      facilitiesQuery.data?.map((facility) => ({
        value: String(facility.id),
        label: `${facility.institution.name} ${facility.name}`,
      })) ?? []
    )
  }, [facilitiesQuery.data])

  return (
    <Stack>
      <LoadingOverlay visible={createMutation.isPending || facilitiesQuery.isLoading} />
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
        <Select
          label="Regional"
          placeholder="Seleccione una regional"
          searchable
          data={facilities}
          {...form.getInputProps('facilityId')}
        />
        <Group justify="flex-end" mt="xl" gap="xs">
          <Button color="red" onClick={() => table.setCreatingRow(null)}>
            Cancelar
          </Button>
          <Button type="submit">Crear</Button>
        </Group>
      </form>
    </Stack>
  )
}

export default DepartmentCreateForm
