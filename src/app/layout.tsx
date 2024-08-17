'use client'
import React from 'react'
import axios from 'axios'

import { MantineProvider, localStorageColorSchemeManager } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/tiptap/styles.css'
import 'mantine-react-table/styles.css'
import '@/styles/globals.scss'

import Theme from './theme'
import Layout from '@/components/Layout/Layout'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ModalsProvider } from '@mantine/modals'
import { SpeedInsights } from '@vercel/speed-insights/next'

const queryClient = new QueryClient()

const App = ({ children }: { children: React.ReactNode }) => {
  // Detect the user's theme preference (dark or light)
  const colorSchemeManager = localStorageColorSchemeManager({ key: 'mantine-color-scheme' })

  // Global configs
  axios.defaults.withCredentials = true

  return (
    <html>
      <head>
        <title>Universiteams</title>
        <meta name="description" content="Pro Scientific Dissemination & Volunteering" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <MantineProvider
            theme={Theme}
            colorSchemeManager={colorSchemeManager}
            defaultColorScheme="dark">
            <ModalsProvider>
              <Layout>
                {children}
                <Notifications />
                <SpeedInsights />
              </Layout>
            </ModalsProvider>
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}

export default App
