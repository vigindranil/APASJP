import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    const rows = await executeQuery("SELECT COUNT(*) AS count FROM camp_details")
    const count = Array.isArray(rows) && rows[0]?.count ? Number(rows[0].count) : 0
    return NextResponse.json({ success: true, data: { count } })
  } catch (error) {
    console.error("[camps/count] error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch camp count" }, { status: 500 })
  }
}
