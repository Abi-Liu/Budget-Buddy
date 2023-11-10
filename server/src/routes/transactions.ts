import express from "express";
import { connection } from "../index";
const router = express.Router();

router.get("/", async (req, res) => {
  const query = "select * from Users;";
  const [rows] = await connection.execute(query);
  console.log(rows);
  res.send(rows);
});

export default router;
