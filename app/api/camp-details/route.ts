import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// Function to format date in dd:mm:yyyy format
function formatDate(dateString: string | Date): string {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}:${month}:${year}`
}

interface CampRequest {
  wardId: number
  boothId: number
  language: string // "English" | "বাংলা" | "हिंदी"
}

export async function POST(request: Request) {
  try {
    const body: CampRequest = await request.json()
    const { wardId, boothId, language } = body || {}

    if (!wardId || !boothId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const campResult = await executeQuery(
      `
      SELECT
        cd.cs_camp_date AS camp_date,
        cd.cs_venue AS venue,
        cd.cs_venue_bn AS venue_bn,
        cd.cs_venue_hi AS venue_np,
        cd.cs_habitation_name AS habitation,
        cd.cs_habitation_name_bn AS habitation_bn,
        cd.cs_habitation_name_hi AS habitation_np,
        cd.cs_assembly_name AS ac,
        cd.cs_assembly_name_bn AS ac_bn,
        cd.cs_assembly_name_hi AS ac_np,
        cd.cs_block_ulb_name as block_name,
        cd.cs_block_ulb_name_bn as block_name_bn,
        cd.cs_block_ulb_name_hi as block_name_hi,
        cd.cs_gp_ward_name as ward_name,
        cd.cs_gp_ward_name_bn as ward_name_bn,
        cd.cs_gp_ward_name_hi as ward_name_hi,
        eb.ebm_booth_name_en as booth_name,
        eb.ebm_booth_name_bn as booth_name_bn,
        eb.ebm_booth_name_hi as booth_name_hi
      FROM (
        SELECT DISTINCT value, cs_id
        FROM (
          SELECT cs_id, cs_booth_1 AS value FROM tbl_camp_schedule
          UNION ALL
          SELECT cs_id, cs_booth_2 FROM tbl_camp_schedule
          UNION ALL
          SELECT cs_id, cs_booth_3 FROM tbl_camp_schedule
        ) AS combined
        WHERE value IS NOT NULL
      ) T
      INNER JOIN tbl_camp_schedule cd ON cd.cs_id = T.cs_id
      INNER JOIN tbl_electoral_booth_mstr eb 
        ON eb.ebm_booth_code = T.value 
        AND eb.ebm_gp_ward_id = cd.cs_gp_ward_id
      WHERE cd.cs_gp_ward_id = ? AND eb.ebm_id = ?
      `,
      [wardId, boothId],
    )

    if (!Array.isArray(campResult) || campResult.length === 0) {
      return NextResponse.json({ success: false, error: "No camp data found" }, { status: 404 })
    }

    const campData = campResult[0] as any
    const formattedCampDate = formatDate(campData.camp_date)
    let campMessage = `Camp Details:\nDate: ${formattedCampDate}\nVenue: ${campData.venue}\nHabitation: ${campData.habitation}\nAssembly Constituency: ${campData.ac}\nBlock: ${campData.block_name}\nWard/GP: ${campData.ward_name}\nElectoral Booth: ${campData.booth_name}\n\n**Kindly attend the camp on the scheduled date.**`

    if (language === "বাংলা") {
      campMessage = `ক্যাম্পের বিবরণ:\nতারিখ: ${formattedCampDate}\nস্থান: ${campData.venue_bn || campData.venue}\nবসতি: ${campData.habitation_bn || campData.habitation}\nবিধানসভা কেন্দ্র: ${campData.ac_bn || campData.ac}\nব্লক: ${campData.block_name_bn || campData.block_name}\nওয়ার্ড/জিপি: ${campData.ward_name_bn || campData.ward_name}\nনির্বাচনী বুথ: ${campData.booth_name_bn || campData.booth_name}\n\n**অনুগ্রহ করে নির্ধারিত তারিখে ক্যাম্পে উপস্থিত থাকুন।**`
    } else if (language === "हिंदी") {
      campMessage = `शिविर विवरण:\nमिति: ${formattedCampDate}\nस्थान: ${campData.venue_np || campData.venue}\nबसोबास: ${campData.habitation_np || campData.habitation}\nविधानसभा क्षेत्र: ${campData.ac_np || campData.ac}\nब्लक: ${campData.block_name_np || campData.block_name}\nवार्ड/जीपी: ${campData.ward_name_np || campData.ward_name}\nनिर्वाचन बूथ: ${campData.booth_name_np || campData.booth_name}\n\n**कृपया निर्धारित तिथि पर शिविर में उपस्थित हों।**`
    }
    
    

    return NextResponse.json({
      success: true,
      campInfo: {
        message: campMessage,
        details: {
          campDate: formattedCampDate,
          venue:
            language === "বাংলা"
              ? campData.venue_bn || campData.venue
              : language === "हिंदी"
                ? campData.venue_np || campData.venue
                : campData.venue,
          habitation:
            language === "বাংলা"
              ? campData.habitation_bn || campData.habitation
              : language === "हिंदी"
                ? campData.habitation_np || campData.habitation
                : campData.habitation,
          ac:
            language === "বাংলা"
              ? campData.ac_bn || campData.ac
              : language === "हिंदी"
                ? campData.ac_np || campData.ac
                : campData.ac,
          blockName:
            language === "বাংলা"
              ? campData.block_name_bn || campData.block_name
              : language === "हिंदी"
                ? campData.block_name_np || campData.block_name
                : campData.block_name,
          wardName:
            language === "বাংলা"
              ? campData.ward_name_bn || campData.ward_name
              : language === "हिंदी"
                ? campData.ward_name_np || campData.ward_name
                : campData.ward_name,
          boothName:
            language === "বাংলা"
              ? campData.booth_name_bn || campData.booth_name
              : language === "हिंदी"
                ? campData.booth_name_np || campData.booth_name
                : campData.booth_name,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching camp details:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch camp details" }, { status: 500 })
  }
}
