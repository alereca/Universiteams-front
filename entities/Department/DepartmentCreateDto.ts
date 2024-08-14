export interface DepartmentCreateDto {
  name: string
  abbreviation: string
  web?: string
  facilityId: number | null
}
