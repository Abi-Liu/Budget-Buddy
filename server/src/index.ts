import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";
import plaidRoutes from "./routes/plaid";
import cookieSession from "cookie-session";
import passport from "passport";
import transactionsRoutes from "./routes/transactions";

const app = express();
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.KEY || "secret"],
    // sets cookie age to 2 weeks
    maxAge: 14 * 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// create a database connection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let connection: any;
async function connect() {
  connection = await connectDB();
}
// creates connection to PlanetScale
connect();

app.use("/plaid", plaidRoutes);
app.use("/transactions", transactionsRoutes);

app.listen(process.env.PORT || 8000, () =>
  console.log(`Server has started on port: ${process.env.PORT}`)
);
