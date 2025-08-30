import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    const query = `
      SELECT 
        id,
        name,
        phone,
        experience,
        language,
        created_at
      FROM user_experiences
      ORDER BY created_at DESC
    `

    const results = await executeQuery(query)
    return Response.json(results)
  } catch (error) {
    console.error("Error fetching user experiences:", error)
    return Response.json({ error: "Failed to fetch user experiences" }, { status: 500 })
  }
}
