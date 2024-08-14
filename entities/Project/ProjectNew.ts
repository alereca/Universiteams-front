import Enrollment from '@/entities/Enrollment/Enrollment'
import Interest from '@/entities/Interest'
import Language from '@/entities/HelpTypes/Language'
import ProjectType from './ProjectType'
import ResearchDepartment from '@/entities/ResearchDepartment'

export interface ProjectNewRequest {
  name: string
  type: ProjectType
  language: Language
  description?: string
  endDate?: string
  web?: string

  interestsIds: string[]
  interestsToCreate: string[]
  researchDepartmentsIds: string[]
}

export interface ProjectNewResponse {
  id: number
  name: string
  type: ProjectType
  language: Language
  description?: string
  creationDate: string
  endDate?: string
  web?: string

  researchDepartments: ResearchDepartment[]
  interests: Interest[]
  enrollments: Enrollment[]
}
