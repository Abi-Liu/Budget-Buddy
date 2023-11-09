import express from "express";
import plaidController from "../controllers/plaid";

const router = express.Router();

router.post("/createLinkToken", plaidController.createLinkToken);

export default router;
