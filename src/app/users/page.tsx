'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { NextPage } from 'next'
import { useSearchParams } from 'next/navigation'
import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { Center, Pagination } from '@mantine/core'

import { CurrentUserQueryOptions } from '@/services/currentUser'
import { DepartmentQueryKey, ResearchDepartments } from '@/services/departments'
import { Facilities } from '@/services/facilities'
import { Institutions } from '@/services/institutions'
import { Interests } from '@/services/interests'
import { GetUsersInput, Users } from '@/services/users'

import Filter from '@/components/Common/Filter/Filter'
import Interest from '@/entities/Interest'
import UserFilterContent from '@/components/User/UserFilterContent'
import UserList from '@/components/User/UserList'
import { UserSortAttribute } from '@/entities/User/UserInList'
import Facility from '@/entities/Facility'
import ResearchDepartment from '@/entities/ResearchDepartment'
import Institution from '@/entities/Institution'
import { Order } from '@/entities/HelpTypes/Order'

const UsersPage: NextPage = () => {
  const usersPerPage = 5
  const [currentPage, setCurrentPage] = useState(1)

  const { data: currentUser, error: errorCurrentUser } = useQuery(
    CurrentUserQueryOptions.currentUser()
  )

  const sortAttributes = useMemo(
    () => [{ value: UserSortAttribute.LastName, label: 'apellido' }],
    [errorCurrentUser, currentUser]
  )

  const searchQuery = useSearchParams()

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

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

  const userParams: GetUsersInput = {
    interestIds: searchQuery.getAll('interest').map((id: string) => +id),
    institutionId: searchQuery.get('university') ? +searchQuery.get('university')! : undefined,
    facilityId: searchQuery.get('facility') ? +searchQuery.get('facility')! : undefined,
    researchDepartmentId: searchQuery.get('department')
      ? +searchQuery.get('department')!
      : undefined,
    sortBy: searchQuery.get('sortBy') as UserSortAttribute | undefined,
    order: searchQuery.get('order') as Order | undefined,
    offset: (currentPage - 1) * usersPerPage,
    limit: usersPerPage,
  }

  const usersQuery = useQuery(
    queryOptions({
      queryKey: ['users', userParams, currentPage, usersPerPage],
      queryFn: () => Users.getUsers(userParams),
      placeholderData: keepPreviousData,
    })
  )

  const interestsQuery = useQuery({
    queryKey: ['interests'],
    queryFn: Interests.getInterests,
  })

  const interests = useMemo(() => {
    if (interestsQuery.data) {
      return interestsQuery.data.map((interest: Interest) => ({
        value: interest.id.toString(),
        label: interest.name,
      }))
    }
    return []
  }, [interestsQuery.data])

  const facilities = useMemo(() => {
    if (facilitiesQuery.data) {
      return facilitiesQuery.data.map((facility: Facility) => ({
        value: facility.id.toString(),
        label: facility.name,
      }))
    }
    return []
  }, [facilitiesQuery.data])

  const departments = useMemo(() => {
    if (departmentsQuery.data) {
      return departmentsQuery.data.map((department: ResearchDepartment) => ({
        value: department.id.toString(),
        label: department.name,
      }))
    }
    return []
  }, [departmentsQuery.data])

  const institutions = useMemo(() => {
    if (institutionsQuery.data) {
      return institutionsQuery.data.map((institution: Institution) => ({
        value: institution.id.toString(),
        label: institution.name,
      }))
    }
    return []
  }, [institutionsQuery.data])

  const totalPages = usersQuery?.data?.usersCount
    ? Math.ceil(usersQuery.data.usersCount / usersPerPage)
    : 1

  return (
    <>
      <Filter
        counter={usersQuery?.data?.usersCount ?? 0}
        content={
          <UserFilterContent
            sortAttributes={sortAttributes}
            interests={interests}
            institutions={institutions}
            facilities={facilities}
            departments={departments}
          />
        }>
        {<UserList users={usersQuery?.data?.users} />}
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

export default UsersPage
