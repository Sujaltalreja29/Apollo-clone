"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronRight, Info, ArrowDownUp, ChevronLeft } from "lucide-react"
import FilterSidebar from "./filter-sidebar"
import type { Doctor } from "@/types/doctor"

export default function DoctorListing() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Get filter params
  const experience = searchParams.get("experience") || ""
  const gender = searchParams.get("gender") || ""
  const availability = searchParams.get("availability") || ""
  const language = searchParams.get("language") || ""
  const fees = searchParams.get("fees") || ""
  const facility = searchParams.get("facility") || ""
  const modeOfConsult = searchParams.get("modeOfConsult") || ""
  const sortBy = searchParams.get("sortBy") || "relevance"
  const page = Number.parseInt(searchParams.get("page") || "1")

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        if (experience) queryParams.append("experience", experience)
        if (gender) queryParams.append("gender", gender)
        if (availability) queryParams.append("availability", availability)
        if (language) queryParams.append("language", language)
        if (fees) queryParams.append("fees", fees)
        if (facility) queryParams.append("facility", facility)
        if (modeOfConsult) queryParams.append("modeOfConsult", modeOfConsult)
        if (sortBy) queryParams.append("sortBy", sortBy)
        queryParams.append("page", page.toString())
        queryParams.append("limit", "5") // Show 5 doctors per page

        const response = await fetch(`/api/doctors?${queryParams.toString()}`)
        const data = await response.json()

        setDoctors(data.doctors)
        setTotalDoctors(data.total)
        setTotalPages(data.totalPages || Math.ceil(data.total / 5))
      } catch (error) {
        console.error("Error fetching doctors:", error)
        // Fallback to sample data in case API fails
        
        setTotalDoctors(761)
        setTotalPages(153) // 761 / 5 = ~153 pages
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [experience, gender, availability, language, fees, facility, modeOfConsult, sortBy, page])

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", newSortBy)
    params.set("page", "1")
    router.push(`/?${params.toString()}`)
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return

    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/?${params.toString()}`)
    
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate pagination items
  const getPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5 // Show max 5 page numbers

    // Always show first page
    items.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        className={`px-3 py-1 mx-1 border ${page === 1 ? 'bg-[#106c89] text-white border-[#106c89]' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} rounded`}
      >
        1
      </button>
    )

    // Calculate range of pages to show
    let startPage = Math.max(2, page - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3) // -3 for first, last, and ellipsis

    // Adjust if we're near the start
    if (page <= 3) {
      startPage = 2
      endPage = Math.min(totalPages - 1, maxVisiblePages - 1)
    }
    
    // Adjust if we're near the end
    if (page >= totalPages - 2) {
      endPage = totalPages - 1
      startPage = Math.max(2, totalPages - maxVisiblePages + 1)
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push(
        <span key="ellipsis1" className="px-2 py-1 mx-1">
          …
        </span>
      )
    }

    // Add pages in the middle
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 border ${page === i ? 'bg-[#106c89] text-white border-[#106c89]' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} rounded`}
        >
          {i}
        </button>
      )
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push(
        <span key="ellipsis2" className="px-2 py-1 mx-1">
          …
        </span>
      )
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 mx-1 border ${page === totalPages ? 'bg-[#106c89] text-white border-[#106c89]' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} rounded`}
        >
          {totalPages}
        </button>
      )
    }

    return items
  }

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 border-r border-gray-200">
          <FilterSidebar />
        </div>

        <div className="md:w-3/4 px-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-sm mb-5">
            <a href="#" className="text-[#106c89] hover:underline">Home</a>
            <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
            <a href="#" className="text-[#106c89] hover:underline">Doctors</a>
            <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
            <span className="text-[#106c89]">General Physicians</span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Consult General Physicians Online - Internal Medicine Specialists
              </h1>
              <p className="text-gray-700">
                ({totalDoctors} doctors)
              </p>
            </div>
            
            {/* Availability Filter Button */}
            <div className="mt-4 md:mt-0">
              <button 
                className="border border-gray-300 rounded px-4 py-2 flex items-center space-x-2"
                onClick={() => handleSortChange(sortBy === 'availability' ? 'relevance' : 'availability')}
              >
                <ArrowDownUp className="h-4 w-4" />
                <span>Availability</span>
                <ChevronRight className="h-4 w-4 -rotate-90" />
              </button>
            </div>
          </div>

          {/* Doctor Listings */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#106c89]"></div>
              </div>
            ) : doctors.length > 0 ? (
              <>
                {doctors.map((doctor, index) => (
                  <div key={doctor._id || index} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="p-4">
                      <div className="flex">
                        {/* Doctor Image */}
                        <div className="w-24 h-24 min-w-[96px]">
                          <div className="relative w-20 h-20 rounded-md overflow-hidden">
                            <Image
                              src={doctor.image || "/placeholder-doctor.jpg"}
                              alt={doctor.name}
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </div>
                        </div>

                        {/* Doctor Info */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h2 className="text-lg font-semibold text-gray-900">
                                  {doctor.name}
                                </h2>
                                <Info className="h-4 w-4 ml-1 text-gray-400" />
                              </div>
                              <p className="text-gray-500 text-sm mb-1">
                                {doctor.specialistType || doctor.specialization}
                              </p>
                              <div className="text-purple-600 text-sm font-medium mb-3">
                                {doctor.yearsDisplay || `${doctor.experience} YEARS`} • {doctor.qualifications || "MBBS"}
                              </div>
                              
                              <div className="text-gray-500 text-sm">
                                {doctor.location}
                              </div>
                              <div className="text-gray-500 text-sm">
                                {doctor.clinicName || "Apollo 24|7 Virtual Clinic"} - {doctor.region || "Region"}, {doctor.city || doctor.location}
                              </div>
                              
                              {(doctor.patientRatingPercentage || doctor.patientCount) && (
                                <div className="flex items-center mt-2">
                                  <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                                    <svg className="h-4 w-4 text-green-600 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-green-700 font-medium">{doctor.patientRatingPercentage || doctor.recommendationPercentage}%</span>
                                    <span className="text-green-700 ml-1">({doctor.patientCount || doctor.reviewCount}+ Patients)</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Fee and Badge */}
                            <div className="text-right">
                              {doctor.badge && (
                                <span className="inline-block bg-yellow-500 text-white text-xs py-1 px-2 uppercase font-medium mb-2">
                                  {doctor.badge}
                                </span>
                              )}
                              <div className="text-xl font-semibold">
                                ₹{doctor.fees?.online || doctor.consultationFee || 499}
                              </div>
                              
                              {doctor.cashback && (
                                <div className="flex items-center justify-end text-sm text-orange-600">
                                  <span className="inline-block h-5 w-5 bg-orange-500 rounded-full mr-1 flex items-center justify-center text-white text-xs">C</span>
                                  <span>₹{doctor.cashback} Cashback</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Consult Button */}
                          <div className="mt-4 flex justify-end">
                            <button className="border border-[#106c89] text-[#106c89] rounded-md px-4 py-2 min-w-[180px] hover:bg-blue-50 transition-colors">
                              <div className="text-center">
                                <div>Consult Online</div>
                                {doctor.availableIn && (
                                  <div className="text-xs">Available in {doctor.availableIn} minutes</div>
                                )}
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center my-8">
                    <nav className="flex items-center">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className={`flex items-center px-3 py-1 border rounded mr-2 ${
                          page === 1 
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        <span>Previous</span>
                      </button>
                      
                      <div className="flex">
                        {getPaginationItems()}
                      </div>

                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className={`flex items-center px-3 py-1 border rounded ml-2 ${
                          page === totalPages 
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No doctors found matching your criteria.</p>
                <button 
                  onClick={() => router.push("/")}
                  className="mt-4 text-[#106c89] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
