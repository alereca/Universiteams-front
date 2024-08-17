import React, { useEffect, useMemo } from 'react'
import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, Center, Container, Loader, Paper, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'

import { IconExclamationCircle } from '@tabler/icons-react'
import { InterestQueryKey, Interests } from '@/services/interests'

import {
  Account,
  ResearchDepartmentInput,
  ProfileInputDto as UserRegisterDto,
} from '@/services/account'
import {
  DepartmentsQueryKey,
  ResearchDepartmentRelations,
  ResearchDepartments,
} from '@/services/departments'

import DepartmentMultiSelect from '../Department/DepartmentMultiSelect'
import MultiSelectCreatable from '../Common/Form/MultiSelectCreatable'
import SelectItem from '@/entities/HelpTypes/SelectItem'
import { UserAffiliationType } from '@/entities/User/UserAffiliation'

type ProfileForm = {
  interests: SelectItem[]
  researchDepartments: ResearchDepartmentInput[]
}

const profileQueryKey = 'profile'

const Profile = () => {
  const form = useForm<ProfileForm>({
    initialValues: {
      interests: [],
      researchDepartments: [],
    },
  })

  const {
    data: userProfile,
    error: userProfileErr,
    isLoading: isLoadingUserProfile,
  } = useQuery({
    queryKey: [profileQueryKey],
    queryFn: () => Account.getProfile(),
  })

  useEffect(() => {
    if (userProfile?.interests) {
      form.setFieldValue(
        'interests',
        userProfile?.interests.map((interest) => ({
          value: interest.id.toString(),
          label: interest.name,
        }))
      )
    }
  }, [userProfile?.interests])

  useEffect(() => {
    if (userProfile?.userAffiliations) {
      form.setFieldValue(
        'researchDepartments',
        userProfile?.userAffiliations.map((dept) => ({
          id: dept.researchDepartment.id,
          currentType: dept.currentType,
        }))
      )
    }
  }, [userProfile?.userAffiliations])

  const departmentsQuery = useQuery({
    queryKey: [DepartmentsQueryKey],
    queryFn: () =>
      ResearchDepartments.getResearchDepartments({
        relations: [ResearchDepartmentRelations.facility, ResearchDepartmentRelations.institution],
      }),
    enabled: userProfileErr === null,
  })

  const interestsQuery = useQuery({
    queryKey: [InterestQueryKey],
    queryFn: Interests.getInterests,
    enabled: userProfileErr === null,
  })
  const interests: SelectItem[] = useMemo(
    () =>
      interestsQuery.data?.map((interest) => ({
        value: interest.id.toString(),
        label: interest.name,
      })) ?? [],
    [interestsQuery.data]
  )

  const queryClient = useQueryClient()
  const registerProfileMutation = useMutation({
    mutationFn: (values: UserRegisterDto) => Account.saveProfile(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [profileQueryKey] })
      notifications.show({
        title: 'Perfil completado',
        message: 'Tu perfil ha sido completado con éxito.',
        color: 'green',
      })
    },
    onError: (error) => {
      console.error(error)
      notifications.show({
        title: 'Error',
        message: 'No se pudo completar el registro. Inténtalo mas tarde.',
        color: 'red',
      })
    },
  })

  const handleDepartmentsChange = (departments: string[]) => {
    form.setFieldValue(
      'researchDepartments',
      departments.map((dept) => {
        const [currentType, departmentId] = dept.split(':')

        return {
          id: Number(departmentId),
          currentType: currentType as UserAffiliationType,
        }
      })
    )
  }

  const handleSubmit = (values: ProfileForm) => {
    const interestsIds: number[] = []
    const interestsToCreate: string[] = []
    for (const interest of values.interests) {
      const parsedValue = parseInt(interest.value, 10)
      if (!isNaN(parsedValue)) {
        interestsIds.push(parsedValue)
        continue
      }

      interestsToCreate.push(interest.label)
    }

    registerProfileMutation.mutate({
      interestsIds: interestsIds,
      interestsToCreate: interestsToCreate,
      researchDepartments: values.researchDepartments,
    })
  }

  if (isLoadingUserProfile) {
    return (
      <Container size="100%" px="xs" my={40}>
        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          <Center>
            <Loader variant="dots" />
          </Center>
        </Paper>
      </Container>
    )
  }

  if (userProfileErr !== null && (userProfileErr as AxiosError).response?.status === 401) {
    return (
      <Container size="100%" px="xs" my={40}>
        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          <Center>
            <Alert
              variant="light"
              color="red"
              title="No autorizado"
              icon={<IconExclamationCircle />}>
              Debes estar autenticado para completar tu perfil
            </Alert>
          </Center>
        </Paper>
      </Container>
    )
  }

  if (userProfileErr !== null) {
    return (
      <Container size="100%" px="xs" my={40}>
        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          <Center>
            <Alert variant="light" color="red" title="Error" icon={<IconExclamationCircle />}>
              No se pudo cargar tu perfil
            </Alert>
          </Center>
        </Paper>
      </Container>
    )
  }

  if (departmentsQuery.isLoading || interestsQuery.isLoading) {
    return (
      <Container size="100%" px="xs" my={40}>
        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          <Center>
            <Loader variant="dots" />
          </Center>
        </Paper>
      </Container>
    )
  }

  return (
    <Container size="100%" px="xs" my={40}>
      <Paper
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
        style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Text size="lg" mb="lg">
            Edita tu perfil
          </Text>

          <Stack gap="lg">
            <div>
              <Text size="sm" mb="sm">
                Intereses
              </Text>
              <MultiSelectCreatable
                possibleValues={interests}
                placeholder="Ej. Domotica"
                value={form.values.interests}
                onChange={(value) => form.setFieldValue('interests', value)}
              />{' '}
            </div>

            <div>
              <Text size="sm" mb="sm">
                Departamentos
              </Text>

              <DepartmentMultiSelect
                userAffiliations={userProfile?.userAffiliations}
                possibleDepartments={departmentsQuery.data}
                onChange={handleDepartmentsChange}
              />
            </div>
          </Stack>

          <Button mt="lg" fullWidth type="submit">
            Guardar
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

export default Profile
