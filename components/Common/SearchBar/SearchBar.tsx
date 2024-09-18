import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CloseButton, TextInput } from '@mantine/core'
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks'

import { IconSearch } from '@tabler/icons-react'
import Theme from 'src/app/theme'
import { Url } from '@/services/url'

const SearchBar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchQuery = useSearchParams()

  const [generalSearch, setGeneralSearch] = useState('')
  const [debouncedGeneralSearch, updateDebouncedGeneralSearch] = useDebouncedValue(
    generalSearch,
    400
  )

  const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
  const targetPath = pathname === '/users' ? '/users' : '/projects'

  useEffect(() => {
    const trimmedSearchQuery = debouncedGeneralSearch.trim()
    if (trimmedSearchQuery === '') {
      Url.removeUrlParam(router, pathname, searchQuery, 'generalSearch')
      return
    }

    Url.setUrlParam(router, targetPath, searchQuery, 'generalSearch', generalSearch)
  }, [debouncedGeneralSearch])

  useEffect(() => {
    if (pathname !== '/projects' && pathname !== '/users') {
      setGeneralSearch('')
      updateDebouncedGeneralSearch()
    }
  }, [pathname])

  return (
    <>
      <TextInput
        placeholder={`Buscar ${pathname === '/users' ? 'usuarios' : 'proyectos'}`}
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
            }}
            style={{ display: generalSearch ? undefined : 'none' }}
          />
        }
      />
    </>
  )
}

export default SearchBar
