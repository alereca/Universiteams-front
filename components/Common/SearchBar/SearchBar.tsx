import React, { useEffect, useState } from 'react'
import { CloseButton, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import { Url } from '@/services/url'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks'
import Theme from 'src/app/theme'

const SearchBar = () => {
  const router = useRouter()
  const searchQuery = useSearchParams()

  const [generalSearch, setGeneralSearch] = useState('')
  const [debouncedGeneralSearch] = useDebouncedValue(generalSearch, 400)

  const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

  const searchNowButton = () => {
    Url.setUrlParam(router, '/projects', searchQuery, 'generalSearch', generalSearch)
  }

  useEffect(() => {
    if (debouncedGeneralSearch.trim()) {
      searchNowButton()
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
            onClick={() => setGeneralSearch('')}
            style={{ display: generalSearch ? undefined : 'none' }}
          />
        }
      />
    </>
  )
}

export default SearchBar
