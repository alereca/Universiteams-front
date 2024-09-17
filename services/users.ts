import axios from 'axios'
import Env from 'utils/config/Env'

import User from '@/entities/User/User'
import UsersResult from '@/entities/User/UsersResult'
import { UserSortAttribute } from '@/entities/User/UserInList'
import { Order } from '@/entities/HelpTypes/Order'

const prefix = `${Env.backendAPI}/users`

export interface GetUsersInput {
  generalSearchTerm?: string
  interestIds?: number[]
  institutionId?: number
  facilityId?: number
  researchDepartmentId?: number
  sortBy?: UserSortAttribute
  order?: Order
  limit?: number
  offset?: number
}

export const Users = {
  // Find all users
  getUsers: async (params?: GetUsersInput) => {
    const url = prefix
      .concat(params ? '?' : '')
      .concat(params?.generalSearchTerm ? `generalSearch=${params.generalSearchTerm}&` : '')
      .concat(
        params?.interestIds && params?.interestIds.length > 0
          ? params.interestIds.map((id: number) => `interestIds=${id}&`).join('')
          : ''
      )
      .concat(params?.institutionId ? `institutionId=${params.institutionId}&` : '')
      .concat(params?.facilityId ? `facilityId=${params.facilityId}&` : '')
      .concat(
        params?.researchDepartmentId ? `researchDepartmentId=${params.researchDepartmentId}&` : ''
      )
      .concat(params?.sortBy ? `sortBy=${params.sortBy}&` : '')
      .concat(params?.order ? `order=${params.order}&` : '')
      .concat(params?.limit ? `limit=${params.limit}&` : '')
      .concat(params?.offset ? `offset=${params.offset}&` : '')

    const result = await axios.get<UsersResult>(url)
    return result.data
  },

  // Get one user by id
  getUser: async (id: number): Promise<User | undefined> => {
    const result = await axios.get<User>(`${prefix}/${id}`)
    return result.data
  },
}
