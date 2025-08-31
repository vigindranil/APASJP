import { type NextRequest, NextResponse } from "next/server"
import * as db from "@/lib/database"

type SurveyAnswers = {
  recorded_priorities?: "yes" | "no"
  overall_experience?: "excellent" | "good" | "average" | "poor"
  informed_projects?: "yes" | "no"
  booth_facility?: "excellent" | "good" | "average" | "poor"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name = "",
      phone = "",
      experience = "",
      language = "en",
      answers,
    } = body as {
      name?: string
      phone?: string
      experience?: string
      language?: string
      answers?: SurveyAnswers
    }

    if (!experience && !answers) {
      return NextResponse.json(
        { success: false, error: "Either 'experience' or 'answers' is required" },
        { status: 400 },
      )
    }

    const columns = ["name", "phone", "experience", "language"]
    const values: any[] = [name, phone, experience, language]
    const placeholders = ["?", "?", "?", "?"]

    if (answers?.recorded_priorities) {
      columns.push("q_recorded_priorities")
      values.push(answers.recorded_priorities)
      placeholders.push("?")
    }
    if (answers?.overall_experience) {
      columns.push("q_overall_experience")
      values.push(answers.overall_experience)
      placeholders.push("?")
    }
    if (answers?.informed_projects) {
      columns.push("q_informed_projects")
      values.push(answers.informed_projects)
      placeholders.push("?")
    }
    if (answers?.booth_facility) {
      columns.push("q_booth_facility")
      values.push(answers.booth_facility)
      placeholders.push("?")
    }

    const sql = `INSERT INTO user_experiences (${columns.join(", ")}, created_at) VALUES (${placeholders.join(
      ", ",
    )}, NOW())`

    const result = await db.executeWrite(sql, values)
    const experienceId = result.insertId

    const thankYou: Record<string, string> = {
      en: "Thank you for sharing your experience with us! Your feedback is valuable.",
      বাংলা: "আপনার অভিজ্ঞতা আমাদের সাথে শেয়ার করার জন্য ধন্যবাদ! আপনার প্রতিক্রিয়া মূল্যবান।",
      हिंदी: "हमारे साथ अपना अनुभव साझा करने के लिए धन्यवाद! आपका फीडबैक महत्वपूर्ण है।",
    }

    return NextResponse.json({
      success: true,
      message: thankYou[language] || thankYou.en,
      experienceId,
    })
  } catch (error) {
    console.error("Error saving experience:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
