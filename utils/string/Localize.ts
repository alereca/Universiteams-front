import Language from '@/entities/HelpTypes/Language'
import { ProjectRole } from '@/entities/Enrollment/Enrollment'
import { UserAffiliationType } from '@/entities/User/UserAffiliation'

const affiliationType = (type: UserAffiliationType): string => {
  switch (type) {
    case UserAffiliationType.Student:
      return 'Alumno'
    case UserAffiliationType.Professor:
      return 'Profesor'
    case UserAffiliationType.Researcher:
      return 'Investigador'
    case UserAffiliationType.Other:
      return 'Otro'
    default:
      return 'Desconocido'
  }
}

const projectLanguage = (language: Language): string => {
  switch (language) {
    case Language.Spanish:
      return 'Español'
    case Language.English:
      return 'Inglés'
    default:
      return 'Desconocido'
  }
}

const projectRole = (role: ProjectRole): string => {
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

const Localize = { affiliationType, projectLanguage, projectRole }
export default Localize
