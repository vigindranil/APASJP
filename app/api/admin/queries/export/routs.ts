import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import * as XLSX from "xlsx"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blockName = searchParams.get("blockName") || "all"
    const wardName = searchParams.get("wardName") || "all"
    const dateFrom = searchParams.get("dateFrom") || ""
    const dateTo = searchParams.get("dateTo") || ""
    const language = searchParams.get("language") || "all"
    const search = searchParams.get("search") || ""

    // Build the SQL query with filters
    let query = `
      SELECT 
        ud.id,
        ud.name,
        ud.phone,
        b.name as block_name,
        w.name as ward_name,
        eb.name as booth_name,
        ud.language,
        ud.created_at,
        cd.camp_date,
        cd.venue,
        cd.habitation,
        cd.ac
      FROM user_data ud
      LEFT JOIN blocks b ON ud.block_id = b.id
      LEFT JOIN wards w ON ud.ward_id = w.id
      LEFT JOIN electoral_booths eb ON ud.booth_id = eb.id
      LEFT JOIN camp_details cd ON cd.electoral_booth_id = eb.id
      WHERE 1=1
    `

    const params: any[] = []

    // Apply filters
    if (blockName !== "all") {
      query += " AND b.name = ?"
      params.push(blockName)
    }

    if (wardName !== "all") {
      query += " AND w.name = ?"
      params.push(wardName)
    }

    if (language !== "all") {
      query += " AND ud.language = ?"
      params.push(language)
    }

    if (dateFrom) {
      query += " AND DATE(ud.created_at) >= ?"
      params.push(dateFrom)
    }

    if (dateTo) {
      query += " AND DATE(ud.created_at) <= ?"
      params.push(dateTo)
    }

    if (search) {
      query += " AND (ud.name LIKE ? OR ud.phone LIKE ? OR b.name LIKE ? OR w.name LIKE ?)"
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm, searchTerm)
    }

    query += " ORDER BY ud.created_at DESC"

    const results = await executeQuery(query, params)

    if (!results || results.length === 0) {
      return NextResponse.json({ error: "No data found matching the criteria" }, { status: 404 })
    }

    // Transform data for Excel
    const excelData = results.map((row: any, index: number) => ({
      "Serial No.": index + 1,
      "Query ID": row.id,
      Name: row.name || "Not provided",
      Phone: row.phone || "Not provided",
      "Block/Municipality": row.block_name,
      "GP/Ward": row.ward_name,
      "Electoral Booth": row.booth_name,
      Language:
        row.language === "en"
          ? "English"
          : row.language === "bn"
            ? "Bengali"
            : row.language === "np"
              ? "Nepali"
              : row.language,
      "Query Date": new Date(row.created_at).toLocaleDateString(),
      "Camp Date": row.camp_date ? new Date(row.camp_date).toLocaleDateString() : "N/A",
      Venue: row.venue || "N/A",
      Habitation: row.habitation || "N/A",
      "Assembly Constituency": row.ac || "N/A",
    }))

    // Create Excel workbook
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Auto-size columns
    const colWidths = Object.keys(excelData[0] || {}).map((key) => ({
      wch: Math.max(key.length, 15),
    }))
    worksheet["!cols"] = colWidths

    XLSX.utils.book_append_sheet(workbook, worksheet, "User Queries")

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    // Return Excel file
    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="user-queries-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error("Error exporting queries:", error)
    return NextResponse.json(
      {
        error: "Failed to export data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
