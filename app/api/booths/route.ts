import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const wardId = searchParams.get("wardId")

    if (!wardId) {
      return NextResponse.json({ success: false, error: "Ward ID is required" }, { status: 400 })
    }

    const booths = await executeQuery(
      "SELECT id, name, name_bn, name_np FROM tbl_electoral_booth_mstr WHERE ward_id = ? ORDER BY name",
      [Number.parseInt(wardId)],
    )

    return NextResponse.json({
      success: true,
      data: booths,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch booths" }, { status: 500 })
  }
}
