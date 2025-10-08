export type TechnicianStatus = "available" | "busy" | "inactive"

export interface TechnicianCertification {
  id: string
  name: string
  issuer?: string
  year?: number
}

export interface Technician {
  id: string
  name: string
  email: string
  phone?: string
  status: TechnicianStatus
  rating: number
  activeTickets: number
  completedTickets: number
  specialties: string[]
  subSpecialties?: string[]
  experienceYears?: number
  certifications?: TechnicianCertification[]
  languages?: string[]
  avgResponseTime?: number | string
}

export interface CategoryTechnicianAssignment {
  technicians: string[]
  subcategories: Record<string, string[]>
}

export type TechnicianCategoryAssignments = Record<string, CategoryTechnicianAssignment>
