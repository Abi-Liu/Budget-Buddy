import mysql from 'mysql2/promise'

// create the connection to database
const connection = mysql.createConnection(process.env.DATABASE_URL!)

export default connection