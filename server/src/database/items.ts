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
  const [res] = await connection.query(query, values);
  return res;
}

// gets a single item by the plaid item id
export async function getItemsByItemId(itemId: string) {
  const query = "SELECT * FROM Plaid_Items WHERE item_id = ?;";
  const values = [itemId];
  const [res] = await connection.query(query, values);
  return res;
}
