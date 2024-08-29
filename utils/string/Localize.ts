import { ProjectRole } from '../../entities/Enrollment/Enrollment'

export const localizeProjectRole = (role: ProjectRole) => {
  switch (role) {
    case ProjectRole.Admin:
      return 'Administrador'
    case ProjectRole.Member:
      return 'Miembro'
    case ProjectRole.Leader:
      return 'Lider'
    default:
      return ''
  }
}
