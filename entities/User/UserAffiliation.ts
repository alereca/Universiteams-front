import ResearchDepartment from '@/entities/ResearchDepartment'
import User from './User'

export enum UserAffiliationType {
  Student = 'Student',
  Professor = 'Professor',
  Researcher = 'Researcher',
  Other = 'Other',
}

interface UserAffiliation {
  id?: number
  user?: User
  departmentalId?: string
  researchDepartment: ResearchDepartment
  currentType: UserAffiliationType
}

export default UserAffiliation
