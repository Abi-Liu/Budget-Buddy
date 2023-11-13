import { connection } from "../index";

// mysql db queries specific for plaid_item functionality.

// creates a new plaid item
export async function createItem(
  userId: number,
  accessToken: string,
  itemId: string,
  institutionId: string
) {
  const query =
    "INSERT INTO Plaid_Items (user_id, access_token, item_id, institution_id) VALUES (?, ?, ?, ?)";
  const values = [userId, accessToken, itemId, institutionId];
  const [rows] = await connection.query(query, values);
  return rows;
}

// gets a single item by the plaid item id
export async function getItemsByItemId(itemId: string) {
  const query = "SELECT * FROM Plaid_Items WHERE item_id = ?;";
  const values = [itemId];
  const [rows] = await connection.query(query, values);
  return rows;
}

export async function updateItemTransactionCursor(
  itemId: string,
  cursor: string | undefined
) {
  const query = `UPDATE Plaid_Items SET transactions_cursor = ? WHERE item_id = ? `;
  const values = [cursor, itemId];
  await connection.query(query, values);
}
