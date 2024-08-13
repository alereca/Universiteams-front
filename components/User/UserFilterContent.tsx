import React, { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Select, Stack, Grid, ActionIcon, Group, MultiSelect } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'

import { IconArrowUp, IconArrowDown, IconTrash } from '@tabler/icons-react'
import Theme from 'src/app/theme'

import { Order } from '@/entities/HelpTypes/Order'
import SelectItem from '@/entities/HelpTypes/SelectItem'
import { Url } from '@/services/url'

interface UserFilterContentProps {
  sortAttributes: SelectItem[]
  interests: SelectItem[]
  institutions: SelectItem[]
  facilities: SelectItem[]
  departments: SelectItem[]
}

const UserFilterContent = (props: UserFilterContentProps) => {
  const form = useForm({
    initialValues: {
      generalSearch: '',
      sortBy: '',
      order: '' as Order,
      interests: [] as string[],
      university: '',
      facility: '',
      department: '',
    },
  })

  const searchQuery = useSearchParams()

  useEffect(() => {
    form.setValues({
      generalSearch: searchQuery.get('generalSearch') ?? '',
      sortBy: searchQuery.get('sortBy') ?? '',
      order: (searchQuery.get('order') as Order) ?? '',
      interests: searchQuery.getAll('interest') ?? [],
      university: searchQuery.get('university') ?? '',
      facility: searchQuery.get('facility') ?? '',
      department: searchQuery.get('department') ?? '',
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

  const handleInterestsChange = (value: string[]) => {
    Url.replaceArrayInUrl(router, pathname, searchQuery, 'interest', value)
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

export default UserFilterContent
