import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader, Text, Alert, Anchor, Box, Center } from '@mantine/core'

import { IconAlertCircle, IconArrowLeft, IconInfoCircle } from '@tabler/icons-react'
import { Account } from '@/services/account'
import { CurrentUserQueryOptions } from '@/services/currentUser'

const VerifyEmail = () => {
  const router = useRouter()
  const query = useSearchParams()
  const queryClient = useQueryClient()

  const {
    mutate: verifyEmail,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: () => Account.verifyEmail(query.get('token') as string),
    onSuccess: () => {
      // Invalidate the current user query since user now has a verified email
      queryClient.invalidateQueries({ queryKey: CurrentUserQueryOptions.currentUser().queryKey })
    },
  })

  useEffect(() => {
    verifyEmail()
  }, [query.get('token')])

  const handleGoHomeClick = () => {
    router.push('/')
  }

  if (isPending) return <Loader />

  return (
    <>
      {isSuccess && (
        <Alert color="green" title="Success" mb="xs" icon={<IconInfoCircle />}>
          <Text size="lg" style={{ weight: 500 }} mb="xs">
            ¡Correo electrónico verificado con éxito!
          </Text>
        </Alert>
      )}
      {isError && (
        <Alert color="red" title="Error" mb="xs" icon={<IconAlertCircle />}>
          <Text size="lg" style={{ weight: 500 }} mb="xs">
            No se pudo verificar el correo electrónico
          </Text>
        </Alert>
      )}
      <Anchor size="md" onClick={handleGoHomeClick}>
        <Center inline>
          <IconArrowLeft stroke={1.5} />
          <Box ml={5}>Volver a la página de inicio</Box>
        </Center>
      </Anchor>
    </>
  )
}

export default VerifyEmail
