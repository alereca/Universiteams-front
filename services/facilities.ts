import axios from 'axios'
import Env from 'utils/config/Env'
import { FacilityCreateDto } from '../entities/Facility/FacilityCreateDto'
import { FacilityUpdateDto } from '../entities/Facility/FacilityUpdateDto'
import Facility from '../entities/Facility/Facility'

const prefix = `${Env.backendAPI}/facilities`

export enum FacilityRelations {
  researchDepartments = 'researchDepartments',
  institution = 'institution',
}

export interface FindFacilitiesDto {
  institutionId?: number
  relations?: FacilityRelations[]
}

export const Facilities = {
  getFacilities: async (params?: FindFacilitiesDto): Promise<Facility[] | undefined> => {
    const url = `${prefix}/`
      .concat(params ? '?' : '')
      .concat(params?.institutionId ? `institutionId=${params.institutionId}&` : '')
      .concat(params?.relations ? `relations=${params.relations.join(',')}` : '')

    const result = await axios.get<Facility[]>(url)
    return result.data
  },
  deleteFacility: async (id: number): Promise<void> => {
    const url = `${prefix}/${id}`
    await axios.delete(url)
  },
  createFacility: async (newFacility: FacilityCreateDto): Promise<void> => {
    const url = `${prefix}/`
    await axios.post(url, newFacility)
  },
  updateFacility: async (updatedFacility: FacilityUpdateDto): Promise<void> => {
    const url = `${prefix}/${updatedFacility.id}`
    await axios.put(url, updatedFacility)
  },
}

export const FacilitiesQueryKey = 'facilities'
