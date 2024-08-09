import React from 'react'
import { Card, MultiSelect, Group, Button, ActionIcon, Select } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import SelectItem from '../../entities/HelpTypes/SelectItem'
import ResearchDepartment from '../../entities/ResearchDepartment'
import UserAffiliation, { UserAffiliationType } from '../../entities/UserAffiliation'
import Theme from '../../src/app/theme'
import { notifications } from '@mantine/notifications'

function translateUserAffiliationType(type: UserAffiliationType): string {
  switch (type) {
    case UserAffiliationType.Student:
      return 'Alumno'
    case UserAffiliationType.Professor:
      return 'Profesor'
    case UserAffiliationType.Researcher:
      return 'Investigador'
    case UserAffiliationType.Other:
      return 'Otro'
    default:
      return 'Desconocido'
  }
}

interface DepartmentMultiSelectProps {
  userAffiliations?: UserAffiliation[]
  possibleDepartments?: ResearchDepartment[]
  onChange: (departments: string[]) => void
}

const DepartmentMultiSelect = ({
  userAffiliations,
  possibleDepartments,
  onChange,
}: DepartmentMultiSelectProps) => {
  const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.md})`)

  const [data, setData] = useState<SelectItem[]>(
    userAffiliations?.map((affiliation) => ({
      value: `${affiliation.currentType}:${affiliation.researchDepartment.id.toString()}`,
      label: `[${translateUserAffiliationType(affiliation.currentType)}] ${
        affiliation.researchDepartment.facility.institution.abbreviation
      } ${affiliation.researchDepartment.facility.abbreviation} ${
        affiliation.researchDepartment.name
      }`,
    })) ?? []
  )
  const [value, setValue] = useState<string[]>(data.map((item) => item.value))
  const [newDepartment, setNewDepartment] = useState<string | null>(null)
  const [newType, setNewType] = useState<string | null>(null)

  const handleDepartmentAdd = () => {
    if (!newDepartment) {
      notifications.show({
        title: 'Departamento no seleccionado',
        message: 'Por favor, selecciona un departamento',
        color: 'red',
      })
      return
    }

    if (!newType) {
      notifications.show({
        title: 'Tipo de afiliación no seleccionado',
        message: 'Por favor, selecciona un tipo de afiliación',
        color: 'red',
      })
      return
    }

    const selectedDepartmentLabel = possibleDepartments?.find(
      (department) => department.id.toString() === newDepartment
    )

    if (value.includes(newDepartment)) {
      notifications.show({
        title: 'Departamento ya agregado',
        message: 'El departamento seleccionado ya ha sido agregado',
        color: 'red',
      })
      return
    }

    const newTuple = `${newType}:${newDepartment}`
    const updatedValue = [...value, newTuple]
    setValue(updatedValue)
    setData((current) => [
      ...current,
      {
        value: newTuple,
        label: `[${translateUserAffiliationType(newType as UserAffiliationType)}] ${
          selectedDepartmentLabel?.facility.institution.abbreviation
        } ${selectedDepartmentLabel?.facility.abbreviation} ${selectedDepartmentLabel?.name}`,
      },
    ])
    setNewDepartment(null)
    setNewType(null)
    onChange(updatedValue)
  }

  const handleEnterKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  return (
    <Card withBorder>
      <MultiSelect
        placeholder={value.length === 0 ? 'Agrega un departamento con tu rol' : ''}
        value={value}
        data={data}
        searchable
        clearable
        limit={20}
        nothingFoundMessage="No se encontraron departamentos"
        onChange={(newValue) => {
          setValue(newValue)
          onChange(newValue)
        }}
        onKeyDown={handleEnterKeyDown}
      />

      <Group
        mt="sm"
        gap="xs"
        wrap={isMobile ? 'wrap' : 'nowrap'}
        justify={isMobile ? 'flex-end' : 'flex-start'}>
        <Select
          placeholder='Ej. "UTN FRRo Ingeniería Civil"'
          data={
            possibleDepartments?.map((department) => ({
              value: department.id.toString(),
              label: `${department.facility.institution.abbreviation} ${department.facility.abbreviation} ${department.name}`,
            })) ?? []
          }
          value={newDepartment}
          onChange={(value) => setNewDepartment(value)}
          searchable
          clearable
          onKeyDown={handleEnterKeyDown}
        />

        <Select
          placeholder='Ej. "Alumno"'
          data={Object.values(UserAffiliationType).map((type) => ({
            value: type,
            label: translateUserAffiliationType(type),
          }))}
          value={newType}
          onChange={(value) => setNewType(value)}
          clearable
          onKeyDown={handleEnterKeyDown}
        />

        {isMobile ? (
          <Button color="blue" size="xs" onClick={handleDepartmentAdd}>
            Agregar
          </Button>
        ) : (
          <ActionIcon color="blue" radius="md" onClick={handleDepartmentAdd}>
            <IconPlus />
          </ActionIcon>
        )}
      </Group>
    </Card>
  )
}

export default DepartmentMultiSelect
