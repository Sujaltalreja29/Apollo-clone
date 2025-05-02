import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const experience = searchParams.get("experience")
    const gender = searchParams.get("gender")
    const availability = searchParams.get("availability")
    const language = searchParams.get("language")
    const fees = searchParams.get("fees")
    const facility = searchParams.get("facility")
    const modeOfConsult = searchParams.get("modeOfConsult")
    const sortBy = searchParams.get("sortBy") || "relevance"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

    // Experience filter
    if (experience) {
      const [min, max] = experience.split("-")
      if (max) {
        query.experience = { $gte: Number.parseInt(min), $lte: Number.parseInt(max) }
      } else {
        // Handle "15+" case
        query.experience = { $gte: Number.parseInt(min.replace("+", "")) }
      }
    }

    // Gender filter
    if (gender) {
      query.gender = gender
    }

    // Availability filter
    if (availability) {
      if (availability === "today") {
        query.availableToday = true
      } else if (availability === "tomorrow") {
        query.availableTomorrow = true
      } else if (availability === "weekend") {
        query.availableWeekend = true
      }
    }

    // Language filter
    if (language) {
      query.languages = { $in: [language] }
    }

    // Fees filter
    if (fees) {
      // Parse fee ranges like "100-500", "500-1000", "1000+"
      const [min, max] = fees.split("-")
      if (max) {
        query["fees.online"] = { $gte: Number.parseInt(min), $lte: Number.parseInt(max) }
      } else {
        // Handle "1000+" case
        query["fees.online"] = { $gte: Number.parseInt(min.replace("+", "")) }
      }
    }

    // Facility filter
    if (facility === "apollo") {
      query.clinicName = { $regex: "Apollo", $options: "i" }
    } else if (facility === "other") {
      query.clinicName = { $not: { $regex: "Apollo", $options: "i" } }
    }

    // Mode of consult filter
    if (modeOfConsult === "online") {
      query.isOnlineConsultAvailable = true
    } else if (modeOfConsult === "hospital") {
      query.isHospitalVisitAvailable = true
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("apollo247")
    const collection = db.collection("doctors")

    // Build sort options
    let sortOptions = {}
    switch (sortBy) {
      case "experience_high":
        sortOptions = { experience: -1 }
        break
      case "experience_low":
        sortOptions = { experience: 1 }
        break
      case "rating":
        sortOptions = { rating: -1 }
        break
      case "fee_low":
        sortOptions = { "fees.online": 1 }
        break
      case "fee_high":
        sortOptions = { "fees.online": -1 }
        break
      case "availability":
        sortOptions = { availableIn: 1 } // Sort by quickest availability
        break
      default:
        // For relevance, prioritize doctors with badges, then high ratings
        sortOptions = { badge: -1, patientRatingPercentage: -1, experience: -1 }
    }

    // Execute query with pagination
    const doctors = await collection.find(query).sort(sortOptions).skip(skip).limit(limit).toArray()

    // Get total count for pagination
    const total = await collection.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    // Enhance the doctor data for display
    const enhancedDoctors = doctors.map(doctor => {
      return {
        ...doctor,
        // Format the fee display with commas for thousands
        formattedFee: `₹${doctor.fees?.online?.toLocaleString() || doctor.consultationFee?.toLocaleString() || "499"}`,
        
        // Format availability time
        availabilityText: doctor.availableIn 
          ? `Available in ${doctor.availableIn} minutes` 
          : (doctor.availableToday ? "Available today" : "Available tomorrow"),
        
        // Format full location
        fullLocation: `${doctor.clinicName} - ${doctor.region}, ${doctor.city}`
      }
    })

    return NextResponse.json({
      doctors: enhancedDoctors,
      total,
      totalPages,
      currentPage: page,
    })
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
  }
}