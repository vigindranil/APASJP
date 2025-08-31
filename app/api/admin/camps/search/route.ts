import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const blockId = searchParams.get("blockId")
    const wardId = searchParams.get("wardId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const clauses: string[] = []
    const params: any[] = []

    if (blockId) {
      clauses.push("cd.block_id = ?")
      params.push(Number.parseInt(blockId))
    }
    if (wardId) {
      clauses.push("cd.ward_id = ?")
      params.push(Number.parseInt(wardId))
    }
    if (startDate) {
      clauses.push("cd.camp_date >= ?")
      params.push(startDate)
    }
    if (endDate) {
      clauses.push("cd.camp_date <= ?")
      params.push(endDate)
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : ""

    const rows: any[] = await executeQuery(
      `
      SELECT 
          cd.id,
          cd.block_id,
          b.name AS block_name,
          b.name_bn AS block_name_bn,
          b.name_np AS block_name_np,
          cd.ward_id,
          w.name AS ward_name,
          w.name_bn AS ward_name_bn,
          w.name_np AS ward_name_np,
          cd.electoral_booth_id,
          cd.camp_date,
          cd.venue,
          cd.venue_bn,
          cd.venue_np,
          cd.habitation,
          cd.habitation_bn,
          cd.habitation_np,
          cd.ac,
          cd.ac_bn,
          cd.ac_np,
          cd.created_at,
          cd.updated_at
      FROM tbl_camp_schedule cd
      LEFT JOIN tbl_gp_ward_mstr w ON cd.ward_id = w.id
      LEFT JOIN tbl_block_ulb_mstr b ON cd.block_id = b.id
      ${where}
      ORDER BY cd.camp_date DESC, cd.id DESC
      `,
      params,
    )
    

    const countRows: any[] = await executeQuery(`SELECT COUNT(*) AS count FROM camp_details cd ${where}`, params)
    const count = Array.isArray(countRows) && countRows[0]?.count ? Number(countRows[0].count) : 0

    return NextResponse.json({ success: true, data: { count, rows } })
  } catch (error) {
    console.error("[camps/search] error:", error)
    return NextResponse.json({ success: false, error: "Failed to search camps" }, { status: 500 })
  }
}
