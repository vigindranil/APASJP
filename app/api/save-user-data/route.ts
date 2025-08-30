import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

// Function to format date in dd:mm:yyyy format
function formatDate(dateString: string | Date): string {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}:${month}:${year}`
}

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

    const campResult = await executeQuery(
      `
      SELECT 
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
        b.name as block_name,
        b.name_bn as block_name_bn,
        b.name_np as block_name_np,
        w.name as ward_name,
        w.name_bn as ward_name_bn,
        w.name_np as ward_name_np,
        eb.name as booth_name,
        eb.name_bn as booth_name_bn,
        eb.name_np as booth_name_np
      FROM camp_details cd
      JOIN electoral_booths eb ON cd.electoral_booth_id = eb.id
      JOIN wards w ON cd.ward_id = w.id
      JOIN blocks b ON cd.block_id = b.id
      WHERE cd.electoral_booth_id = ?
    `,
      [userData.boothId],
    )

    if (!Array.isArray(campResult) || campResult.length === 0) {
      return NextResponse.json({ success: false, error: "No camp data found" }, { status: 404 })
    }

    const campData = campResult[0] as any

    const formattedCampDate = formatDate(campData.camp_date)

    let campMessage = `Camp Details:\nDate: ${formattedCampDate}\nVenue: ${campData.venue}\nHabitation: ${campData.habitation}\nAssembly Constituency: ${campData.ac}\nBlock: ${campData.block_name}\nWard/GP: ${campData.ward_name}\nElectoral Booth: ${campData.booth_name}`

    if (userData.language === "bn") {
      campMessage = `ক্যাম্পের বিবরণ:\nতারিখ: ${formattedCampDate}\nস্থান: ${campData.venue_bn || campData.venue}\nবসতি: ${campData.habitation_bn || campData.habitation}\nবিধানসভা কেন্দ্র: ${campData.ac_bn || campData.ac}\nব্লক: ${campData.block_name_bn || campData.block_name}\nওয়ার্ড/জিপি: ${campData.ward_name_bn || campData.ward_name}\nনির্বাচনী বুথ: ${campData.booth_name_bn || campData.booth_name}`
    } else if (userData.language === "np") {
      campMessage = `शिविर विवरण:\nमिति: ${formattedCampDate}\nस्थान: ${campData.venue_np || campData.venue}\nबसोबास: ${campData.habitation_np || campData.habitation}\nविधानसभा क्षेत्र: ${campData.ac_np || campData.ac}\nब्लक: ${campData.block_name_np || campData.block_name}\nवार्ड/जीपी: ${campData.ward_name_np || campData.ward_name}\nनिर्वाचन बूथ: ${campData.booth_name_np || campData.booth_name}`
    }

    const response = {
      success: true,
      message: "User data saved successfully",
      campInfo: {
        message: campMessage,
        details: {
          userId: userId,
          campDate: formattedCampDate,
          venue:
            userData.language === "bn"
              ? campData.venue_bn || campData.venue
              : userData.language === "np"
                ? campData.venue_np || campData.venue
                : campData.venue,
          habitation:
            userData.language === "bn"
              ? campData.habitation_bn || campData.habitation
              : userData.language === "np"
                ? campData.habitation_np || campData.habitation
                : campData.habitation,
          ac:
            userData.language === "bn"
              ? campData.ac_bn || campData.ac
              : userData.language === "np"
                ? campData.ac_np || campData.ac
                : campData.ac,
          blockName:
            userData.language === "bn"
              ? campData.block_name_bn || campData.block_name
              : userData.language === "np"
                ? campData.block_name_np || campData.block_name
                : campData.block_name,
          wardName:
            userData.language === "bn"
              ? campData.ward_name_bn || campData.ward_name
              : userData.language === "np"
                ? campData.ward_name_np || campData.ward_name
                : campData.ward_name,
          boothName:
            userData.language === "bn"
              ? campData.booth_name_bn || campData.booth_name
              : userData.language === "np"
                ? campData.booth_name_np || campData.booth_name
                : campData.booth_name,
        },
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error saving user data:", error)
    return NextResponse.json({ success: false, error: "Failed to save user data" }, { status: 500 })
  }
}
