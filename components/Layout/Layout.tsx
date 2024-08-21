import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AppShell, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'

import Constants from 'utils/string/Constants'
import Header from './Header/Header'
import SplashLogo from '../Common/Loader/SplashLogo'
import Navbar from './Navbar/Navbar'
import useSidebarStore from './useSidebarStore'

interface Layout {
  children: React.ReactNode
}

const Layout = (props: Layout) => {
  const opened = useSidebarStore((state) => state.opened)
  const pathName = usePathname()
  const [unloaded, setUnloaded] = useState(true)

  // Change between theme preferences
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('dark')
  const toggleColorScheme = () => setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')

  // Hotkeys
  useHotkeys([['mod+J', () => toggleColorScheme()]])

  useEffect(() => {
    setUnloaded(false)
  }, [])

  const layoutSet = () => {
    // Unloaded page
    if (unloaded) return <SplashLogo />

    // Validate pathname - Layout without navigation
    if (Constants.noNavbarRoutes.includes(pathName)) {
      return (
        <AppShell header={{ height: 60 }}>
          <AppShell.Header>
            <Header toggleColorScheme={toggleColorScheme} showNavAndSearch={false} />
          </AppShell.Header>
          <AppShell.Main>{props.children}</AppShell.Main>
        </AppShell>
      )
    }

    // Layout with navigation
    return (
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: { base: 270 }, breakpoint: 'sm', collapsed: { mobile: !opened } }}>
        <AppShell.Header>
          <Header toggleColorScheme={toggleColorScheme} showNavAndSearch={true} />
        </AppShell.Header>
        <AppShell.Navbar>
          <Navbar />
        </AppShell.Navbar>
        <AppShell.Main>{props.children}</AppShell.Main>
      </AppShell>
    )
  }

  return layoutSet()
}

export default Layout
