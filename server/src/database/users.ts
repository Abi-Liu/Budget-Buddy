import { connection } from "../index";

// mysql db queries specific for user functionality.

export async function getUser(id: number) {
  const query = "SELECT * from Users WHERE google_id = ?;";
  const values = [id];
  const [user] = await connection.query(query, values);
  return user;
}

export async function createUser(
  id: number,
  givenName: string,
  familyName: string,
  photos: string
) {
  const insert =
    "INSERT INTO Users (google_id, first_name, last_name, avatar_url) VALUES (?, ?, ?, ?);";
  const values = [id, givenName, familyName, photos];
  const [user] = await connection.query(insert, values);
  return user;
}
