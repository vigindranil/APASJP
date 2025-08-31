import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const blockId = searchParams.get("blockId")

    if (!blockId) {
      return NextResponse.json({ success: false, error: "Block ID is required" }, { status: 400 })
    }

    const wards = await executeQuery("SELECT id, block_id, name, name_bn, name_np FROM tbl_gp_ward_mstr where block_id = ? ORDER BY name", [
      Number.parseInt(blockId),
    ])

    return NextResponse.json({
      success: true,
      data: wards,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch wards" }, { status: 500 })
  }
}
