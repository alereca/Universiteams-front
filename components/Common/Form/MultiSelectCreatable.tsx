import React from 'react'
import { useState } from 'react'
import {
  CheckIcon,
  CloseButton,
  Combobox,
  Group,
  Pill,
  PillsInput,
  ScrollArea,
  useCombobox,
} from '@mantine/core'
import SelectItem from '../../../entities/HelpTypes/SelectItem'
import { useUncontrolled } from '@mantine/hooks'

/**
 * MultiSelectCreatableProps interface represents the props for the MultiSelectCreatable component.
 */
interface MultiSelectCreatableProps {
  /**
   * An array of possible values for the multi-select.
   */
  possibleValues: SelectItem[]
  /**
   * The placeholder text for the multi-select input field.
   */
  placeholder?: string
  /**
   * The current selected values for the multi-select.
   */
  value?: SelectItem[]
  /**
   * A callback function that is called when the selected values change.
   * That into account that the value is an array of SelectItem.
   * If an item has an empty value, it means that the user created a new option.
   */
  onChange?: (newValue: SelectItem[]) => void

  /**
   * The message to show when no options are found
   * @default 'Nothing found'
   */
  nothingFoundMessage?: string
}

/**
 * MultiSelectCreatable component is a multi-select input field that allows the user to create new options.
 */
const MultiSelectCreatable = ({
  possibleValues,
  placeholder,
  value,
  onChange,
  nothingFoundMessage = 'Nothing found',
}: MultiSelectCreatableProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  })

  const [search, setSearch] = useState('')
  const [data, setData] = useState(possibleValues)
  const [_value, setValue] = useUncontrolled({
    value: value,
    onChange,
  })

  const exactOptionMatch = data.some((item) => item.label === search)

  const handleValueSelect = (selectedValue: string) => {
    setSearch('')

    if (selectedValue === '$create') {
      setData((current) => [...current, { value: search, label: search }])
      setValue([..._value, { value: search, label: search }])
      onChange && onChange([..._value, { value: search, label: search }])
    } else {
      const matchingDisplayName = data.find((item) => item.value === selectedValue)?.label || ''
      const newValue =
        _value.find((v) => v.value === selectedValue) !== undefined
          ? _value.filter((v) => v.value !== selectedValue)
          : [
              ..._value,
              {
                value: selectedValue,
                label: matchingDisplayName,
              },
            ]
      setValue(newValue)
      onChange && onChange(newValue)
    }
  }

  const handleValueRemove = (val: SelectItem) => {
    const newValue = _value.filter((v) => v.value !== val.value)
    setValue(newValue)
    onChange && onChange(newValue)
  }

  const values = _value.map((item) => (
    <Pill key={item.value} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item.label}
    </Pill>
  ))

  const options = data
    .filter((item) => item.label.toLowerCase().includes(search.trim().toLowerCase()))
    .map((item) => (
      <Combobox.Option
        value={item.value}
        key={item.value}
        active={_value.find((v) => v.value === item.value) !== undefined}>
        <Group gap="sm">
          {_value.find((v) => v.value === item.value) !== undefined ? (
            <CheckIcon size={12} />
          ) : null}
          <span>{item.label}</span>
        </Group>
      </Combobox.Option>
    ))

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
      <Combobox.DropdownTarget>
        <PillsInput
          onClick={() => combobox.openDropdown()}
          rightSection={
            _value.length !== 0 && (
              <CloseButton
                size="sm"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setValue([])}
                aria-label="Limpiar valores seleccionados"
              />
            )
          }>
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder={_value.length === 0 ? placeholder : ''}
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex()
                  setSearch(event.currentTarget.value)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && search.length === 0) {
                    event.preventDefault()
                    handleValueRemove(_value[_value.length - 1])
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          <ScrollArea.Autosize mah={200} type="scroll">
            {options}

            {!exactOptionMatch && search.trim().length > 0 && (
              <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
            )}

            {exactOptionMatch && search.trim().length > 0 && options.length === 0 && (
              <Combobox.Empty>{nothingFoundMessage}</Combobox.Empty>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default MultiSelectCreatable
