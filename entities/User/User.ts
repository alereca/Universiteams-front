import Enrollment from '@/entities/Enrollment/Enrollment'
import Interest from '@/entities/Interest'
import UserAffiliation from './UserAffiliation'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  userAffiliations: UserAffiliation[]
  interests: Interest[]
  enrollments: Enrollment[]
}

export default User
