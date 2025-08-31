import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    const blocks = await executeQuery("SELECT id, name, name_bn, name_np FROM tbl_block_ulb_mstr ORDER BY name")

    return NextResponse.json({
      success: true,
      data: blocks,
    })  
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed. Please check your MySQL connection.",
      },
      { status: 500 },
    )
  }
}
