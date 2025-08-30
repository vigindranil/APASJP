import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    // Get total user queries
    const totalQueriesResult = await executeQuery("SELECT COUNT(*) as count FROM user_data")
    const totalUserQueries = totalQueriesResult[0]?.count || 0

    // Get total experiences
    const totalExperiencesResult = await executeQuery("SELECT COUNT(*) as count FROM user_experiences")
    const totalExperiences = totalExperiencesResult[0]?.count || 0

    // Get today's queries
    const todayQueriesResult = await executeQuery(
      "SELECT COUNT(*) as count FROM user_data WHERE DATE(created_at) = CURDATE()",
    )
    const todayQueries = todayQueriesResult[0]?.count || 0

    // Get today's experiences
    const todayExperiencesResult = await executeQuery(
      "SELECT COUNT(*) as count FROM user_experiences WHERE DATE(created_at) = CURDATE()",
    )
    const todayExperiences = todayExperiencesResult[0]?.count || 0

    return Response.json({
      totalUserQueries,
      totalExperiences,
      todayQueries,
      todayExperiences,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return Response.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
