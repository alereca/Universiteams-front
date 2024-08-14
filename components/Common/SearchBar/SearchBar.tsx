import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CloseButton, TextInput } from '@mantine/core'
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks'

import { IconSearch } from '@tabler/icons-react'
import Theme from 'src/app/theme'
import { Url } from '@/services/url'

const SearchBar = () => {
  const router = useRouter()
  const searchQuery = useSearchParams()

  const [generalSearch, setGeneralSearch] = useState('')
  const [debouncedGeneralSearch] = useDebouncedValue(generalSearch, 400)

  const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

  useEffect(() => {
    if (debouncedGeneralSearch.trim()) {
      Url.setUrlParam(router, '/projects', searchQuery, 'generalSearch', generalSearch)
    }
  }, [debouncedGeneralSearch])

  return (
    <>
      <TextInput
        placeholder="Buscar..."
        style={{
          width: isMobile ? '55vw' : '55vw',
        }}
        value={generalSearch}
        onChange={(event) => setGeneralSearch(event.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
        rightSectionPointerEvents="all"
        rightSection={
          <CloseButton
            aria-label="Limpiar búsqueda"
            onClick={() => {
              setGeneralSearch('')
              Url.setUrlParam(router, '/projects', searchQuery, 'generalSearch', null)
            }}
            style={{ display: generalSearch ? undefined : 'none' }}
          />
        }
      />
    </>
  )
}

export default SearchBar
