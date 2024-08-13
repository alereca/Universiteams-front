import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Alert, Badge, Card, Flex, Group, Tabs, Text } from '@mantine/core'
import { useMantineColorScheme } from '@mantine/core'

import { Users } from '@/services/users'
import { IconBulb, IconFolders, IconSchool } from '@tabler/icons-react'

import styles from '@/components/Enrollment/EnrollmentList.module.css'
import SkeletonFull from '@/components/Common/Loader/SkeletonFull'
import UserAffiliation from '@/entities/User/UserAffiliation'
import Interest from '@/entities/Interest'
import Enrollment from '@/entities/Enrollment/Enrollment'
import Dates from 'utils/string/Dates'
import ResearchDepartment from '@/entities/ResearchDepartment'

interface UserDetailsParams {
  id: number
}

export enum UserDetailsTabs {
  Projects = 'projects',
}

const UserDetails = (props: UserDetailsParams) => {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['users', props.id],
    queryFn: () => Users.getUser(props.id),
  })

  const { colorScheme } = useMantineColorScheme()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Handle methods in users endpoint
  const handleInterestTagClick = (interestId: number) => {
    router.push(`/users?interest=${interestId}`)
  }

  const handleDepartmentBadgeClick = (
    institutionId: number,
    facilityId: number,
    departmentId: number
  ) => {
    router.push(
      `/users?university=${institutionId}&facility=${facilityId}&department=${departmentId}`
    )
  }

  // Handle method in projects endpoint
  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`)
  }

  if (isLoading) return <SkeletonFull />
  if (error) return <Alert color="red">{error.message}</Alert>
  if (!user) return <Alert color="red">No se encontró el usuario</Alert>

  return (
    <>
      <Card key={user.id} mx="md" mb="0.5rem" p="md" radius="md" withBorder>
        <Text style={{ fontSize: '3rem', fontWeight: 500, lineHeight: '3rem' }}>
          {user.firstName} {user.lastName}
        </Text>
        {Array.isArray(user.userAffiliations) && user.userAffiliations.length > 0 && (
          <Group mt={'1rem'}>
            <IconSchool size={25} />
            <Flex direction={'row'} gap={'0.5rem'} mt={'0.5rem'}>
              {user.userAffiliations.map((affiliation: UserAffiliation) => (
                <Badge
                  key={affiliation.id}
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
            </Flex>
          </Group>
        )}
        {Array.isArray(user.interests) && user.interests.length > 0 && (
          <Group mt={'1rem'}>
            <IconBulb size={25} />
            <Group gap={'0.5rem'} mt={'0.5rem'}>
              {user.interests.map((interest: Interest) => (
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
          </Group>
        )}
        <Tabs
          mt={'2rem'}
          value={searchParams.get('activeTab') ?? UserDetailsTabs.Projects}
          onChange={(value) => router.push(`${pathname}?activeTab=${value}`)}>
          <Tabs.List>
            <Tabs.Tab
              value={UserDetailsTabs.Projects}
              leftSection={<IconFolders />}
              rightSection={
                <Badge color="blue" variant="filled">
                  {Array.isArray(user.enrollments) ? user.enrollments.length : 0}
                </Badge>
              }>
              Proyectos
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={UserDetailsTabs.Projects}>
            {Array.isArray(user.enrollments) &&
              user.enrollments.map((enrollment: Enrollment) => (
                <Card
                  key={enrollment.id}
                  p="md"
                  mt="md"
                  withBorder
                  className={`${styles.memberCard} ${
                    colorScheme == 'dark' ? styles.memberCardDark : styles.memberCardLight
                  }`}
                  onClick={() => handleProjectClick(enrollment.project.id)}>
                  <Text style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: '1.75rem' }}>
                    {enrollment.project.name}
                  </Text>
                  <Group justify="space-between" gap="xs">
                    <Group gap={'1rem'} style={{ marginBottom: 'xs' }}>
                      <Text style={{ fontWeight: 500 }}>
                        {enrollment.project.type} |{' '}
                        {Dates.formatDate(enrollment.project.creationDate)}
                        {enrollment.project.endDate
                          ? ` - ${Dates.formatDate(enrollment.project.endDate)}`
                          : ''}
                      </Text>
                      {Array.isArray(enrollment.project.researchDepartments) &&
                        enrollment.project.researchDepartments.map(
                          (department: ResearchDepartment) => (
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
                              {department.facility.institution.abbreviation} |{' '}
                              {department.facility.abbreviation} | {department.name}
                            </Badge>
                          )
                        )}
                    </Group>
                    <Badge variant="outline" color="blue.6" size="sm" radius="xs">
                      {enrollment.role}
                    </Badge>
                  </Group>
                </Card>
              ))}
          </Tabs.Panel>
        </Tabs>
      </Card>
    </>
  )
}

export default UserDetails
