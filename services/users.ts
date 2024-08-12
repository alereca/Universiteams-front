import axios from 'axios'
import Env from 'utils/config/Env'
import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import { EnrollmentRequestsShow } from '@/entities/HelpTypes/EnrollmentRequestsShow'
import User from '@/entities/User'
import UsersResult from '@/entities/UsersResult'
import { UserSortAttribute } from '@/entities/UserInList'
import { Order } from '@/entities/HelpTypes/Order'

const prefix = `${Env.backendAPI}/users`

export interface GetUsersInput {
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

    console.log(url)
    const result = await axios.get<UsersResult>(url)
    return result.data
  },

  // Get one user by id
  getUser: async (id: number): Promise<User | undefined> => {
    const result = await axios.get<User>(`${prefix}/${id}`)
    return result.data
  },
}
