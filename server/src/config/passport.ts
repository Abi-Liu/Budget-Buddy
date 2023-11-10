/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { connection } from "../index";
import { User } from "src/interfaces/database";

// Passport configuration

const callbackURL = `${
  process.env.CALLBACKURL || "http://localhost:8000"
}/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL,
    },
    async function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      cb: any
    ) {
      try {
        const query = "SELECT * from Users WHERE google_id = ?;";
        const values = [profile.id];
        console.log("Executing select query...");
        let [user] = await connection.query(query, values);
        console.log("Select query result:", user);
        if (user.length === 0) {
          const insert =
            "INSERT INTO Users (google_id, first_name, last_name, avatar_url) VALUES (?, ?, ?, ?);";
          const values = [
            profile.id,
            profile.name.givenName,
            profile.name.familyName,
            profile.photos[0].value,
          ];
          console.log("Executing insert query...");
          [user] = await connection.query(insert, values);
          console.log("Insert query result:", user);
        }
        cb(null, user);
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.serializeUser((user: User, done) => {
  done(null, user);
});
passport.deserializeUser((user: User, done) => {
  done(null, user);
});

export default passport;
