import React, { useEffect, useState } from 'react'
import { Button, Text, Card, Loader, Alert, Anchor, Box, Center } from '@mantine/core'
import { useForm } from '@mantine/form'
import axios, { AxiosError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { PasswordInput } from '@mantine/core'
import {
  getPasswordStrength,
  getStrengthColorAndPhrase,
  passwordValidation,
  requirements,
} from '@/services/password'
import PasswordStrength from './PasswordStrength'
import Requirement from './Requirement'
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-react'

const parseJwt = (token: string) => {
  if (!token) {
    return
  }
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(window.atob(base64))
}

interface EmailTokenPayload {
  id: string
  email: string
  user: string
}

function PasswordReset() {
  const [serverErrors, setServerErrors] = useState<string[]>([])
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailTokenPayload, setEmailTokenPayload] = useState<EmailTokenPayload | null>(null)
  const router = useRouter()
  const query = useSearchParams()

  useEffect(() => {
    const token = query.get('token') as string
    if (token) {
      const decodedToken: EmailTokenPayload = parseJwt(token)
      setEmailTokenPayload(decodedToken)
    }
  }, [query.get('token')])

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

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true)
    const url = 'http://api.localhost/auth/reset-password'
    const token = query.get('token') as string
    try {
      const res = await axios.post(url, { ...values, verificationToken: token })
      if (res.status === 200) {
        setIsSuccess(true)
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 400) {
        setServerErrors([error.response.data.message])
      } else {
        console.error(error)
        setServerErrors(['Ocurrió un error inesperado'])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoHomeClick = () => {
    router.push('/')
  }

  const handleGoBackToLoginClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.push('/account/login')
  }

  const strength = getPasswordStrength(form.values.password)
  const strengthColorAndPhrase = getStrengthColorAndPhrase(strength)

  if (isLoading) return <Loader />

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
