import { createOrUpdateAccounts } from "src/database/accounts";
import { plaidClient } from "../config/plaid";
import {
  getItemsByItemId,
  updateItemTransactionCursor,
} from "../database/items";
import { TransactionsSyncResponse } from "plaid";
import {
  createOrUpdateTransactions,
  deleteTransactions,
} from "../database/transactions";

export async function fetchTransactionUpdates(plaidItemId: string) {
  // get the access token and cursor based on the plaid item id
  const {
    plaid_access_token: accessToken,
    last_transactions_update_cursor: lastCursor,
  } = await getItemsByItemId(plaidItemId);

  let cursor: typeof lastCursor = lastCursor;

  // added/modified/removed transactions since last cursor
  let added: TransactionsSyncResponse["added"] = [];
  let modified: TransactionsSyncResponse["modified"] = [];
  let removed: TransactionsSyncResponse["removed"] = [];
  let hasMore: boolean = true;

  try {
    // goes through each page of new transactions, the default limit for each page is 100 transactions
    while (hasMore) {
      const request = {
        access_token: accessToken,
        cursor,
      };
      const response = await plaidClient.transactionsSync(request);
      const data = response.data;

      // for each field in data, we add it to the existing arrays we created above
      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);
      hasMore = data.has_more;

      // update the cursor
      cursor = data.next_cursor;
    }
  } catch (error) {
    console.error(`Error fetching transactions: ${error.message}`);
    // because we didn't successfully fetch the updates, we need to reset the cursor back to the lastCursor in the DB
    cursor = lastCursor;
  }

  return { added, modified, removed, cursor, accessToken };
}

export async function updateTransactions(plaidItemId: string) {
  // fetch new transactions from plaid
  const { added, modified, removed, cursor, accessToken } =
    await fetchTransactionUpdates(plaidItemId);

  const request = { access_token: accessToken };

  // gets the accounts linked to an item
  const { data } = await plaidClient.accountsGet(request);
  const accounts = data.accounts;

  // update the DB
  // updates or creates all accounts linked to the item
  await createOrUpdateAccounts(plaidItemId, accounts);
  await createOrUpdateTransactions(added, modified);
  await deleteTransactions(removed);
  await updateItemTransactionCursor(plaidItemId, cursor);

  return {
    addedCount: added.length,
    modifiedCount: modified.length,
    removedCount: removed.length,
  };
}
