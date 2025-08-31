import mysql from "mysql2/promise"

// const dbConfig = {
//   host: "public-primary-mysql-inmumbaizone2-189276-1646600.db.onutho.com",
//   port: 3306,
//   user: "dbadmin",
//   password: "g@E3J@6g57@fEbX@",
//   database: "db_apas",
//   ssl: {
//     rejectUnauthorized: false,
//   },
// }

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

let connection: mysql.Connection | null = null

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig)
  }
  return connection
}

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const conn = await getConnection()
    const [rows] = await conn.execute(query, params)
    return rows
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export const sql = executeQuery
