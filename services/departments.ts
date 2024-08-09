import ResearchDepartment from '@/entities/ResearchDepartment'
import axios from 'axios'
import Env from 'utils/config/Env'

const prefix = `${Env.backendAPI}/research-departments`

type DepartmentRelation = 'facility' | 'facility.institution'

export interface FindDepartmentsDto {
  facilityId?: number
  relations?: DepartmentRelation[]
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
}

export const DepartmentQueryKey = 'departments'
