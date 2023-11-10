/* eslint-disable @typescript-eslint/no-explicit-any */
import strategy from "passport-google-oauth20";
import passport from "passport";
import { connection } from "../index";
import { User } from "src/interfaces/database";

const GoogleStrategy = strategy.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      callbackURL: process.env.CALLBACKURL || "http://localhost:5173/",
    },
    async function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      cb: any
    ) {
      try {
        const query = "SELECT * from Users WHERE google_id = $1;";
        const values = [profile.id];
        let [user] = await connection.query(query, values);
        if (user.length === 0) {
          const insert =
            "INSERT INTO Users (google_id, first_name, last_name, avatar_url) VALUES (?, ?, ?, ?);";
          const values = [
            profile.id,
            profile.name.givenName,
            profile.name.familyName,
            profile.photos[0].value,
          ];
          [user] = await connection.query(insert, values);
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
