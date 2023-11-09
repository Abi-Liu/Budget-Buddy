import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import transactionsRoutes from "./routes/transactions";

dotenv.config();

const app = express();
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());

// create a database connection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let connection: any;
async function connect() {
  connection = await connectDB();
}
connect();

app.use("/transactions", transactionsRoutes);

app.listen(process.env.PORT || 8000, () =>
  console.log(`Server has started on port: ${process.env.PORT}`)
);
