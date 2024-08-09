import Interest from '@/entities/Interest'
import axios from 'axios'
import Env from 'utils/config/Env'

const prefix = `${Env.backendAPI}/interests`

export const Interests = {
  getInterests: async (): Promise<Interest[] | undefined> => {
    const url = `${prefix}/`
    const result = await axios.get<Interest[]>(url)
    return result.data
  },
}

export const InterestQueryKey = 'interests'
