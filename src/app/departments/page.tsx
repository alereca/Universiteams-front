'use client'
import React, { useMemo } from 'react'
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  MRT_Row,
} from 'mantine-react-table'
import { NextPage } from 'next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ActionIcon, Alert, Anchor, Box, Button, Center, Flex, Text, Tooltip } from '@mantine/core'
import { IconAlertCircle, IconArrowLeft, IconEdit, IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import { CurrentUserQueryOptions, UserSystemRole } from '../../../services/currentUser'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import SkeletonFull from '../../../components/Common/Loader/SkeletonFull'
import {
  DepartmentsQueryKey,
  ResearchDepartmentRelations,
  ResearchDepartments,
} from '../../../services/departments'
import ResearchDepartment from '../../../entities/ResearchDepartment'
import DepartmentCreateForm from '../../../components/Department/DepartmentCreateForm'
import DepartmentUpdateForm from '../../../components/Department/DepartmentUpdateForm'
import { MRT_Localization_ES } from 'mantine-react-table/locales/es'

const DepartmentsAdminPage: NextPage = () => {
  const router = useRouter()

  const handleGoToLoginClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.push('/account/login')
  }

  const currentUserQuery = useQuery(CurrentUserQueryOptions.currentUser())

  const queryClient = useQueryClient()

  const columns = useMemo<MRT_ColumnDef<ResearchDepartment>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
      },
      {
        accessorKey: 'abbreviation',
        header: 'Abreviatura',
      },
      {
        accessorKey: 'web',
        header: 'Web',
      },
      {
        accessorKey: 'facility.institution.name',
        header: 'Institución',
      },
      {
        accessorKey: 'facility.name',
        header: 'Regional',
      },
    ],
    []
  )

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ResearchDepartments.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DepartmentsQueryKey] })
      notifications.show({
        title: 'Departmento eliminado',
        message: 'La departmento se ha eliminado exitosamente',
        color: 'green',
      })
      modals.closeAll()
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: 'Error al eliminar el departmento',
        message: (error.response?.data as { message: string }).message ?? error.message,
        color: 'red',
      })
      modals.closeAll()
    },
  })

  const openDeleteConfirmModal = (row: MRT_Row<ResearchDepartment>) =>
    modals.openConfirmModal({
      title: `¿Está seguro que desea eliminar el departamento ${row.original.name}?`,
      children: <Text>Esta acción no se puede deshacer.</Text>,
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMutation.mutate(row.original.id),
    })

  const departmentsQuery = useQuery({
    queryKey: [DepartmentsQueryKey],
    queryFn: () =>
      ResearchDepartments.getResearchDepartments({
        relations: [ResearchDepartmentRelations.institution, ResearchDepartmentRelations.facility],
      }),
  })

  const table = useMantineReactTable({
    columns,
    data: departmentsQuery.data ?? [],
    enableColumnPinning: true,
    localization: MRT_Localization_ES,
    initialState: {
      columnPinning: {
        left: ['mrt-row-actions'],
      },
    },
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (originalRow) => String(originalRow.id),
    mantineToolbarAlertBannerProps: departmentsQuery.isError
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
    renderCreateRowModalContent: ({ table }) => {
      return <DepartmentCreateForm table={table} />
    },
    renderEditRowModalContent: ({ row, table }) => {
      return <DepartmentUpdateForm facility={row.original} table={table} />
    },
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
        Crear Nuevo Departmento
      </Button>
    ),
    state: {
      isLoading: departmentsQuery.isLoading,
      isSaving: deleteMutation.isPending,
      showAlertBanner: departmentsQuery.isError,
      showProgressBars: departmentsQuery.isFetching,
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

  if (departmentsQuery.isLoading) return <SkeletonFull />

  return <MantineReactTable table={table} />
}

export default DepartmentsAdminPage
