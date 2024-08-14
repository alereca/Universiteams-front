export interface FacilityCreateDto {
  name: string
  abbreviation: string
  web?: string
  institutionId: number | null
}
