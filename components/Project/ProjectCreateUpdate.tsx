import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Box, Button, Flex, MultiSelect, Paper, Select, Text, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import {
  IconAlignBoxLeftBottom,
  IconBulb,
  IconCalendarEvent,
  IconFolder,
  IconInfoSquareRounded,
  IconLanguage,
  IconSchool,
  IconWorldWww,
} from '@tabler/icons-react'
import { CurrentUserQueryOptions } from '@/services/currentUser'
import { InterestQueryKey, Interests } from '@/services/interests'
import { Projects, ProjectsQueryKey } from '@/services/projects'
import {
  DepartmentsQueryKey,
  ResearchDepartmentRelations,
  ResearchDepartments,
} from '@/services/departments'

import Interest from '@/entities/Interest'
import Language from '@/entities/HelpTypes/Language'
import { ProjectNewRequest, ProjectNewResponse } from '@/entities/Project/ProjectNew'
import ProjectType from '@/entities/Project/ProjectType'
import ResearchDepartment from '@/entities/ResearchDepartment'

import InfoMessage from '../Common/InfoMessage/InfoMessage'
import { NotLoggedError } from '@/components/Account/NotLoggedError'
import { verifyEmailNotification } from '@/components/Account/VerifyEmailNotification'
import TextEditor from '../Common/TextEditor/TextEditor'

interface ProjectCreateUpdateProps {
  id?: number
}

const ProjectCreateUpdate = (props?: ProjectCreateUpdateProps) => {
  const router = useRouter()

  const currentProjectQuery = useQuery({
    queryKey: [ProjectsQueryKey, props?.id],
    queryFn: () => Projects.getProject(props?.id),
  })

  const currentProject = useMemo(() => currentProjectQuery.data, [currentProjectQuery.data])

  const queryClient = useQueryClient()

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const interestsQuery = useQuery({
    queryKey: [InterestQueryKey],
    queryFn: Interests.getInterests,
  })

  const departmentsQuery = useQuery({
    queryKey: [DepartmentsQueryKey],
    queryFn: () =>
      ResearchDepartments.getResearchDepartments({
        relations: [ResearchDepartmentRelations.facility, ResearchDepartmentRelations.institution],
      }),
  })

  const handleGoBack = () => {
    router.push('/projects')
  }

  const createUpdateProjectMutation = useMutation({
    mutationFn: async (values: ProjectNewRequest) => {
      if (errorCurrentUser || !currentUser) {
        notifications.show({
          title: 'Debes iniciar sesión para crear o modificar proyectos',
          color: 'red',
          message: <NotLoggedError action="crear o modificar proyectos" />,
        })

        return Promise.reject('User not logged in')
      }

      if (currentUser?.isEmailVerified === false) {
        notifications.show(verifyEmailNotification('crear o modificar proyectos'))

        return Promise.reject('Email not verified')
      }

      // Set the project values
      const newProject: ProjectNewRequest = { ...values }

      // Format the date correctly (if given)
      if (newProject.endDate) {
        const date: Date = newProject.endDate as unknown as Date
        newProject.endDate = date.toISOString()
      }

      // Validate IDs as integers
      newProject.interestsIds = newProject.interestsIds.map((id) => id)
      newProject.researchDepartmentsIds = newProject.researchDepartmentsIds.map((id) => id)

      // If id exists, update the project
      if (props?.id) {
        if (
          currentProject?.requestEnrollmentCount === undefined ||
          currentProject?.requestEnrollmentCount === null
        ) {
          notifications.show({
            title: 'Debes tener el rol de líder de proyecto para modificar este proyecto',
            color: 'red',
            message:
              'Solo puedes modificar los proyectos en los que tienes el rol de líder. Consulta al líder de tu proyecto para realizar esta acción',
          })

          return Promise.reject('No leader role')
        }

        const updatedProject: ProjectNewResponse = await Projects.updateProject(
          props.id,
          newProject
        )
        if (!updatedProject || updatedProject.id == 0) {
          return Promise.reject('Project not updated')
        }

        return Promise.resolve(updatedProject)
      }

      // Without id, create a new project
      const createdProject: ProjectNewResponse = await Projects.newProject(newProject)
      if (!createdProject || createdProject.id == 0) {
        return Promise.reject('Project not created')
      }

      return Promise.resolve(createdProject)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey, props?.id] })
      notifications.show({
        title: `Proyecto ${props?.id ? `#${props.id} modificado` : 'creado'}`,
        message: `Tu proyecto ha sido ${props?.id ? 'modificado' : 'creado'} con éxito.`,
        color: 'green',
      })
    },
    onError: (error) => {
      console.error(error)
      notifications.show({
        title: 'Error',
        message: `No se pudo ${
          props?.id ? 'modificar' : 'crear'
        } el proyecto. Inténtalo mas tarde.`,
        color: 'red',
      })
    },
  })

  const mutationFailMessage = () => {
    return (
      <Box mx={'-1.5rem'} pt={'1.5rem'}>
        <InfoMessage
          text={`Ocurrió un error al ${
            props?.id ? 'modificar' : 'crear'
          } proyecto, inténtalo mas tarde`}
          type={'error'}
        />
        <Button mx={'1.5rem'} onClick={() => handleGoBack()}>
          Volver a Proyectos
        </Button>
      </Box>
    )
  }

  const mutationSuccessMessage = () => {
    return (
      <Box mx={'-1.5rem'} pt={'1.5rem'}>
        <InfoMessage
          text={`El proyecto ha sido ${props?.id ? 'modificado' : 'creado'} con éxito`}
          type={'info'}
        />
        <Button mx={'1.5rem'} onClick={() => handleGoBack()}>
          Volver a Proyectos
        </Button>
      </Box>
    )
  }

  const validateText = (value?: string) => {
    if (!value) return 'Este campo es obligatorio'
    if (value.length > 256) return 'Máximo 256 caracteres'
    return null
  }

  const validateArray = (array?: string[]) => {
    if (!Array.isArray(array) || array.length == 0) {
      return 'Este campo debe tener al menos 1 elemento'
    }
    if (array.length > 20) {
      return 'Este campo debe tener como máximo 20 elementos'
    }
    return null
  }

  const form = useForm<ProjectNewRequest>({
    initialValues: props?.id
      ? {
          // Update project
          name: currentProject?.name ?? '',
          type: (currentProject?.type as ProjectType) ?? 'Informal',
          language: 'spanish',
          description: currentProject?.description,
          endDate: currentProject?.endDate,
          web: '',
          interestsIds: currentProject?.interests.map((interest) => String(interest.id)) ?? [],
          interestsToCreate: [],
          researchDepartmentsIds:
            currentProject?.researchDepartments.map((department) => String(department.id)) ?? [],
        }
      : {
          // Create project
          name: '',
          type: 'Informal',
          language: 'spanish',
          description: '',
          endDate: undefined,
          web: undefined,
          interestsIds: [],
          interestsToCreate: [],
          researchDepartmentsIds: [],
        },

    validate: {
      name: (value: string) => validateText(value),
      type: (value: ProjectType) => validateText(value),
      language: (value: Language) => validateText(value),
      interestsIds: (value: string[]) => validateArray(value),
      researchDepartmentsIds: (value: string[]) => validateArray(value),
    },
  })

  return (
    <>
      <Paper withBorder shadow="md" mx={'1.5rem'} my={'1rem'} p={'2rem'} radius="md">
        <Text size="2rem" mb="2rem">
          {props?.id ? `Modificar proyecto #${props.id}` : 'Nuevo proyecto'}
        </Text>
        <form
          onSubmit={form.onSubmit((values: ProjectNewRequest) =>
            createUpdateProjectMutation.mutate(values)
          )}>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconFolder size={'2rem'} />
            <TextInput
              flex={1}
              label="Nombre"
              placeholder="Gran proyecto de robótica"
              required
              {...form.getInputProps('name')}
            />
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconInfoSquareRounded size={'2rem'} />
            <Select
              styles={{ input: { cursor: 'pointer' } }}
              labelProps={{ cursor: 'pointer' }}
              flex={1}
              label="Tipo"
              placeholder="Formal"
              data={['Formal', 'Informal']}
              required
              clearable
              searchable
              {...form.getInputProps('type')}
            />
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconLanguage size={'2rem'} />
            <Select
              styles={{ input: { cursor: 'pointer' } }}
              labelProps={{ cursor: 'pointer' }}
              flex={1}
              label="Idioma"
              placeholder="Español"
              data={['spanish', 'english']}
              required
              clearable
              searchable
              {...form.getInputProps('language')}
            />
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconAlignBoxLeftBottom size={'2rem'} />

            <Flex flex={1} direction="column">
              <Text size="sm" mb="0.1rem">
                Descripción
              </Text>
              <TextEditor
                content={form.values.description}
                onChange={(content) => {
                  form.values.description = content
                }}
              />
            </Flex>
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconCalendarEvent size={'2rem'} />
            <DateInput
              styles={{ input: { cursor: 'pointer' } }}
              labelProps={{ cursor: 'pointer' }}
              flex={1}
              label="Fecha de finalización"
              placeholder="Fecha de finalización"
              minDate={new Date()}
              clearable
              {...form.getInputProps('endDate')}
            />
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconWorldWww size={'2rem'} />
            <TextInput
              flex={1}
              label="Web"
              placeholder="www.universidadRobotica.com/projectos/20"
              {...form.getInputProps('web')}
            />
          </Flex>
          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconBulb size={'2rem'} />
            <MultiSelect
              styles={{ inputField: { cursor: 'pointer' } }}
              labelProps={{ cursor: 'pointer' }}
              flex={1}
              label="Intereses"
              placeholder={form.values.interestsIds.length == 0 ? 'Robótica, Redes' : ''}
              data={
                interestsQuery?.data
                  ? interestsQuery.data.map((interest: Interest) => ({
                      value: interest.id.toString(),
                      label: interest.name,
                    }))
                  : []
              }
              required
              clearable
              searchable
              {...form.getInputProps('interestsIds')}
            />
          </Flex>

          <Flex align={'center'} mt={'1rem'} gap={'1rem'}>
            <IconSchool size={'2rem'} />
            <MultiSelect
              flex={1}
              label="Departamentos"
              placeholder={
                form.values.researchDepartmentsIds.length == 0 ? 'Ingeniería electrónica' : ''
              }
              data={
                departmentsQuery?.data
                  ? departmentsQuery.data.map((department: ResearchDepartment) => ({
                      value: department.id.toString(),
                      label: `${department.facility.institution.name} ${department.facility.name} ${department.name}`,
                    }))
                  : []
              }
              required
              clearable
              searchable
              {...form.getInputProps('researchDepartmentsIds')}
            />
          </Flex>
          {createUpdateProjectMutation.isError && mutationFailMessage()}
          {createUpdateProjectMutation.isSuccess ? (
            mutationSuccessMessage()
          ) : (
            <Button type="submit" mt={'3rem'} color="orange.9">
              {props?.id ? 'Modificar proyecto' : 'Crear proyecto'}
            </Button>
          )}
        </form>
      </Paper>
    </>
  )
}

export default ProjectCreateUpdate
