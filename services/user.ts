import User from '@/entities/User'
import axios from 'axios'
import Env from 'utils/config/Env'

interface UsersResult {
  users: User[]
  usersCount: number
}

const prefix = `${Env.backendAPI}/users`

export const Users = {
  getUsers: async (): Promise<UsersResult> => {
    const url = `${prefix}`
    const result = await axios.get<UsersResult>(url)
    return result.data
  },
}
