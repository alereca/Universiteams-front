import axios from 'axios'
import Env from 'utils/config/Env'

import Institution from '@/entities/Institution'
import { InstitutionCreateDto } from '../entities/Institution/InstitutionCreateDto'
import { InstitutionUpdateDto } from '../entities/Institution/InstitutionUpdateDto'

const prefix = `${Env.backendAPI}/institutions`

export const Institutions = {
  getInstitutions: async (): Promise<Institution[] | undefined> => {
    const url = `${prefix}/`
    const result = await axios.get<Institution[]>(url)
    return result.data
  },
  deleteInstitution: async (id: number): Promise<void> => {
    const url = `${prefix}/${id}`
    await axios.delete(url)
  },
  createInstitution: async (newInstitution: InstitutionCreateDto): Promise<void> => {
    const url = `${prefix}/`
    await axios.post(url, newInstitution)
  },
  updateInstitution: async (updatedInstitution: InstitutionUpdateDto): Promise<void> => {
    const url = `${prefix}/${updatedInstitution.id}`
    await axios.put(url, updatedInstitution)
  },
}

export const InstitutionQueryKey = 'institutions'
