import ResearchDepartment from './ResearchDepartment'
import User from './User'

export enum UserAffiliationType {
  Student = 'Student',
  Professor = 'Professor',
  Researcher = 'Researcher',
  Other = 'Other',
}

interface UserAffiliation {
  user: User
  researchDepartment: ResearchDepartment
  currentType: UserAffiliationType
}

export default UserAffiliation
