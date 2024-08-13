import User from '@/entities/User/User'

export interface EnrollmentRequestShow {
  id: number
  requesterMessage: string
  creationDate: string
  user: User
}
