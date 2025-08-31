import mysql from "mysql2/promise"
import type { ResultSetHeader } from "mysql2"

const dbConfig = {
  host: "150.241.245.34",
  port: 3306,
  user: "viuser",
  password: "Vyoma@2018",
  database: "db_wb_apasjp",
  ssl: {
    rejectUnauthorized: false,
  },
}

let pool: mysql.Pool | null = null

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }
  return pool
}

/**
 * Executes a parameterized SQL query and returns the result rows.
 * Usage: executeQuery("SELECT * FROM table WHERE id = ?", [id])
 */
export async function executeQuery<T = any>(
  query: string,
  params: any[] = [],
): Promise<T[]> {
  const p = getPool()
  const [rows] = await p.execute(query, params)
  return rows as T[]
}

/**
 * Executes a write operation (INSERT/UPDATE/DELETE) and returns ResultSetHeader.
 * Usage: executeWrite("INSERT INTO table (col) VALUES (?)", [value])
 */
export async function executeWrite(
  query: string,
  params: any[] = [],
): Promise<ResultSetHeader> {
  const p = getPool()
  const [result] = await p.execute<ResultSetHeader>(query, params)
  return result
}

export const db = { executeQuery, executeWrite }
export default executeQuery
