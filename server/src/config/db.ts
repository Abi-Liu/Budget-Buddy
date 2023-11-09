import mysql from "mysql2/promise";

// create the connection to database
export default async function connectDB() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  return connection;
}
