/* eslint-disable no-case-declarations */
import { Request } from "express";
import { updateTransactions } from "src/utils/updateTransactions";

export async function handleTransactionsWebhook(req: Request) {
  const { body } = req;
  const { webhook_code: webhookCode, item_id: itemId } = body;

  switch (webhookCode) {
    case "SYNC_UPDATES_AVAILABLE":
      const { addedCount, removedCount, modifiedCount } =
        await updateTransactions(itemId);

      console.log(
        `Transactions: ${addedCount} added, ${modifiedCount} modified, ${removedCount} removed`,
        itemId
      );
      break;
    case "RECURRING_TRANSACTIONS_UPDATE":
    default:
      console.log("unhandled webhooks");
  }
}
