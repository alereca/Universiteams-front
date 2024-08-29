import React from 'react'
import { Title, TextInput, Button, Stack, LoadingOverlay, Group } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Institutions, InstitutionQueryKey } from '../../services/institutions'
import { modals } from '@mantine/modals'
import { MRT_TableInstance } from 'mantine-react-table'
import { InstitutionUpdateDto } from '../../entities/Institution/InstitutionUpdateDto'
import Validation from '../../utils/string/Validation'
import Institution from '../../entities/Institution'
import { AxiosError } from 'axios'

export interface InstitutionEditFormProps {
  institution: Institution
  table: MRT_TableInstance<Institution>
}

const InstitutionEditForm: React.FC<InstitutionEditFormProps> = ({
  table,
  institution,
}: InstitutionEditFormProps) => {
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: (updatedInstitution: InstitutionUpdateDto) =>
      Institutions.updateInstitution(updatedInstitution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [InstitutionQueryKey] })
      notifications.show({
        title: 'Institución actualizada',
        message: 'La institución se ha actualizado exitosamente',
        color: 'green',
      })
      table.setEditingRow(null)
      modals.closeAll()
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: 'Error al actualizar la institución',
        message: (error.response?.data as { message: string }).message ?? error.message,
        color: 'red',
      })
    },
  })

  const form = useForm<InstitutionUpdateDto>({
    initialValues: {
      id: institution.id,
      name: institution.name,
      abbreviation: institution.abbreviation,
      web: institution.web,
    },
    validate: {
      name: (value) => (value ? null : 'Se requiere un nombre'),
      abbreviation: (value) => (value ? null : 'Se requiere una abreviatura'),
      web: Validation.url,
    },
  })

  const handleSubmit = (values: InstitutionUpdateDto) => {
    updateMutation.mutate(values)
  }

  return (
    <Stack>
      <LoadingOverlay visible={updateMutation.isPending} />
      <Title order={3}>Editar Institución</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xs">
          <TextInput
            label="Nombre"
            placeholder="Ingrese el nombre de la institución"
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Abreviatura"
            placeholder="Ingrese la abreviatura de la institución"
            {...form.getInputProps('abbreviation')}
          />
          <TextInput
            label="Web"
            placeholder="Ingrese el sitio web de la institución"
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

export default InstitutionEditForm
