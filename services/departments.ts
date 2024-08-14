import ResearchDepartment from '@/entities/ResearchDepartment'
import axios from 'axios'
import Env from 'utils/config/Env'
import { DepartmentCreateDto } from '../entities/Department/DepartmentCreateDto'
import { DepartmentUpdateDto } from '../entities/Department/DepartmentUpdateDto'

const prefix = `${Env.backendAPI}/research-departments`

export enum ResearchDepartmentRelations {
  institution = 'facility.institution',
  facility = 'facility',
  projects = 'projects',
}

export interface FindDepartmentsDto {
  facilityId?: number
  relations?: ResearchDepartmentRelations[]
  offset?: number
  limit?: number
}

export const ResearchDepartments = {
  getResearchDepartments: async (
    params?: FindDepartmentsDto
  ): Promise<ResearchDepartment[] | undefined> => {
    const url = `${prefix}`
      .concat(params ? '?' : '')
      .concat(params?.facilityId ? `facilityId=${params.facilityId}&` : '')
      .concat(params?.relations?.map((relation) => `relations=${relation}&`).join('') ?? '')

    const result = await axios.get<ResearchDepartment[]>(url)
    return result.data
  },
  deleteDepartment: async (id: number): Promise<void> => {
    const url = `${prefix}/${id}`
    await axios.delete(url)
  },
  createDepartment: async (newDepartment: DepartmentCreateDto): Promise<void> => {
    const url = `${prefix}/`
    await axios.post(url, newDepartment)
  },
  updateDepartment: async (updatedDepartment: DepartmentUpdateDto): Promise<void> => {
    const url = `${prefix}/${updatedDepartment.id}`
    await axios.put(url, updatedDepartment)
  },
}

export const DepartmentsQueryKey = 'departments'
