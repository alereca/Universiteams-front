import React from 'react'
import { Title, TextInput, Button, Stack, LoadingOverlay, Group } from '@mantine/core'
import { useForm } from '@mantine/form'
import Facility from '../../entities/Facility/Facility'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Facilities, FacilitiesQueryKey } from '../../services/facilities'
import { modals } from '@mantine/modals'
import { MRT_TableInstance } from 'mantine-react-table'
import { FacilityUpdateDto } from '../../entities/Facility/FacilityUpdateDto'
import Validation from '../../utils/string/Validation'
import { AxiosError } from 'axios'

export interface FacilityEditFormProps {
  facility: Facility
  table: MRT_TableInstance<Facility>
}

const FacilityEditForm: React.FC<FacilityEditFormProps> = ({
  table,
  facility,
}: FacilityEditFormProps) => {
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: (updatedFacility: FacilityUpdateDto) => Facilities.updateFacility(updatedFacility),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FacilitiesQueryKey] })
      notifications.show({
        title: 'Regional actualizada',
        message: 'La regional se ha actualizado exitosamente',
        color: 'green',
      })
      table.setEditingRow(null)
      modals.closeAll()
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: 'Error al actualizar la regional',
        message: (error.response?.data as { message: string }).message ?? error.message,
        color: 'red',
      })
    },
  })

  const form = useForm<FacilityUpdateDto>({
    initialValues: {
      id: facility.id,
      name: facility.name,
      abbreviation: facility.abbreviation,
      web: facility.web,
    },
    validate: {
      name: (value) => (value ? null : 'Se require un nombre'),
      abbreviation: (value) => (value ? null : 'Se requiere una abreviatura'),
      web: Validation.url,
    },
  })

  const handleSubmit = (values: FacilityUpdateDto) => {
    updateMutation.mutate(values)
  }

  return (
    <Stack>
      <LoadingOverlay visible={updateMutation.isPending} />
      <Title order={3}>Editar Regional</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xs">
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
        </Stack>
        <Group justify="flex-end" mt="xl" gap="xs">
          <Button color="red" onClick={() => table.setEditingRow(null)}>
            Cancelar
          </Button>
          <Button type="submit">Guardar Cambios</Button>
        </Group>
      </form>
    </Stack>
  )
}

export default FacilityEditForm
