import connection from "../index";

export async function getUser(id) {
  const query = "SELECT * from Users WHERE google_id = ?;";
  const values = [id];
  const [user] = await connection.query(query, values);
  return user;
}

export async function createUser(id, givenName, familyName, photos) {
  const insert =
    "INSERT INTO Users (google_id, first_name, last_name, avatar_url) VALUES (?, ?, ?, ?);";
  const values = [id, givenName, familyName, photos];
  console.log("Executing insert query...");
  const [user] = await connection.query(insert, values);
  console.log("Insert query result:", user);
  return user;
}
