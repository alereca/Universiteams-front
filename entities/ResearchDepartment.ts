import Facility from './Facility/Facility'

interface ResearchDepartment {
  id: number
  name: string
  abbreviation: string
  web?: string
  facility: Facility
}

export default ResearchDepartment
