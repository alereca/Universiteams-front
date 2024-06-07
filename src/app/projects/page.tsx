'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { NextPage } from 'next'

import { ProjectQueryOptions } from '@/services/projects'

import Filter from '@/components/Filter'
import ProjectFilterContent from '@/components/Project/ProjectFilterContent'
import ProjectsList from '@/components/Project/ProjectsList'
import { useSearchParams } from 'next/navigation'
import { Institutions } from '@/services/institutions'
import { Facilities } from '@/services/facilities'
import { DepartmentQueryKey, ResearchDepartments } from '@/services/departments'
import { InterestQueryKey, Interests } from '@/services/interests'
import { Users } from '@/services/user'
import { Center, Pagination } from '@mantine/core'
import { ProjectSortAttribute, RequestState } from '../../../entities/ProjectInList'
import { useQuery } from '@tanstack/react-query'
import { CurrentUserQueryOptions } from '../../../services/currentUser'

const ProjectsPage: NextPage = () => {
  const projectsPerPage = 5
  const [currentPage, setCurrentPage] = useState(1)

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const sortAttributes = useMemo(
    () => [
      { attribute: ProjectSortAttribute.Name, displayName: 'nombre' },
      { attribute: ProjectSortAttribute.CreationDate, displayName: 'fecha creación' },
      ...(errorCurrentUser === null && currentUser !== undefined
        ? [{ attribute: ProjectSortAttribute.RequestEnrollmentCount, displayName: 'solicitudes' }]
        : []),
    ],
    [errorCurrentUser, currentUser]
  )

  const searchQuery = useSearchParams()

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: Users.getUsers,
  })

  const facilitiesQuery = useQuery({
    queryKey: ['facilities', searchQuery.get('university')],
    queryFn: () =>
      Facilities.getFacilities({ institutionId: parseInt(searchQuery.get('university')!) }),
    enabled: !!searchQuery.get('university'),
  })

  const departmentsQuery = useQuery({
    queryKey: [DepartmentQueryKey, searchQuery.get('facility')],
    queryFn: () =>
      ResearchDepartments.getResearchDepartments({
        facilityId: parseInt(searchQuery.get('facility')!),
      }),
    enabled: !!searchQuery.get('facility'),
  })

  const institutionsQuery = useQuery({
    queryKey: ['institutions'],
    queryFn: Institutions.getInstitutions,
  })

  const interestsQuery = useQuery({
    queryKey: [InterestQueryKey],
    queryFn: Interests.getInterests,
  })

  const projectsQuery = useQuery(
    ProjectQueryOptions.projects(currentPage, projectsPerPage, {
      generalSearchTerm: searchQuery.get('generalSearch') || undefined,
      institutionId: searchQuery.get('university')
        ? parseInt(searchQuery.get('university')!)
        : undefined,
      facilityId: searchQuery.get('facility') ? parseInt(searchQuery.get('facility')!) : undefined,
      researchDepartmentId: searchQuery.get('department')
        ? parseInt(searchQuery.get('department')!)
        : undefined,
      interestIds: searchQuery.getAll('interest').map((id) => parseInt(id)),
      userId: searchQuery.get('user') ? parseInt(searchQuery.get('user')!) : undefined,
      type: searchQuery.get('type') || undefined,
      requestStates: searchQuery.getAll('requestState').map((state) => state as RequestState),
      isDown:
        searchQuery.get('isDown') === 'true'
          ? true
          : searchQuery.get('isDown') === 'false'
          ? false
          : undefined,
      isFavorite:
        searchQuery.get('isFavorite') === undefined
          ? undefined
          : searchQuery.get('isFavorite') === 'true',
      dateFrom: searchQuery.get('dateFrom') ? new Date(searchQuery.get('dateFrom')!) : undefined,
      sortBy: (searchQuery.get('sortBy') as ProjectSortAttribute) || undefined,
      inAscendingOrder:
        searchQuery.get('inAscendingOrder') === 'true'
          ? true
          : searchQuery.get('inAscendingOrder') === 'false'
          ? false
          : undefined,
      offset: (currentPage - 1) * projectsPerPage,
      limit: projectsPerPage,
    })
  )

  const users = useMemo(() => {
    if (usersQuery.data) {
      return usersQuery.data.map((user) => ({
        attribute: user.id.toString(),
        displayName: `${user.firstName} ${user.lastName}`,
      }))
    }
    return []
  }, [usersQuery.data])

  const facilities = useMemo(() => {
    if (facilitiesQuery.data) {
      return facilitiesQuery.data.map((facility) => ({
        attribute: facility.id.toString(),
        displayName: facility.name,
      }))
    }
    return []
  }, [facilitiesQuery.data])

  const departments = useMemo(() => {
    if (departmentsQuery.data) {
      return departmentsQuery.data.map((department) => ({
        attribute: department.id.toString(),
        displayName: department.name,
      }))
    }
    return []
  }, [departmentsQuery.data])

  const institutions = useMemo(() => {
    if (institutionsQuery.data) {
      return institutionsQuery.data.map((institution) => ({
        attribute: institution.id.toString(),
        displayName: institution.name,
      }))
    }
    return []
  }, [institutionsQuery.data])

  const interests = useMemo(() => {
    if (interestsQuery.data) {
      return interestsQuery.data.map((interest) => ({
        attribute: interest.id.toString(),
        displayName: interest.name,
      }))
    }
    return []
  }, [interestsQuery.data])

  const totalPages = projectsQuery.data?.projectCount
    ? Math.ceil(projectsQuery.data.projectCount / projectsPerPage)
    : 1

  return (
    <>
      <Filter
        counter={projectsQuery.data?.projectCount ?? 0}
        content={
          <ProjectFilterContent
            sortAttributes={sortAttributes}
            institutions={institutions}
            facilities={facilities}
            departments={departments}
            interests={interests}
            users={users}
          />
        }>
        <ProjectsList projects={projectsQuery.data?.projects} />
        {totalPages > 1 && (
          <Center>
            <Pagination
              value={currentPage}
              total={totalPages}
              onChange={(page) => {
                setCurrentPage(page)
              }}
            />
          </Center>
        )}
      </Filter>
    </>
  )
}

export default ProjectsPage
