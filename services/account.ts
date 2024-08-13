import axios from 'axios'
import Env from 'utils/config/Env'
import Login from '@/entities/HelpTypes/Login'
import LoginRegisterType from '@/entities/HelpTypes/LoginRegisterType'
import { CurrentUserInfo } from './currentUser'
import { ResetPassword } from '../entities/HelpTypes/ResetPassword'
import Interest from '../entities/Interest'
import UserAffiliation, { UserAffiliationType } from '../entities/User/UserAffiliation'

const prefix = `${Env.backendAPI}/auth`

export interface ResearchDepartmentInput {
  id: number
  currentType: UserAffiliationType
}

export interface ProfileInputDto {
  interestsIds: number[]
  interestsToCreate?: string[]
  researchDepartments: ResearchDepartmentInput[]
}

export interface ProfileOutputDto {
  id: number
  interests: Interest[]
  userAffiliations: UserAffiliation[]
}

export const Account = {
  authenticate: async (values: Login, type: LoginRegisterType) => {
    const url = `${prefix}/${type}`
    await axios.post<CurrentUserInfo>(url, values)
  },
  saveProfile: async (values: ProfileInputDto) => {
    const url = `${prefix}/profile`
    await axios.put(url, values)
  },
  getProfile: async () => {
    const url = `${prefix}/profile`
    const { data } = await axios.get<ProfileOutputDto>(url)
    return data
  },
  forgotPassword: async (email: string) => {
    const url = `${prefix}/forgot-password`
    await axios.post(url, { email })
  },
  resetPassword: async (values: ResetPassword) => {
    const url = `${prefix}/reset-password`
    await axios.post(url, values)
  },
  verifyEmail: async (verificationToken: string) => {
    const url = `${prefix}/verify-email`
    await axios.post(url, { verificationToken })
  },
}
