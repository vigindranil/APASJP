import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    const query = `
      SELECT 
        ud.id,
        ud.name,
        ud.phone,
        ud.language,
        ud.created_at,
        b.name as block_name,
        w.name as ward_name,
        eb.name as booth_name,
        cd.camp_date,
        cd.venue,
        cd.habitation,
        cd.ac
      FROM user_data ud
      LEFT JOIN tbl_block_ulb_mstr b ON ud.block_id = b.id
      LEFT JOIN tbl_gp_ward_mstr w ON ud.ward_id = w.id
      LEFT JOIN tbl_electoral_booth_mstr eb ON ud.booth_id = eb.id
      LEFT JOIN tbl_camp_schedule cd ON cd.electoral_booth_id = eb.id
      ORDER BY ud.created_at DESC
    `

    const results = await executeQuery(query)
    return Response.json(results)
  } catch (error) {
    console.error("Error fetching user queries:", error)
    return Response.json({ error: "Failed to fetch user queries" }, { status: 500 })
  }
}
