import React, { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Chip,
  Flex,
  Group,
  Loader,
  Tabs,
  Text,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import {
  IconHeartFilled,
  IconHeart,
  IconUsersGroup,
  IconSend,
  IconX,
  IconCheck,
  IconBubbleText,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react'

import { CurrentUserQueryOptions } from '@/services/currentUser'
import { EnrollmentRequestsQueryKey, Projects, ProjectsQueryKey } from '@/services/projects'

import Dates from '../../utils/string/Dates'
import { EnrollmentRequestShow } from '@/entities/Enrollment/EnrollmentRequestShow'
import sanitizeHtml from 'sanitize-html'

import EnrollmentButton from '@/components/Enrollment/EnrollmentButton'
import { EnrollmentList } from '../Enrollment/EnrollmentList'
import { EnrollmentRequestAdminForm } from '../Enrollment/EnrollmentRequestAdmin'
import { NotLoggedError } from '@/components/Account/NotLoggedError'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import { verifyEmailNotification } from '@/components/Account/VerifyEmailNotification'

interface ProjectDetailsParams {
  id: number
}

export enum ProjectDetailsTabs {
  Members = 'members',
  Requests = 'requests',
}

const ProjectDetails = (props: ProjectDetailsParams) => {
  const {
    data: project,
    error,
    isLoading,
  } = useQuery({
    queryKey: [ProjectsQueryKey, props.id],
    queryFn: () => Projects.getProject(props.id),
  })

  const sanitizedDescription = useMemo(
    () => sanitizeHtml(project?.description ?? ''),
    [project?.description]
  )

  const queryClient = useQueryClient()

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const {
    data: enrollmentRequests,
    error: errorEnrollmentRequests,
    isLoading: isLoadingEnrollmentRequests,
  } = useQuery({
    queryKey: [EnrollmentRequestsQueryKey, props.id],
    queryFn: () => Projects.getEnrollmentRequests(props.id),
    enabled:
      project?.requestEnrollmentCount !== undefined && project?.requestEnrollmentCount !== null,
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (errorCurrentUser || !currentUser) {
        notifications.show({
          title: 'Debes iniciar sesión para eliminar un proyecto',
          color: 'red',
          message: <NotLoggedError action="eliminar proyecto" />,
        })

        return Promise.reject('User not logged in')
      }

      if (currentUser?.isEmailVerified === false) {
        notifications.show(verifyEmailNotification('eliminar proyecto'))

        return Promise.reject('Email not verified')
      }

      // Admin
      if (!project?.requestEnrollmentCount) {
        notifications.show({
          title: 'Debes tener el rol de líder de proyecto para eliminar este proyecto',
          color: 'red',
          message:
            'Solo puedes eliminar los proyectos en los que tienes el rol de líder. Consulta al líder de tu proyecto para realizar esta acción',
        })

        return Promise.reject('No leader role')
      }

      return Projects.deleteProject(project.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
    },
  })

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (errorCurrentUser || !currentUser) {
        notifications.show({
          title: 'Debes iniciar sesión para guardar proyectos',
          color: 'red',
          message: <NotLoggedError action="guardar proyectos" />,
        })

        return Promise.reject('User not logged in')
      }

      if (currentUser?.isEmailVerified === false) {
        notifications.show(verifyEmailNotification('guardar proyectos'))

        return Promise.reject('Email not verified')
      }

      return project?.isFavorite ? Projects.unfavorite(project!.id) : Projects.favorite(project!.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectsQueryKey] })
    },
  })

  const handleFavoriteClick = () => {
    favoriteMutation.mutate()
  }

  const handleEditClick = () => {
    router.push(`/projects/${project?.id}/edit`)
  }

  const handleDeleteClick = () => {
    modals.open({
      title: 'Eliminar proyecto',
      centered: true,
      children: (
        <Group mt={'1rem'}>
          <Group>
            <Text>{`El proyecto '${project?.name}' será eliminado permanentemente.`}</Text>
            <Text>{'¿Estás seguro?'}</Text>
          </Group>
          <Group>
            <Button
              onClick={() => {
                deleteMutation.mutate()
                modals.closeAll()
              }}>
              Eliminar
            </Button>
          </Group>
        </Group>
      ),
    })
  }

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleInterestTagClick = (interestId: number) => {
    router.push(`/projects?interest=${interestId}`)
  }

  const handleDepartmentBadgeClick = (
    institutionId: number,
    facilityId: number,
    departmentId: number
  ) => {
    router.push(
      `/projects?university=${institutionId}&facility=${facilityId}&department=${departmentId}`
    )
  }

  const handleViewRequestClick = (request: EnrollmentRequestShow) => {
    modals.open({
      title: `Mensaje de ${request.user.firstName} ${request.user.lastName}`,
      centered: true,
      children: (
        <>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(request.requesterMessage) }} />
        </>
      ),
    })
  }

  const handleAcceptRequestClick = (request: EnrollmentRequestShow) => {
    modals.open({
      title: `Aceptar solicitud de ${request.user.firstName} ${request.user.lastName}`,
      centered: true,
      children: (
        <EnrollmentRequestAdminForm projectId={props.id} request={request} action="approve" />
      ),
    })
  }

  const handleRejectRequestClick = (request: EnrollmentRequestShow) => {
    modals.open({
      title: `Rechazar solicitud de ${request.user.firstName} ${request.user.lastName}`,
      centered: true,
      children: (
        <EnrollmentRequestAdminForm projectId={props.id} request={request} action="reject" />
      ),
    })
  }

  if (isLoading) return <SkeletonFull />
  if (error) return <Alert color="red">{error.message}</Alert>
  if (!project) return <Alert color="red">No se encontró el proyecto</Alert>

  return (
    <>
      <Card key={project.id} mx="md" mb="0.5rem" p="md" radius="md" withBorder>
        <Text style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: '1.75rem' }}>
          {project.name}
        </Text>
        <Group gap={'1rem'} style={{ marginBottom: 'xs' }}>
          <Text style={{ fontWeight: 500 }}>
            {project.type} | {Dates.formatDate(project.creationDate)}
            {project.endDate ? ` - ${Dates.formatDate(project.endDate)}` : ''}
          </Text>
          {project.researchDepartments.map((department) => (
            <Badge
              key={department.id}
              color="pink.6"
              variant="light"
              component="button"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                handleDepartmentBadgeClick(
                  department.facility.institution.id,
                  department.facility.id,
                  department.id
                )
              }>
              {department.facility.institution.abbreviation} | {department.facility.abbreviation} |{' '}
              {department.name}
            </Badge>
          ))}
        </Group>

        <Chip.Group>
          <Group gap={'0.5rem'} mt={'1rem'}>
            {project.interests.map((interest) => (
              <Badge
                variant="dot"
                key={interest.id}
                color="blue.6"
                size="lg"
                style={{ cursor: 'pointer' }}
                onClick={() => handleInterestTagClick(interest.id)}>
                {interest.name}
              </Badge>
            ))}
          </Group>
        </Chip.Group>

        <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />

        <Flex justify="flex-end" align="center" gap={'1rem'}>
          <EnrollmentButton
            projectId={project.id}
            requestState={project.requestState}
            requesterMessage={project.requesterMessage}
            adminMessage={project.adminMessage}
          />
          <Group gap={'0.25rem'}>
            <ActionIcon
              variant="transparent"
              aria-label="Guardar en marcadores"
              onClick={handleFavoriteClick}
              size="lg"
              color={project.isFavorite ? 'blue' : 'gray'}>
              {project.isFavorite ? <IconHeartFilled /> : <IconHeart />}
            </ActionIcon>
            <Text size="sm">{project.favoriteCount}</Text>
          </Group>

          {/* Admin */}
          {project?.requestEnrollmentCount !== undefined &&
            project?.requestEnrollmentCount !== null && (
              <>
                <ActionIcon
                  variant="transparent"
                  aria-label="Editar"
                  onClick={handleEditClick}
                  size="lg"
                  color={'orange.6'}>
                  <IconEdit />
                </ActionIcon>
                <ActionIcon
                  variant="transparent"
                  aria-label="Eliminar"
                  onClick={handleDeleteClick}
                  size="lg"
                  color={'red.6'}>
                  <IconTrash />
                </ActionIcon>
              </>
            )}
        </Flex>

        <Tabs
          value={searchParams.get('activeTab') ?? ProjectDetailsTabs.Members}
          onChange={(value) => router.push(`${pathname}?activeTab=${value}`)}>
          <Tabs.List>
            <Tabs.Tab
              value={ProjectDetailsTabs.Members}
              leftSection={<IconUsersGroup />}
              rightSection={
                <Badge color="blue" variant="filled">
                  {project.userCount}
                </Badge>
              }>
              Miembros
            </Tabs.Tab>

            {project.requestEnrollmentCount !== undefined &&
              project.requestEnrollmentCount !== null && (
                <Tabs.Tab
                  value={ProjectDetailsTabs.Requests}
                  leftSection={<IconSend />}
                  rightSection={
                    <Badge color="blue" variant="filled">
                      {project.requestEnrollmentCount}
                    </Badge>
                  }>
                  Solicitudes
                </Tabs.Tab>
              )}
          </Tabs.List>

          <Tabs.Panel value={ProjectDetailsTabs.Members}>
            <EnrollmentList
              projectId={props.id}
              enrollments={project.enrollments}
              isAdmin={
                project.requestEnrollmentCount !== undefined &&
                project.requestEnrollmentCount !== null
              }
            />
          </Tabs.Panel>

          {!errorEnrollmentRequests && enrollmentRequests && (
            <Tabs.Panel value={ProjectDetailsTabs.Requests}>
              {isLoadingEnrollmentRequests && (
                <Tabs.Tab value={ProjectDetailsTabs.Requests}>
                  <Loader type="dots" />
                </Tabs.Tab>
              )}
              {!isLoadingEnrollmentRequests &&
                enrollmentRequests.enrollmentRequests.map((request) => (
                  <Card key={request.id} p="md" mt="md" withBorder>
                    <Text size="lg" w={500}>
                      {request.user.firstName} {request.user.lastName}
                    </Text>

                    <Group mt="xs" gap="xs">
                      {request.user.userAffiliations.map((affiliation) => (
                        <Badge
                          key={`${request.user.id}:${affiliation.researchDepartment.id}`}
                          color="pink.6"
                          variant="light"
                          component="button"
                          style={{ cursor: 'pointer' }}
                          onClick={(event) => {
                            event.stopPropagation()
                            handleDepartmentBadgeClick(
                              affiliation.researchDepartment.facility.institution.id,
                              affiliation.researchDepartment.facility.id,
                              affiliation.researchDepartment.id
                            )
                          }}>
                          {affiliation.researchDepartment.facility.institution.abbreviation} |{' '}
                          {affiliation.researchDepartment.facility.abbreviation} |{' '}
                          {affiliation.researchDepartment.name}
                        </Badge>
                      ))}
                    </Group>

                    <Group mt="xs" gap="xs">
                      {request.user.interests.map((interest) => (
                        <Badge
                          variant="dot"
                          key={interest.id}
                          color="blue.6"
                          size="lg"
                          style={{ cursor: 'pointer' }}
                          onClick={(event) => {
                            event.stopPropagation()
                            handleInterestTagClick(interest.id)
                          }}>
                          {interest.name}
                        </Badge>
                      ))}
                    </Group>

                    <Group justify="flex-end" mt="xs">
                      <ActionIcon
                        aria-label="Rechazar solicitud"
                        size="lg"
                        color="red"
                        onClick={() => handleRejectRequestClick(request)}>
                        <IconX />
                      </ActionIcon>
                      <ActionIcon
                        aria-label="Aceptar solicitud"
                        size="lg"
                        color="green"
                        onClick={() => handleAcceptRequestClick(request)}>
                        <IconCheck />
                      </ActionIcon>
                      {request.requesterMessage && (
                        <ActionIcon
                          aria-label="Ver solicitud"
                          size="lg"
                          color="gray"
                          onClick={() => handleViewRequestClick(request)}>
                          <IconBubbleText />
                        </ActionIcon>
                      )}
                    </Group>
                  </Card>
                ))}
            </Tabs.Panel>
          )}
        </Tabs>
      </Card>
    </>
  )
}

export default ProjectDetails
