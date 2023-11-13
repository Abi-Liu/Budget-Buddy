import { connection } from "../index";
import { TransactionsSyncResponse, Transaction } from "plaid";
import { getAccountByAccountId } from "./accounts";

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
      // online, credit etc
      payment_channel: paymentChannel,
      name: transactionName,
      amount,
      iso_currency_code: isoCurrencyCode,
      unofficial_currency_code: unofficialCurrencyCode,
      date: transactionDate,
      pending,
      account_owner: accountOwner,
    } = transaction as Transaction;

    const { id } = await getAccountByAccountId(plaidAccountId);

    try {
      const query = `
      INSERT INTO Transactions
        (
            account_id,
            plaid_transaction_id,
            personal_finance_category,
            payment_channel,
            name,
            amount,
            iso_currency_code,
            unofficial_currency_code,
            date,
            pending,
            account_owner
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        personal_finance_category = VALUES(personal_finance_category),
        payment_channel = VALUES(payment_channel),
        name = VALUES(name),
        amount = VALUES(amount),
        iso_currency_code = VALUES(iso_currency_code),
        unofficial_currency_code = VALUES(unofficial_currency_code),
        date = VALUES(date),
        pending = VALUES(pending),
        account_owner = VALUES(account_owner);`;
      const values = [
        id,
        plaidTransactionId,
        personalFinanceCategory,
        paymentChannel,
        transactionName,
        amount,
        isoCurrencyCode,
        unofficialCurrencyCode,
        transactionDate,
        pending,
        accountOwner,
      ];
      await connection.query(query, values);
    } catch (error) {
      console.error(error);
    }
  });
  return await Promise.all(queries);
}

export async function deleteTransactions(
  transactionIds: TransactionsSyncResponse["removed"]
) {
  const queries = transactionIds.map(async (transactionId) => {
    const query = `DELETE FROM Transactions WHERE plaid_transaction_id = ?`;
    const values = [transactionId];
    await connection.query(query, values);
  });
  await Promise.all(queries);
}
