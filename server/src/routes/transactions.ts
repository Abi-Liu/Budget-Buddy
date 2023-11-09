import express from "express";
import { connection } from "../index";
const router = express.Router();

router.get("/", async (req, res) => {
  const query = "select * from Characters;";
  const data = await connection.execute(query);
  console.log(data);
  res.send(data);
});

export default router;
