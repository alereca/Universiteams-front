import Institution from './Institution'
import ResearchDepartment from './ResearchDepartment'

interface Facility {
  id: number
  name: string
  abbreviation: string
  institution: Institution
  researchDepartments?: ResearchDepartment[]
}

export default Facility
