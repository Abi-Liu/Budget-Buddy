import { connection } from "../index";
import { getItemsByItemId } from "./items";
import { AccountBase } from "plaid";

export async function createOrUpdateAccounts(
  plaidItemId: string,
  accounts: AccountBase[]
) {
  const { id } = await getItemsByItemId(plaidItemId);
  const queries = accounts.map(async (account) => {
    // destructuring the variables out of the account object
    const {
      account_id: aid,
      name,
      mask,
      official_name: officialName,
      balances: {
        available: availableBalance,
        current: currentBalance,
        iso_currency_code: isoCurrencyCode,
        unofficial_currency_code: unofficialCurrencyCode,
      },
      subtype,
      type,
    } = account;

    // if the account does not exist, we create a new row for that account id.
    // if it is already inside the database, we only need to update the current and available balance rows
    const query = `INSERT INTO Account (
            item_id
            account_id,
            name,
            mask,
            official_name,
            current_balance,
            available_balance,
            iso_currency_code,
            unofficial_currency_code,
            type,
            subtype
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            current_balance = VALUES(current_balance),
            available_balance = VALUES(available_balance);`;
    const values = [
      id,
      aid,
      name,
      mask,
      officialName,
      currentBalance,
      availableBalance,
      isoCurrencyCode,
      unofficialCurrencyCode,
      type,
      subtype,
    ];
    const [rows] = connection.query(query, values);
    return rows;
  });
  return await Promise.all(queries);
}

// Get account by account id
export async function getAccountByAccountId(id: string) {
  const query = `SELECT * FROM Account WHERE account_id = ?`;
  const values = [id];
  const [rows] = await connection.query(query, values);
  console.log(rows);
  return rows;
}
