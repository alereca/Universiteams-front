import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'

import RegEx from 'utils/string/RegEx'
import {
  getPasswordStrength,
  getStrengthColorAndPhrase,
  passwordValidation,
  requirements,
} from '@/services/password'
import { Account } from '@/services/account'
import PasswordStrength from './PasswordStrength'

import Login from '@/entities/HelpTypes/Login'
import LoginRegisterType from '@/entities/HelpTypes/LoginRegisterType'

import {
  Anchor,
  Box,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery, useToggle } from '@mantine/hooks'
import Theme from '../../src/app/theme'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CurrentUserQueryOptions } from '../../services/currentUser'
import { notifications } from '@mantine/notifications'

interface LoginRegisterProps {
  initialType: LoginRegisterType
}

const LoginRegister = ({ initialType }: LoginRegisterProps) => {
  const router = useRouter()
  const [type, toggleType] = useToggle<LoginRegisterType>(getInitialToggleTypes(initialType))
  const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
  const queryClient = useQueryClient()

  const errorMessage = (error: Error) => {
    if (!error) return []
    if (error instanceof AxiosError && error.response?.status === 401)
      return ['Correo o contraseña incorrectos']

    const defaultErrorMsg = 'Ocurrió un error inesperado'
    const message = ((error as AxiosError)?.response?.data as { message: string | string[] })
      ?.message
    return Array.isArray(message) ? message : [message || defaultErrorMsg]
  }

  const { mutate: authenticate } = useMutation({
    mutationFn: (values: Login) => Account.authenticate(values, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CurrentUserQueryOptions.currentUser().queryKey })
      switch (type) {
        case 'login':
          router.push('/')
          break
        case 'register':
          router.push('/account/profile')
          break
      }
    },
    onError: (error) => {
      notifications.show({
        title: type === 'login' ? 'Error al iniciar sesión' : 'Error al registrarse',
        message: errorMessage(error),
        color: 'red',
      })
    },
  })

  const handleForgotPasswordClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.push('/account/forgotPassword')
  }

  const validateName = (value: string) => {
    if (type !== 'register') return null
    if (value.length < 2) return 'Mínimo dos caracteres'

    return null
  }

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      firstName: (value) => validateName(value),
      lastName: (value) => validateName(value),
      email: (value) => (RegEx.email.test(value) ? null : 'Correo electrónico inválido'),
      password: (value) => {
        if (type !== 'register') return null

        return passwordValidation(value)
      },
      confirmPassword: (value) => {
        if (type !== 'register') return null
        if (value !== form.values.password) return 'Las contraseñas no coinciden'

        return null
      },
    },
  })

  const strength = useMemo(() => getPasswordStrength(form.values.password), [form.values.password])
  const strengthColorAndPhrase = useMemo(() => getStrengthColorAndPhrase(strength), [strength])

  return (
    <Container size={420} my={40}>
      <Box ml={isMobile ? 'xs' : 0}>
        <Title
          style={{
            align: 'center',
            fontFamily: 'Greycliff CF, sans-serif',
            fontWeight: 900,
          }}>
          ¡Bienvenido a Universiteams!
        </Title>
        <Text style={{ align: 'center' }} c="dimmed.6" size="sm" mt={5}>
          {type === 'register' ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
          <Anchor<'a'>
            href="#"
            size="sm"
            onClick={() => {
              toggleType()
              const route = type === 'register' ? '/login' : '/register'
              router.push(`/account/${route}`)
            }}>
            {type === 'register' ? 'Iniciar sesión' : 'Registrarse'}
          </Anchor>
        </Text>
      </Box>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => authenticate(values))}>
          {type === 'register' && (
            <>
              <TextInput
                label="Nombre"
                placeholder="Tu nombre"
                required
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Apellido"
                placeholder="Tu apellido"
                required
                {...form.getInputProps('lastName')}
              />
            </>
          )}

          <TextInput
            label="Correo electrónico"
            placeholder="tu@correo.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Contraseña"
            placeholder="Tu contraseña"
            required
            {...form.getInputProps('password')}
          />
          {type === 'register' && strength > 0 && (
            <PasswordStrength
              strength={strength}
              phrase={strengthColorAndPhrase?.phrase}
              color={strengthColorAndPhrase?.color}
              requirements={requirements}
              formValue={form.values.password}
            />
          )}
          {type === 'register' && (
            <PasswordInput
              label="Confirmar contraseña"
              placeholder="Tu contraseña"
              required
              {...form.getInputProps('confirmPassword')}
            />
          )}

          <Group justify="space-between" mt="xs" mb="xs">
            {type === 'login' && (
              <Anchor<'a'> onClick={handleForgotPasswordClick} href="#" size="sm">
                ¿Olvidaste tu contraseña?
              </Anchor>
            )}
          </Group>
          <Button fullWidth mt="xl" type="submit">
            {type === 'login' ? 'Iniciar sesión' : 'Registrarse'}
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

export default LoginRegister

function getInitialToggleTypes(initialType: LoginRegisterType): readonly LoginRegisterType[] {
  if (initialType === 'register') return ['register', 'login']

  return ['login', 'register']
}
