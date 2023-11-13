import express from "express";
import webhookController from "../controllers/webhook";

const router = express.Router();

router.post("/", webhookController.handleWebhook);

export default router;
