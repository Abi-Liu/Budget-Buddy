import express, {Request, Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db'


dotenv.config()

const app = express()
app.use(
    cors({ origin: ['http://localhost:5173'], credentials: true })
  );
app.use(express.json())

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let connection: any;

async function connect(){
  connection = await connectDB()
}

connect()

app.get('/', async (req: Request, res: Response) => {
    const query = 'select * from Characters;'
    const data = await connection.execute(query)
    console.log(data)
    res.send(data)
})

app.listen(process.env.PORT || 8000, () => console.log(`Server has started on port: ${process.env.PORT}`))