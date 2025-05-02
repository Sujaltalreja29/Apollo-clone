import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "specialization", "experience", "gender"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("apollo247")
    const collection = db.collection("doctors")

    // Calculate yearsDisplay from experience
    const yearsDisplay = `${body.experience} YEARS`;

    // Format qualifications if not provided
    const defaultQualifications = body.gender === "male" ? "MBBS" : "MBBS";
    
    // Set default values for optional fields
    const doctorData = {
      ...body,
      // Basic details
      rating: body.rating || 4.0,
      reviewCount: body.reviewCount || 0,
      recommendationPercentage: body.recommendationPercentage || 90,
      languages: body.languages || ["English", "Hindi"],
      
      // Location details
      city: body.city || body.location || "New Delhi",
      region: body.region || "Delhi",
      
      // Availability
      availableToday: body.availableToday || false,
      availableTomorrow: body.availableTomorrow || true,
      availableWeekend: body.availableWeekend || false,
      nextAvailable: body.nextAvailable || "Tomorrow",
      availableIn: body.availableIn || Math.floor(Math.random() * 10) + 3, // Random 3-12 minutes
      
      // Fees and payment
      consultationFee: body.consultationFee || 499,
      cashback: body.cashback || (Math.random() > 0.5 ? Math.floor(Math.random() * 80) + 40 : null), // Random cashback 40-120 or null
      fees: {
        online: body.fees?.online || body.consultationFee || 499,
        hospital: body.fees?.hospital || body.consultationFee ? body.consultationFee + 100 : 599
      },
      
      // Clinic information
      clinicName: body.clinicName || "Apollo 24|7 Virtual Clinic",
      
      // Professional details
      qualifications: body.qualifications || defaultQualifications,
      yearsDisplay: body.yearsDisplay || yearsDisplay,
      specialistType: body.specialistType || body.specialization,
      
      // Patient statistics
      patientCount: body.patientCount || Math.floor(Math.random() * 200) + 50, // Random 50-250
      patientRatingPercentage: body.patientRatingPercentage || Math.floor(Math.random() * 15) + 85, // Random 85-99%
      
      // Consultation options
      isOnlineConsultAvailable: body.isOnlineConsultAvailable !== undefined ? body.isOnlineConsultAvailable : true,
      isHospitalVisitAvailable: body.isHospitalVisitAvailable !== undefined ? body.isHospitalVisitAvailable : Math.random() > 0.5,
      
      // UI display options
      badge: body.badge || (Math.random() > 0.8 ? "DOCTOR OF THE HOUR" : null), // 20% chance of badge
      
      // System fields
      createdAt: new Date(),
    }

    // Insert doctor into database
    const result = await collection.insertOne(doctorData)

    return NextResponse.json({
      success: true,
      doctorId: result.insertedId,
      message: "Doctor added successfully",
    })
  } catch (error) {
    console.error("Error adding doctor:", error)
    return NextResponse.json({ error: "Failed to add doctor" }, { status: 500 })
  }
}