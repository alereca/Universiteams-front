import React, { ChangeEvent, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  Stack,
  Grid,
  ActionIcon,
  Group,
  Switch,
  ComboboxItem,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { IconArrowUp, IconArrowDown, IconCheck, IconTrash } from '@tabler/icons-react'
import SelectItem from '@/entities/HelpTypes/SelectItem'
import Theme from 'src/app/theme'

interface ProjectFilterContentProps {
  sortAttributes: SelectItem[]
  institutions: SelectItem[]
  facilities: SelectItem[]
  departments: SelectItem[]
}

const ProjectFilterContent = (props: ProjectFilterContentProps) => {
  const form = useForm({
    initialValues: {
      generalSearch: '',
      sortBy: '',
      inAscendingOrder: true,
      university: '',
      facility: '',
      department: '',
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
      inAscendingOrder: searchQuery.get('inAscendingOrder') !== 'false',
      university: searchQuery.get('university') ?? '',
      facility: searchQuery.get('facility') ?? '',
      department: searchQuery.get('department') ?? '',
      type: searchQuery.get('type') ?? '',
      isDown: searchQuery.get('isDown') === 'true',
      dateFrom: searchQuery.get('dateFrom') ? new Date(searchQuery.get('dateFrom')!) : null,
    })
  }, [searchQuery])

  const router = useRouter()
  const pathname = usePathname()

  const updateUrl = (values: typeof form.values) => {
    const query = getUrlSearchParams(values)
    router.push(`${pathname}?${query}`)
  }

  const handleSortByChange = (value: string | null, op: ComboboxItem) => {
    form.values.sortBy = value ?? ''
    updateUrl(form.values)
  }

  const handleUniversityChange = (value: string | null, op: ComboboxItem) => {
    form.values.university = value ?? ''
    updateUrl(form.values)
  }

  const handleFacilityChange = (value: string | null, op: ComboboxItem) => {
    form.values.facility = value ?? ''
    updateUrl(form.values)
  }

  const handleDepartmentChange = (value: string | null, op: ComboboxItem) => {
    form.values.department = value ?? ''
    updateUrl(form.values)
  }

  const handleTypeChange = (value: string | null, op: ComboboxItem) => {
    form.values.type = value ?? ''
    updateUrl(form.values)
  }

  const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.values.isDown = event.target.checked
    updateUrl(form.values)
  }

  const handleDateInputChange = (value: Date | null) => {
    form.values.dateFrom = value
    updateUrl(form.values)
  }

  const reset = () => {
    form.reset()
    router.push(`${pathname}`)
  }

  const toggleOrder = () => form.setFieldValue('inAscendingOrder', !form.values.inAscendingOrder)

  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <>
      <form>
        <Stack ml={isMobile ? Theme.spacing?.xs : 0} mr={isMobile ? Theme.spacing?.xs : 0}>
          <Grid align="flex-end">
            <Grid.Col span="auto">
              <Select
                label="Ordenar por"
                data={[{ value: '', label: '' }].concat(
                  props.sortAttributes.map((attr) => ({
                    value: attr.attribute,
                    label: attr.displayName,
                  }))
                )}
                clearable
                value={form.values.sortBy}
                onChange={handleSortByChange}
              />
            </Grid.Col>
            <Grid.Col span={1}>
              <ActionIcon variant="transparent" onClick={toggleOrder}>
                {form.values.inAscendingOrder ? <IconArrowUp /> : <IconArrowDown />}
              </ActionIcon>
            </Grid.Col>
          </Grid>

          <Select
            label="Universidad"
            placeholder='Ej: "UTN"'
            data={[{ value: '', label: '' }].concat(
              props.institutions.map((attr) => ({
                value: attr.attribute,
                label: attr.displayName,
              }))
            )}
            clearable
            value={form.values.university}
            onChange={handleUniversityChange}
          />

          <Select
            label="Regional"
            placeholder='Ej: "Regional Buenos Aires"'
            data={[{ value: '', label: '' }].concat(
              props.facilities.map((attr) => ({
                value: attr.attribute,
                label: attr.displayName,
              }))
            )}
            clearable
            value={form.values.facility}
            onChange={handleFacilityChange}
          />

          <Select
            label="Departamento"
            placeholder='Ej: "Ingeniería En Sistemas"'
            data={[{ value: '', label: '' }].concat(
              props.departments.map((attr) => ({
                value: attr.attribute,
                label: attr.displayName,
              }))
            )}
            clearable
            value={form.values.department}
            onChange={handleDepartmentChange}
          />

          <Select
            label="Tipo"
            placeholder='Ej: "Formal"'
            data={['', 'Formal', 'No Formal']}
            clearable
            value={form.values.type}
            onChange={handleTypeChange}
          />

          <Switch
            label="Descontinuados"
            mt={Theme.spacing?.xs}
            mb={Theme.spacing?.xs}
            checked={form.values.isDown}
            onChange={handleSwitchChange}
          />

          <DateInput
            label="Creados desde"
            clearable
            value={form.values.dateFrom}
            onChange={handleDateInputChange}
          />

          <Group grow mt={Theme.spacing?.sm}>
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
function getUrlSearchParams(values: { [x: string]: any }) {
  // Remove keys with empty values
  Object.keys(values).forEach((key) => {
    if (values[key] === null || values[key] === undefined || values[key] === '') {
      delete values[key]
    }
  })

  return new URLSearchParams(values as any).toString()
}
