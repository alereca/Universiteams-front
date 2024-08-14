'use client'
import React, { useMemo, useState } from 'react'
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  MRT_EditActionButtons,
  MRT_Row,
} from 'mantine-react-table'
import { NextPage } from 'next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { InstitutionQueryKey, Institutions } from '../../../services/institutions'
import Institution from '../../../entities/Institution'
import {
  ActionIcon,
  Alert,
  Anchor,
  Box,
  Button,
  Center,
  Flex,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { IconAlertCircle, IconArrowLeft, IconEdit, IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import { InstitutionUpdateDto } from '../../../entities/Institution/InstitutionUpdateDto'
import { InstitutionCreateDto } from '../../../entities/Institution/InstitutionCreateDto'
import { CurrentUserQueryOptions, UserSystemRole } from '../../../services/currentUser'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { excludeProperty } from '../../../utils/mapper'
import SkeletonFull from '../../../components/Common/Loader/SkeletonFull'

const InstitutionAdminPage: NextPage = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})

  const router = useRouter()

  const handleGoToLoginClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.push('/account/login')
  }

  const currentUserQuery = useQuery(CurrentUserQueryOptions.currentUser())

  const queryClient = useQueryClient()

  const columns = useMemo<MRT_ColumnDef<Institution>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
        mantineEditTextInputProps: {
          required: true,
          error: validationErrors?.name,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
        },
      },
      {
        accessorKey: 'abbreviation',
        header: 'Abreviatura',
        mantineEditTextInputProps: {
          required: true,
          error: validationErrors?.abbreviation,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              abbreviation: undefined,
            }),
        },
      },
      {
        accessorKey: 'web',
        header: 'Web',
        mantineEditTextInputProps: {
          type: 'url',
          error: validationErrors?.web,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              web: undefined,
            }),
        },
      },
    ],
    [validationErrors]
  )

  const institutionsQuery = useQuery({
    queryKey: [InstitutionQueryKey],
    queryFn: () => Institutions.getInstitutions(),
  })

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
    },
    onError: (error) => {
      notifications.show({
        title: 'Error al crear la institución',
        message: error.message,
        color: 'red',
      })
    },
  })

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
    },
    onError: (error) => {
      notifications.show({
        title: 'Error al actualizar la institución',
        message: error.message,
        color: 'red',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => Institutions.deleteInstitution(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [InstitutionQueryKey] })
      notifications.show({
        title: 'Institución eliminada',
        message: 'La institución se ha eliminado exitosamente',
        color: 'green',
      })
      modals.closeAll()
    },
    onError: (error) => {
      notifications.show({
        title: 'Error al eliminar la institución',
        message: error.message,
        color: 'red',
      })
      modals.closeAll()
    },
  })

  const openDeleteConfirmModal = (row: MRT_Row<Institution>) =>
    modals.openConfirmModal({
      title: '¿Está seguro que desea eliminar esta institución?',
      children: (
        <Text>
          ¿Está seguro que desea eliminar la institución {row.original.name}? Esta acción no se
          puede deshacer.
        </Text>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMutation.mutate(row.original.id),
    })

  const table = useMantineReactTable({
    columns,
    data: institutionsQuery.data ?? [],
    enableColumnPinning: true,
    initialState: {
      columnPinning: {
        left: ['mrt-row-actions'],
      },
    },
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (originalRow) => String(originalRow.id),
    mantineToolbarAlertBannerProps: institutionsQuery.isError
      ? {
          color: 'red',
          children: 'Error al cargar los datos',
        }
      : undefined,
    mantineTableContainerProps: {
      style: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: async ({
      values,
      exitCreatingMode,
    }: {
      exitCreatingMode: () => void
      values: InstitutionCreateDto
    }) => {
      const newValidationErrors = validateInstitution(values)
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors)
        return
      }
      setValidationErrors({})
      const createValues = excludeProperty(values as Institution, 'id')
      await createMutation.mutateAsync(createValues)
      exitCreatingMode()
    },
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: async ({ values, table }) => {
      const newValidationErrors = validateInstitution(values)
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors)
        return
      }
      setValidationErrors({})
      await updateMutation.mutateAsync(values)
      table.setEditingRow(null)
    },
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Crear Nueva Institución</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Editar Institución</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Editar">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Eliminar">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          table.setCreatingRow(true)
        }}>
        Crear Nueva Institución
      </Button>
    ),
    state: {
      isLoading: institutionsQuery.isLoading,
      isSaving: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
      showAlertBanner: institutionsQuery.isError,
      showProgressBars: institutionsQuery.isFetching,
    },
  })

  if (currentUserQuery.isLoading) return <SkeletonFull />

  if (
    currentUserQuery.error instanceof AxiosError &&
    currentUserQuery.error.response?.status === 401
  ) {
    return (
      <>
        <Alert variant="light" color="red.6" title="Error" icon={<IconAlertCircle />}>
          <Text size="lg" style={{ weight: 500 }} mb="xs">
            Debes estar autenticado para acceder a esta página
          </Text>
          <Anchor size="md" onClick={handleGoToLoginClick}>
            <Center inline>
              <IconArrowLeft stroke={1.5} />
              <Box ml={5}>Ir a la página de inicio de sesión</Box>
            </Center>
          </Anchor>
        </Alert>
      </>
    )
  }

  if (currentUserQuery.data?.systemRole !== UserSystemRole.ADMIN) {
    return (
      <>
        <Alert variant="light" color="red.6" title="Error" icon={<IconAlertCircle />}>
          <Text size="lg" style={{ weight: 500 }} mb="xs">
            No tiene permisos para acceder a esta página
          </Text>
        </Alert>
      </>
    )
  }

  if (institutionsQuery.isLoading) return <SkeletonFull />

  return <MantineReactTable table={table} />
}

const validateRequired = (value: string) => !!value.length
const validateUrl = (url?: string) => {
  if (!url) return true // URL is optional
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function validateInstitution(institution: InstitutionCreateDto) {
  return {
    name: !validateRequired(institution.name) ? 'El nombre es requerido' : '',
    abbreviation: !validateRequired(institution.abbreviation) ? 'La abreviatura es requerida' : '',
    web: !validateUrl(institution.web) ? 'URL inválida' : '',
  }
}

export default InstitutionAdminPage
