import axios from 'axios'
import Env from '../utils/config/Env'
import { queryOptions } from '@tanstack/react-query'

export enum UserSystemRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export interface CurrentUserInfo {
  id: number
  user: string
  email: string
  isEmailVerified: boolean
  systemRole: UserSystemRole
}

const prefix = `${Env.backendAPI}/auth`

export const CurrentUserService = {
  async fetchUserInfo(): Promise<CurrentUserInfo | null> {
    const response = await axios.get<CurrentUserInfo>(`${prefix}/me`)

    return response.data
  },
}

export const CurrentUserQueryOptions = {
  currentUser: () =>
    queryOptions({
      queryKey: ['currentUser'],
      queryFn: CurrentUserService.fetchUserInfo,
    }),
}
