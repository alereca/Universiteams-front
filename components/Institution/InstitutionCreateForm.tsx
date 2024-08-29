import React from 'react'
import { Title, TextInput, Button, Stack, LoadingOverlay, Group } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Institutions, InstitutionQueryKey } from '../../services/institutions'
import { MRT_TableInstance } from 'mantine-react-table'
import { InstitutionCreateDto } from '../../entities/Institution/InstitutionCreateDto'
import Validation from '../../utils/string/Validation'
import Institution from '../../entities/Institution'
import { AxiosError } from 'axios'

export interface InstitutionEditFormProps {
  table: MRT_TableInstance<Institution>
}

const InstitutionCreateForm: React.FC<InstitutionEditFormProps> = ({
  table,
}: InstitutionEditFormProps) => {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (newInstitution: InstitutionCreateDto) =>
      Institutions.createInstitution(newInstitution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [InstitutionQueryKey] })
      notifications.show({
        title: 'Institución creada',
        message: 'La institución se ha creado exitosamente',
        color: 'green',
      })
      table.setCreatingRow(null)
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: 'Error al crear la institución',
        message: (error.response?.data as { message: string }).message ?? error.message,
        color: 'red',
      })
    },
  })

  const institutionsQuery = useQuery({
    queryKey: [InstitutionQueryKey],
    queryFn: () => Institutions.getInstitutions(),
  })

  const form = useForm<InstitutionCreateDto>({
    initialValues: {
      name: '',
      abbreviation: '',
      web: '',
    },
    validate: {
      name: (value) => (value ? null : 'Se requiere un nombre'),
      abbreviation: (value) => (value ? null : 'Se requiere una abreviatura'),
      web: Validation.url,
    },
  })

  const handleSubmit = (values: InstitutionCreateDto) => {
    createMutation.mutate(values)
  }

  return (
    <Stack>
      <LoadingOverlay visible={createMutation.isPending || institutionsQuery.isLoading} />
      <Title order={3}>Crear Institución</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
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

export default InstitutionCreateForm
