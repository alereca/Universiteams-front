import React, { useEffect, useMemo, useState, MouseEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AxiosError } from 'axios'
import {
  Alert,
  Anchor,
  Box,
  Button,
  Card,
  Center,
  Loader,
  PasswordInput,
  Text,
} from '@mantine/core'
import { useForm } from '@mantine/form'

import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-react'
import { Account } from '@/services/account'
import { CurrentUserQueryOptions } from '@/services/currentUser'
import {
  getPasswordStrength,
  getStrengthColorAndPhrase,
  passwordValidation,
  requirements,
} from '@/services/password'

import { EmailTokenPayload } from '@/entities/HelpTypes/EmailTokenPayload'
import PasswordStrength from './PasswordStrength'
import Requirement from './Requirement'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const parseJwt = (token: string) => {
  if (!token) {
    return
  }
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(window.atob(base64))
}

function PasswordReset() {
  const [emailTokenPayload, setEmailTokenPayload] = useState<EmailTokenPayload | null>(null)
  const router = useRouter()
  const query = useSearchParams()
  const queryClient = useQueryClient()

  useEffect(() => {
    const token = query.get('token') as string
    if (token) {
      const decodedToken: EmailTokenPayload = parseJwt(token)
      setEmailTokenPayload(decodedToken)
    }
  }, [query.get('token')])

  const {
    mutate: resetPassword,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (values: typeof form.values) =>
      Account.resetPassword({ ...values, verificationToken: query.get('token') as string }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CurrentUserQueryOptions.currentUser().queryKey })
      form.reset()
    },
  })

  const serverErrors = useMemo(() => {
    if (error instanceof AxiosError && error.response && error.response.status === 400) {
      return [error.response.data.message]
    } else if (error) {
      console.error(error)
      return ['Ocurrió un error inesperado']
    }
    return []
  }, [error])

  const validateConfirmPassword = (confirmPassword: string, password: string): string | null => {
    if (confirmPassword !== password) return 'Las contraseñas no coinciden'

    return null
  }

  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: {
      password: (value) => passwordValidation(value),
      confirmPassword: (value, values) => validateConfirmPassword(value, values.password),
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    resetPassword(values)
  }

  const handleGoHomeClick = () => {
    router.push('/')
  }

  const handleGoBackToLoginClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.push('/account/login')
  }

  const strength = getPasswordStrength(form.values.password)
  const strengthColorAndPhrase = getStrengthColorAndPhrase(strength)

  if (isPending) return <Loader />

  if (!emailTokenPayload)
    return (
      <>
        <Alert variant="light" color="red.6" title="Error" icon={<IconAlertCircle />}>
          <Text size="lg" style={{ weight: 500 }} mb="xs">
            Token inválido o expirado
          </Text>
          <Anchor size="md" onClick={handleGoBackToLoginClick}>
            <Center inline>
              <IconArrowLeft stroke={1.5} />
              <Box ml={5}>Volver a la página de inicio de sesión</Box>
            </Center>
          </Anchor>
        </Alert>
      </>
    )

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}>
        <Card shadow="sm" padding="lg" radius="md" style={{ maxWidth: '400px', width: '100%' }}>
          <Text size="lg" style={{ weight: 500, marginBottom: '1rem' }}>
            {isSuccess
              ? '¡Contraseña restablecida con éxito!'
              : `Cambiar contraseña para @${emailTokenPayload?.user}`}
          </Text>
          {isSuccess ? (
            <Button variant="outline" color="blue.6" onClick={handleGoHomeClick}>
              Ir a la página de inicio
            </Button>
          ) : (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              {serverErrors.map((error, index) => (
                <Requirement key={index} meets={false} label={error} />
              ))}
              <PasswordInput
                required
                label="Nueva contraseña"
                placeholder="Ingresa tu nueva contraseña"
                {...form.getInputProps('password')}
                style={{ marginBottom: '1rem' }}
              />
              {strength > 0 && (
                <PasswordStrength
                  strength={strength}
                  phrase={strengthColorAndPhrase?.phrase}
                  color={strengthColorAndPhrase?.color}
                  requirements={requirements}
                  formValue={form.values.password}
                />
              )}
              <PasswordInput
                required
                label="Confirmar contraseña"
                placeholder="Confirma tu nueva contraseña"
                {...form.getInputProps('confirmPassword')}
                style={{ marginBottom: '1rem' }}
              />
              <Button type="submit" color="blue.6" style={{ marginTop: '1rem' }}>
                Restablecer contraseña
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}

export default PasswordReset
