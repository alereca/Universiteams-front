import React, { useMemo } from 'react'
import { Title, Flex, TextInput, Button, Stack, LoadingOverlay, Select } from '@mantine/core'
import { useForm } from '@mantine/form'
import Facility from '../../entities/Facility/Facility'
import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Facilities, FacilitiesQueryKey } from '../../services/facilities'
import { MRT_TableInstance } from 'mantine-react-table'
import { FacilityCreateDto } from '../../entities/Facility/FacilityCreateDto'
import { InstitutionQueryKey, Institutions } from '../../services/institutions'
import SelectItem from '../../entities/HelpTypes/SelectItem'
import Validation from '../../utils/string/Validation'

export interface FacilityEditFormProps {
  table: MRT_TableInstance<Facility>
}

const FacilityCreateForm: React.FC<FacilityEditFormProps> = ({ table }: FacilityEditFormProps) => {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (newFacility: FacilityCreateDto) => Facilities.createFacility(newFacility),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FacilitiesQueryKey] })
      notifications.show({
        title: 'Regional creada',
        message: 'La regional se ha creado exitosamente',
        color: 'green',
      })
      table.setCreatingRow(null)
    },
    onError: (error) => {
      notifications.show({
        title: 'Error al crear la regional',
        message: error.message,
        color: 'red',
      })
    },
  })

  const institutionsQuery = useQuery({
    queryKey: [InstitutionQueryKey],
    queryFn: () => Institutions.getInstitutions(),
  })

  const form = useForm<FacilityCreateDto>({
    initialValues: {
      name: '',
      abbreviation: '',
      web: '',
      institutionId: null,
    },
    validate: {
      name: (value) => (value ? null : 'Se require un nombre'),
      abbreviation: (value) => (value ? null : 'Se requiere una abreviatura'),
      institutionId: (value) => (value ? null : 'Se requiere una institución'),
      web: Validation.url,
    },
  })

  const handleSubmit = (values: FacilityCreateDto) => {
    createMutation.mutate(values)
  }

  const institutions: SelectItem[] = useMemo(() => {
    return (
      institutionsQuery.data?.map((institution) => ({
        value: String(institution.id),
        label: institution.name,
      })) ?? []
    )
  }, [institutionsQuery.data])

  return (
    <Stack>
      <LoadingOverlay visible={createMutation.isPending || institutionsQuery.isLoading} />
      <Title order={3}>Editar Regional</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Nombre"
          placeholder="Ingrese el nombre de la regional"
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Abreviatura"
          placeholder="Ingrese la abreviatura de la regional"
          {...form.getInputProps('abbreviation')}
        />
        <TextInput
          label="Web"
          placeholder="Ingrese el sitio web de la regional"
          {...form.getInputProps('web')}
        />
        <Select
          label="Institución"
          placeholder="Seleccione una institución"
          searchable
          data={institutions}
          {...form.getInputProps('institutionId')}
        />
        <Flex justify="flex-end" mt="xl">
          <Button type="submit">Guardar Cambios</Button>
        </Flex>
      </form>
    </Stack>
  )
}

export default FacilityCreateForm
