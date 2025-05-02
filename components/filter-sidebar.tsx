"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MapPin } from "lucide-react"

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current filter values
  const currentExperience = searchParams.get("experience") || ""
  const currentFees = searchParams.get("fees") || ""
  const currentLanguage = searchParams.get("language") || ""
  const currentFacility = searchParams.get("facility") || ""
  const currentModeOfConsult = searchParams.get("modeOfConsult") || ""
  
  // Track the checked status for Mode of Consult
  const [modeOfConsult, setModeOfConsult] = useState({
    hospital: currentModeOfConsult === "hospital" || currentModeOfConsult === "both",
    online: currentModeOfConsult === "online" || currentModeOfConsult === "both" || !currentModeOfConsult
  })

  // Apply filter function
  const applyFilter = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // If the same value is already selected, remove it (toggle behavior)
    if (params.get(filterType) === value) {
      params.delete(filterType)
    } else {
      params.set(filterType, value)
    }
    
    params.set("page", "1") // Reset to page 1 when filters change
    router.push(`/?${params.toString()}`)
  }

  // Update mode of consult (special case as it can have multiple values)
  const updateModeOfConsult = (mode: 'hospital' | 'online', checked: boolean) => {
    const newModeOfConsult = {
      ...modeOfConsult,
      [mode]: checked
    }
    
    setModeOfConsult(newModeOfConsult)
    
    const params = new URLSearchParams(searchParams.toString())
    
    // Determine the new mode value
    if (newModeOfConsult.hospital && newModeOfConsult.online) {
      params.set("modeOfConsult", "both")
    } else if (newModeOfConsult.hospital) {
      params.set("modeOfConsult", "hospital")
    } else if (newModeOfConsult.online) {
      params.set("modeOfConsult", "online")
    } else {
      params.delete("modeOfConsult")
    }
    
    params.set("page", "1")
    router.push(`/?${params.toString()}`)
  }

  // Clear all filters
  const clearAllFilters = () => {
    const params = new URLSearchParams()
    params.set("page", "1")
    
    // Keep sort settings if present
    if (searchParams.has("sortBy")) {
      params.set("sortBy", searchParams.get("sortBy")!)
    }
    
    router.push(`/?${params.toString()}`)
    
    // Reset mode of consult state
    setModeOfConsult({
      hospital: false,
      online: true
    })
  }

  // Check if any filter is applied
  const hasActiveFilters = currentExperience || currentFees || currentLanguage || 
                           currentFacility || (currentModeOfConsult && currentModeOfConsult !== "both")

  return (
    <div className="bg-white border-r">
      <div className="p-4">
        {/* Filters Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <button 
              onClick={clearAllFilters} 
              className="text-[#106c89] text-bold font-bold hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Show Doctors Near Me Button */}
        <button className="w-full border border-[#106c89] text-[#106c89] font-bold rounded-md py-2 px-4 mb-6">
          <div className="flex items-center justify-center">
            <span>Show Doctors Near Me</span>
          </div>
        </button>

        {/* Mode of Consult */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">Mode of Consult</h3>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <div 
                className={`h-5 w-5 border-2 rounded flex items-center justify-center text-white ${
                  modeOfConsult.hospital ? "border-teal-600 bg-blue-50" : "border-gray-300"
                }`}
                onClick={() => updateModeOfConsult('hospital', !modeOfConsult.hospital)}
              >
                {modeOfConsult.hospital && (
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 3.5L4.5 7L11 1" stroke="#008080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="ml-2 text-sm text-gray-800">Hospital Visit</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <div 
                className={`h-5 w-5 border-2 rounded flex items-center justify-center text-white ${
                  modeOfConsult.online ? "border-teal-600 bg-blue-50" : "border-gray-300"
                }`}
                onClick={() => updateModeOfConsult('online', !modeOfConsult.online)}
              >
                {modeOfConsult.online && (
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 3.5L4.5 7L11 1" stroke="#008080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="ml-2 text-sm text-gray-800">Online Consult</span>
            </label>
          </div>
        </div>

        {/* Experience (In Years) */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">Experience (In Years)</h3>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={currentExperience === "0-5"}
                onChange={() => applyFilter("experience", "0-5")}
              />
              <span className="ml-2 text-sm text-gray-800">0-5</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={currentExperience === "6-10"}
                onChange={() => applyFilter("experience", "6-10")}
              />
              <span className="ml-2 text-sm text-gray-800">6-10</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={currentExperience === "11-16"}
                onChange={() => applyFilter("experience", "11-16")}
              />
              <span className="ml-2 text-sm text-gray-800">11-16</span>
            </label>
            <div className="pt-1">
              <button 
                className="text-[#106c89] text-sm font-medium hover:underline"
                onClick={() => applyFilter("experience", "16+")}
              >
                +1 More
              </button>
            </div>
          </div>
        </div>

        {/* Fees (In Rupees) */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">Fees (In Rupees)</h3>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={currentFees === "100-500"}
                onChange={() => applyFilter("fees", "100-500")}
              />
              <span className="ml-2 text-sm text-gray-800">100-500</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={currentFees === "500-1000"}
                onChange={() => applyFilter("fees", "500-1000")}
              />
              <span className="ml-2 text-sm text-gray-800">500-1000</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={currentFees === "1000+"}
                onChange={() => applyFilter("fees", "1000+")}
              />
              <span className="ml-2 text-sm text-gray-800">1000+</span>
            </label>
          </div>
        </div>

        {/* Language */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">Language</h3>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={currentLanguage === "English"}
                onChange={() => applyFilter("language", "English")}
              />
              <span className="ml-2 text-sm text-gray-800">English</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={currentLanguage === "Hindi"}
                onChange={() => applyFilter("language", "Hindi")}
              />
              <span className="ml-2 text-sm text-gray-800">Hindi</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={currentLanguage === "Telugu"}
                onChange={() => applyFilter("language", "Telugu")}
              />
              <span className="ml-2 text-sm text-gray-800">Telugu</span>
            </label>
            <div className="pt-1">
              <button 
                className="text-[#106c89] text-sm font-medium hover:underline"
                onClick={() => {
                  // Cycle through additional languages: Tamil, Urdu, Kannada, Malayalam
                  const languageCycle = ['Tamil', 'Urdu', 'Kannada', 'Malayalam', ''];
                  const currentIndex = currentLanguage ? languageCycle.indexOf(currentLanguage) : -1;
                  const nextLanguage = currentIndex < 0 ? languageCycle[0] : languageCycle[(currentIndex + 1) % languageCycle.length];
                  applyFilter("language", nextLanguage);
                }}
              >
                +10 More
              </button>
            </div>
          </div>
        </div>

        {/* Facility */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">Facility</h3>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={currentFacility === "apollo"}
                onChange={() => applyFilter("facility", "apollo")}
              />
              <span className="ml-2 text-sm text-gray-800">Apollo Hospital</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={currentFacility === "other"}
                onChange={() => applyFilter("facility", "other")}
              />
              <span className="ml-2 text-sm text-gray-800">Other Clinics</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}