import express, {Request, Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

// create the connection to database
const connection = mysql.createConnection(process.env.DATABASE_URL!)


dotenv.config()

const app = express()
app.use(
    cors({ origin: ['http://localhost:5173'], credentials: true })
  );
app.use(express.json())

app.get('/', async (req: Request, res: Response) => {
    const query = 'select * from Characters;'
    const data = await connection.query(query)
    console.log(data)
    res.send('hello')
})

app.listen(process.env.PORT || 8000, () => console.log(`Server has started on port: ${process.env.PORT}`))