export interface Doctor {
  _id: string
  name: string
  specialization: string
  experience: number
  gender: "male" | "female"
  languages: string[]
  location: string
  city: string
  region: string
  rating: number
  reviewCount: number
  recommendationPercentage: number
  availableToday: boolean
  nextAvailable: string
  consultationFee: number
  image?: string
  
  // New fields to match Apollo247 design
  qualifications: string         // e.g., "MBBS, MD (INTERNAL MEDICINE)"
  badge?: string                 // e.g., "DOCTOR OF THE HOUR"
  cashback?: number              // e.g., 60 (for ₹60 Cashback)
  availableIn?: number           // e.g., 3 (for "Available in 3 minutes")
  clinicName: string             // e.g., "Apollo 24|7 Virtual Clinic"
  patientCount?: number          // e.g., 50 (for "50+ Patients")
  patientRatingPercentage?: number // e.g., 94 (for "94%")
  isOnlineConsultAvailable: boolean
  isHospitalVisitAvailable: boolean
  fees: {
    online: number
    hospital?: number
  }
  specialistType?: string        // e.g., "General Physician/ Internal Medicine Specialist"
  yearsDisplay?: string          // e.g., "10 YEARS"
}