import React, { ChangeEvent, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Select, Stack, Grid, ActionIcon, Group, Switch, MultiSelect } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'

import { IconArrowUp, IconArrowDown, IconTrash } from '@tabler/icons-react'
import Theme from 'src/app/theme'

import { Order } from '@/entities/HelpTypes/Order'
import SelectItem from '@/entities/HelpTypes/SelectItem'
import { Url } from '@/services/url'

interface ProjectFilterContentProps {
  sortAttributes: SelectItem[]
  institutions: SelectItem[]
  facilities: SelectItem[]
  departments: SelectItem[]
  interests: SelectItem[]
  users: SelectItem[]
}

const ProjectFilterContent = (props: ProjectFilterContentProps) => {
  const form = useForm({
    initialValues: {
      generalSearch: '',
      sortBy: '',
      order: '' as Order,
      university: '',
      facility: '',
      department: '',
      user: '',
      interests: [] as string[],
      type: '',
      isDown: false,
      dateFrom: null as Date | null,
    },
  })

  const searchQuery = useSearchParams()

  useEffect(() => {
    form.setValues({
      generalSearch: searchQuery.get('generalSearch') ?? '',
      sortBy: searchQuery.get('sortBy') ?? '',
      order: (searchQuery.get('order') as Order) ?? '',
      university: searchQuery.get('university') ?? '',
      facility: searchQuery.get('facility') ?? '',
      department: searchQuery.get('department') ?? '',
      user: searchQuery.get('user') ?? '',
      interests: searchQuery.getAll('interest') ?? [],
      type: searchQuery.get('type') ?? '',
      isDown: searchQuery.get('isDown') === 'true',
      dateFrom: searchQuery.get('dateFrom') ? new Date(searchQuery.get('dateFrom')!) : null,
    })
  }, [searchQuery])

  const router = useRouter()
  const pathname = usePathname()

  const handleSortByChange = (value: string | null) => {
    Url.setUrlParam(router, pathname, searchQuery, 'sortBy', value)
  }

  const handleUniversityChange = (value: string | null) => {
    Url.setUrlParam(router, pathname, searchQuery, 'university', value)
  }

  const handleFacilityChange = (value: string | null) => {
    Url.setUrlParam(router, pathname, searchQuery, 'facility', value)
  }

  const handleDepartmentChange = (value: string | null) => {
    Url.setUrlParam(router, pathname, searchQuery, 'department', value)
  }

  const handleUserChange = (value: string | null) => {
    Url.setUrlParam(router, pathname, searchQuery, 'user', value)
  }

  const handleInterestsChange = (value: string[]) => {
    Url.replaceArrayInUrl(router, pathname, searchQuery, 'interest', value)
  }

  const handleTypeChange = (value: string | null) => {
    Url.setUrlParam(router, pathname, searchQuery, 'type', value)
  }

  const handleIsDownChange = (event: ChangeEvent<HTMLInputElement>) => {
    Url.setUrlParam(
      router,
      pathname,
      searchQuery,
      'isDown',
      event.target.checked ? 'true' : 'false'
    )
  }

  const handleDateInputChange = (value: Date | null) => {
    Url.setUrlParam(router, pathname, searchQuery, 'dateFrom', value ? value.toISOString() : null)
  }

  const handleOrderChange = () => {
    const value = form.values.order === Order.ASC ? Order.DESC : Order.ASC
    Url.setUrlParam(router, pathname, searchQuery, 'order', value)
  }

  const reset = () => {
    form.reset()
    router.push(`${pathname}`)
  }

  const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

  return (
    <>
      <form>
        <Stack gap="xs" ml={isMobile ? 'xs' : 0} mr={isMobile ? 'xs' : 0}>
          <Grid align="flex-end">
            <Grid.Col span="auto">
              <Select
                label="Ordenar por"
                placeholder='Ej: "nombre"'
                data={[{ value: '', label: '' }].concat(
                  props.sortAttributes.map((attr) => ({
                    value: attr.value,
                    label: attr.label,
                  }))
                )}
                clearable
                searchable
                value={form.values.sortBy}
                onChange={handleSortByChange}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <ActionIcon variant="transparent" onClick={handleOrderChange}>
                {form.values.order === Order.ASC ? <IconArrowUp /> : <IconArrowDown />}
              </ActionIcon>
            </Grid.Col>
          </Grid>

          <Select
            label="Universidad"
            placeholder='Ej: "UTN"'
            data={[{ value: '', label: '' }].concat(
              props.institutions.map((attr) => ({
                value: attr.value,
                label: attr.label,
              }))
            )}
            clearable
            searchable
            value={form.values.university}
            onChange={handleUniversityChange}
          />

          <Select
            label="Regional"
            placeholder='Ej: "Regional Buenos Aires"'
            data={[{ value: '', label: '' }].concat(
              props.facilities.map((attr) => ({
                value: attr.value,
                label: attr.label,
              }))
            )}
            clearable
            searchable
            value={form.values.facility}
            onChange={handleFacilityChange}
            disabled={!form.values.university}
          />

          <Select
            label="Departamento"
            placeholder='Ej: "Ingeniería En Sistemas"'
            data={[{ value: '', label: '' }].concat(
              props.departments.map((attr) => ({
                value: attr.value,
                label: attr.label,
              }))
            )}
            clearable
            searchable
            value={form.values.department}
            onChange={handleDepartmentChange}
            disabled={!form.values.facility}
          />

          <Select
            label="Usuario"
            placeholder='Ej: "Juan Perez"'
            data={[{ value: '', label: '' }].concat(
              props.users.map((attr) => ({
                value: attr.value,
                label: attr.label,
              }))
            )}
            clearable
            searchable
            value={form.values.user}
            onChange={handleUserChange}
          />

          <MultiSelect
            label="Intereses"
            placeholder={form.values.interests.length === 0 ? 'Ej: "Inteligencia Artificial"' : ''}
            data={[{ value: '', label: '' }].concat(
              props.interests.map((attr) => ({
                value: attr.value,
                label: attr.label,
              }))
            )}
            clearable
            searchable
            value={form.values.interests}
            onChange={handleInterestsChange}
          />

          <Select
            label="Tipo"
            placeholder='Ej: "Formal"'
            data={['', 'Formal', 'Informal']}
            clearable
            searchable
            value={form.values.type}
            onChange={handleTypeChange}
          />

          <Switch
            checked={form.values.isDown}
            onChange={handleIsDownChange}
            label="Descontinuados"
            mt="xs"
          />

          <DateInput
            label="Creados desde"
            clearable
            placeholder='Ej: "Febrero 15, 2024"'
            value={form.values.dateFrom}
            onChange={handleDateInputChange}
          />

          <Group grow mt="xs">
            <ActionIcon color="red" onClick={reset}>
              <IconTrash />
            </ActionIcon>
          </Group>
        </Stack>
      </form>
    </>
  )
}

export default ProjectFilterContent
