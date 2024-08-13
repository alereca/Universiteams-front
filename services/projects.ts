import axios from 'axios'
import Env from 'utils/config/Env'
import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import { EnrollmentChangeRole } from '@/entities/Enrollment/EnrollmentChangeRole'
import { EnrollmentRequestAdmin } from '@/entities/Enrollment/EnrollmentRequestReject'
import { EnrollmentRequestInput } from '../entities/Enrollment/EnrollmentRequestInput'
import { EnrollmentRequestsShow } from '@/entities/Enrollment/EnrollmentRequestsShow'
import { Order } from '@/entities/HelpTypes/Order'
import Project from '@/entities/Project/Project'
import ProjectsResult from '@/entities/Project/ProjectsResult'
import { ProjectSortAttribute, RequestState } from '@/entities/Project/ProjectInList'

const prefix = `${Env.backendAPI}/projects`

export interface GetProjectsInput {
  generalSearchTerm?: string
  institutionId?: number
  facilityId?: number
  researchDepartmentId?: number
  interestIds?: number[]
  userId?: number
  type?: string
  requestStates?: RequestState[]
  dateFrom?: Date
  isDown?: boolean
  isFavorite?: boolean
  sortBy?: ProjectSortAttribute
  order?: Order
  limit?: number
  offset?: number
}

export const Projects = {
  // Find all projects
  async getProjects(params?: GetProjectsInput): Promise<ProjectsResult | undefined> {
    const url = `${prefix}`
      .concat(params ? '?' : '')
      .concat(params?.generalSearchTerm ? `generalSearch=${params.generalSearchTerm}&` : '')
      .concat(params?.institutionId ? `institutionId=${params.institutionId}&` : '')
      .concat(params?.facilityId ? `facilityId=${params.facilityId}&` : '')
      .concat(
        params?.researchDepartmentId ? `researchDepartmentId=${params.researchDepartmentId}&` : ''
      )
      .concat(
        params?.interestIds && params?.interestIds.length > 0
          ? params.interestIds.map((id) => `interestIds=${id}&`).join('')
          : ''
      )
      .concat(params?.userId ? `userId=${params.userId}&` : '')
      .concat(params?.type ? `type=${params.type}&` : '')
      .concat(
        params?.requestStates && params.requestStates.length > 0
          ? params.requestStates.map((state) => `requestStates=${state}&`).join('')
          : ''
      )
      .concat(params?.dateFrom ? `dateFrom=${params.dateFrom.toISOString()}&` : '')
      .concat(params?.isDown ? `isDown=${params.isDown}&` : '')
      .concat(params?.isFavorite ? `isFavorite=${params.isFavorite}&` : '')
      .concat(params?.sortBy ? `sortBy=${params.sortBy}&` : '')
      .concat(params?.order ? `order=${params.order}&` : '')
      .concat(params?.limit ? `limit=${params.limit}&` : '')
      .concat(params?.offset ? `offset=${params.offset}&` : '')

    const result = await axios.get<ProjectsResult>(url)
    return result.data
  },

  async getProject(id: number): Promise<Project | undefined> {
    const result = await axios.get<Project>(`${prefix}/${id}`)
    return result.data
  },

  async favorite(id: number): Promise<void> {
    await axios.post(`${prefix}/${id}/favorite`)
  },

  async unfavorite(id: number): Promise<void> {
    await axios.delete(`${prefix}/${id}/favorite`)
  },

  async requestEnrollment(id: number, enrollmentRequest: EnrollmentRequestInput): Promise<void> {
    await axios.post(`${prefix}/${id}/enroll-request`, enrollmentRequest)
  },

  async updateEnrollmentRequest(
    id: number,
    enrollmentRequest: EnrollmentRequestInput
  ): Promise<void> {
    await axios.put(`${prefix}/${id}/enroll-request`, enrollmentRequest)
  },

  async cancelEnrollmentRequest(id: number): Promise<void> {
    await axios.delete(`${prefix}/${id}/enroll-request`)
  },

  async getEnrollmentRequests(id: number): Promise<EnrollmentRequestsShow> {
    const result = await axios.get<EnrollmentRequestsShow>(`${prefix}/${id}/enroll-requests`)
    return result.data
  },

  async unenroll(id: number, unenrollOptions: Unenroll): Promise<void> {
    await axios.put(`${prefix}/${id}/enrollment/unenroll`, unenrollOptions)
  },

  async ackKick(id: number): Promise<void> {
    await axios.delete(`${prefix}/${id}/enrollment`)
  },

  async approveEnrollmentRequest(
    id: number,
    userId: number,
    adminOptions: EnrollmentRequestAdmin
  ): Promise<void> {
    await axios.put(`${prefix}/${id}/enroll-requests/${userId}/approve`, adminOptions)
  },

  async rejectEnrollmentRequest(
    id: number,
    userId: number,
    adminOptions: EnrollmentRequestAdmin
  ): Promise<void> {
    await axios.put(`${prefix}/${id}/enroll-requests/${userId}/reject`, adminOptions)
  },

  async revokeEnrollment(
    id: number,
    userId: number,
    adminOptions: EnrollmentRequestAdmin
  ): Promise<void> {
    await axios.put(`${prefix}/${id}/enrollments/${userId}/kick`, adminOptions)
  },

  async changeEnrollmentRole(
    id: number,
    userId: number,
    changeRoleOptions: EnrollmentChangeRole
  ): Promise<void> {
    await axios.put(`${prefix}/${id}/enrollments/${userId}/change-role`, changeRoleOptions)
  },
}

export const ProjectsQueryKey = 'projects'

export const ProjectQueryOptions = {
  projects: (currentPage: number, projectsPerPage: number, params?: GetProjectsInput) =>
    queryOptions({
      queryKey: [ProjectsQueryKey, params, currentPage, projectsPerPage],
      queryFn: () => Projects.getProjects(params),
      placeholderData: keepPreviousData,
    }),
}

export const EnrollmentRequestsQueryKey = 'enrollmentRequests'
