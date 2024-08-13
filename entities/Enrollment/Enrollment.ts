import ProjectInList from '@/entities/Project/ProjectInList'
import User from '@/entities/User/User'

export enum ProjectRole {
  Leader = 'Leader',
  Admin = 'Admin',
  Member = 'Member',
}

interface Enrollment {
  id: number
  role: ProjectRole
  user: User
  project: ProjectInList
}

export default Enrollment
