import Facility from './Facility/Facility'

interface Institution {
  id: number
  name: string
  abbreviation: string
  web?: string
  facilities?: Facility[]
}

export default Institution
