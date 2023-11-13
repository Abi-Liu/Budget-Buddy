import { Request, Response } from "express";
import { handleTransactionsWebhook } from "../webhooks/transactionsHandler";
import { unhandledWebhook } from "../webhooks/unhandled";

export default {
  handleWebhook: async (req: Request, res: Response) => {
    const { webhook_type: webhookType } = req.body;

    if (webhookType === "TRANSACTIONS") {
      handleTransactionsWebhook(req);
    } else {
      unhandledWebhook(req);
    }
    res.json({ status: "ok" });
  },
};
