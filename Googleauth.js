
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || null;
        if (!email) return done(new Error("Google profile does not have an email."), null);

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({ displayName: profile.displayName, email });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.email));

passport.deserializeUser(async (email, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return done(new Error("User not found"), null);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
