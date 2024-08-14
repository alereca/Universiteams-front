import Institution from '../Institution'
import ResearchDepartment from '../ResearchDepartment'

interface Facility {
  id: number
  name: string
  abbreviation: string
  web?: string
  institution: Institution
  researchDepartments?: ResearchDepartment[]
}

export default Facility
