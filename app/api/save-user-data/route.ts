import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

interface UserSubmission {
  language: string
  blockId: number
  blockName: string
  wardId: number
  wardName: string
  boothId: number
  boothName: string
  name?: string
  phone?: string
}

export async function POST(request: Request) {
  try {
    const userData: UserSubmission = await request.json()

    if (!userData.blockId || !userData.wardId || !userData.boothId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const name = userData.name || ""
    const phone = userData.phone || ""

    const insertResult = await executeQuery(
      "INSERT INTO user_data (name, phone, block_id, ward_id, booth_id, language, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [name, phone, userData.blockId, userData.wardId, userData.boothId, userData.language],
    )

    const userId = (insertResult as any).insertId

    return NextResponse.json({
      success: true,
      message: "User data saved successfully",
      details: {
        userId,
      },
    })
  } catch (error) {
    console.error("Error saving user data:", error)
    return NextResponse.json({ success: false, error: "Failed to save user data" }, { status: 500 })
  }
}
