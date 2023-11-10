import { connection } from "../index";

// mysql db queries specific for plaid_item functionality.

export async function createItem(userId, accessToken, itemId, institutionId) {
  const query =
    "INSERT INTO Plaid_Items (user_id, access_token, item_id, institution_id) VALUES (?, ?, ?, ?)";
  const values = [userId, accessToken, itemId, institutionId];
  const [res] = await connection.query(query, values);
  return res;
}
