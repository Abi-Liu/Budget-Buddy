import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import plaidRoutes from "./routes/plaid";

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

app.use("/plaid", plaidRoutes);

console.log(process.env.PLAID_CLIENT_ID, process.env.PLAID_SECRET);

app.listen(process.env.PORT || 8000, () =>
  console.log(`Server has started on port: ${process.env.PORT}`)
);
