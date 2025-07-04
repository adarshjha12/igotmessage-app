import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/userModel";

const clientID = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;
const callbackURL =
  process.env.NODE_ENV === "production"
    ? "https://igotmessage-app-backend.onrender.com/api/google/auth/callback/redirect"
    : "http://localhost:5000/api/google/auth/callback/redirect";

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find user by googleId
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        const email = profile.emails?.[0].value;

        // Find user by email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          existingUser.googleId = profile.id;
          existingUser.avatar = profile.photos?.[0]?.value || "";
          existingUser.title = profile.displayName;
          await existingUser.save();
          return done(null, existingUser);
        }

        // Create new user
        const newUser = new User({
          googleId: profile.id,
          email: email || "",
          title: profile.displayName,
          avatar: profile.photos?.[0]?.value || "",
        });
        await newUser.save();

        return done(null, newUser);
      } catch (error) {
        console.error("Google auth failed", error);
        return done(error, undefined);
      }
    }
  )
);
