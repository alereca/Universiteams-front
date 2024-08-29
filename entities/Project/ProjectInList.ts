import Enrollment from '@/entities/Enrollment/Enrollment'
import Interest from '@/entities/Interest'
import ResearchDepartment from '@/entities/ResearchDepartment'
import Language from '@/entities/HelpTypes/Language'

export enum ProjectSortAttribute {
  Name = 'name',
  CreationDate = 'creationDate',
  RequestEnrollmentCount = 'requestEnrollmentCount',
}

export enum RequestState {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Unenrolled = 'Unenrolled',
  Kicked = 'Kicked',
}

interface ProjectInList {
  id: number
  name: string
  type: string
  language: Language
  web?: string
  userCount: number
  favoriteCount: number
  creationDate: string
  endDate: string
  isDown: boolean
  isFavorite?: boolean
  requestState?: RequestState
  requesterMessage?: string
  adminMessage?: string
  requestEnrollmentCount?: number
  researchDepartments: ResearchDepartment[]
  interests: Interest[]
  enrollments: Enrollment[]
}

export default ProjectInList
