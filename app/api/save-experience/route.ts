import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, experience, language } = body

    if (!experience) {
      return NextResponse.json({ success: false, error: "Experience is required" }, { status: 400 })
    }

    const finalName = name || ""
    const finalPhone = phone || ""

    const result = await executeQuery(
      "INSERT INTO user_experiences (name, phone, experience, language, created_at) VALUES (?, ?, ?, ?, NOW())",
      [finalName, finalPhone, experience, language || "en"],
    )

    const experienceId = (result as any).insertId

    const response = {
      success: true,
      message: "Thank you for sharing your experience with us! Your feedback is valuable.",
      experienceId: experienceId,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error saving experience:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
