import { connection } from "../index";
import { TransactionsSyncResponse, Transaction } from "plaid";

export async function createOrUpdateTransactions(
  added: TransactionsSyncResponse["added"],
  modified: TransactionsSyncResponse["modified"]
) {
  const transactions = added.concat(modified);
  const queries = transactions.map(async (transaction) => {
    const {
      account_id: plaidAccountId,
      transaction_id: plaidTransactionId,
      personal_finance_category: personalFinanceCategory,
      payment_channel: paymentChannel,
      name: transactionName,
      amount,
      iso_currency_code: isoCurrencyCode,
      unofficial_currency_code: unofficialCurrencyCode,
      date: transactionDate,
      pending,
      account_owner: accountOwner,
    } = transaction as Transaction;
  });
}
