'use client'
import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'

import { GetProjectsInput, Projects } from '@/services/projects'
import ProjectsResult from '@/entities/ProjectsResult'
import SelectItem from '@/entities/HelpTypes/SelectItem'

import Filter from '@/components/Filter'
import ProjectFilterContent from '@/components/Project/ProjectFilterContent'
import ProjectsList from '@/components/Project/ProjectsList'
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'
import { Institutions } from '@/services/institutions'

const ProjectsPage: NextPage = () => {
  const [projectsResult, setProjectsResult] = useState<ProjectsResult>()
  const [institutions, setInstitutions] = useState<SelectItem[]>()
  const [facility, setFacility] = useState<SelectItem[]>()
  const [departments, setDepartments] = useState<SelectItem[]>()

  const sortAttributes: SelectItem[] = [
    { attribute: 'name', displayName: 'nombre' },
    { attribute: 'facility', displayName: 'regional' },
    { attribute: 'creationDate', displayName: 'fecha creación' },
    { attribute: 'researchDepartment', displayName: 'departamento' },
  ]

  const searchQuery = useSearchParams()

  const getInstitutions = async (searchQuery: ReadonlyURLSearchParams) => {
    const institutions = await Institutions.GetInstitutions()

    const institutionsSelectItems: SelectItem[] = []
    const facilitiesSelectItems: SelectItem[] = []
    const departmentsSelectItems: SelectItem[] = []

    const selectedInstitution = searchQuery.get('university')
    const selectedFacility = searchQuery.get('facility')

    if (institutions) {
      institutions.forEach((institution) => {
        institutionsSelectItems.push({
          attribute: institution.id.toString(),
          displayName: institution.name,
        } as SelectItem)

        if (
          institution.facilities &&
          selectedInstitution &&
          institution.id === parseInt(selectedInstitution)
        ) {
          institution.facilities.forEach((facility) => {
            facilitiesSelectItems.push({
              attribute: facility.id.toString(),
              displayName: facility.name,
            } as SelectItem)

            if (
              facility.researchDepartments &&
              selectedFacility &&
              facility.id === parseInt(selectedFacility)
            ) {
              facility.researchDepartments.forEach((department) => {
                departmentsSelectItems.push({
                  attribute: department.id.toString(),
                  displayName: department.name,
                } as SelectItem)
              })
            }
          })
        }
      })
      setInstitutions(institutionsSelectItems)
      setFacility(facilitiesSelectItems)
      setDepartments(departmentsSelectItems)
    }
  }

  useEffect(() => {
    getInstitutions(searchQuery)
  }, [searchQuery])

  const getProjects = async (params: GetProjectsInput) => {
    const result = await Projects.GetProjects(params)
    setProjectsResult(result)
  }

  useEffect(() => {
    console.log(searchQuery.toString())
    getProjects({
      generalSearchTerm: searchQuery.get('generalSearch') || undefined,
      institutionId: searchQuery.get('university')
        ? parseInt(searchQuery.get('university')!)
        : undefined,
      departmentId: searchQuery.get('department')
        ? parseInt(searchQuery.get('department')!)
        : undefined,
      interestIds: searchQuery.getAll('interestIds').map((id) => parseInt(id)),
      type: searchQuery.get('type') || undefined,
      isDown:
        searchQuery.get('isDown') === 'true'
          ? true
          : searchQuery.get('isDown') === 'false'
          ? false
          : undefined,
      dateFrom: searchQuery.get('dateFrom') ? new Date(searchQuery.get('dateFrom')!) : undefined,
      sortBy: searchQuery.get('sortBy') || undefined,
      inAscendingOrder:
        searchQuery.get('inAscendingOrder') === 'true'
          ? true
          : searchQuery.get('inAscendingOrder') === 'false'
          ? false
          : undefined,
    })
  }, [searchQuery])

  return (
    <>
      <Filter
        content={
          <ProjectFilterContent
            sortAttributes={sortAttributes}
            institutions={institutions ?? []}
            facilities={facility ?? []}
            departments={departments ?? []}
          />
        }>
        <ProjectsList projects={projectsResult?.projects} />
      </Filter>
    </>
  )
}

export default ProjectsPage
