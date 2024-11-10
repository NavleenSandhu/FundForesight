const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const session = require("express-session");
const cors = require('cors');
require("dotenv").config();

const Router = require("./routes/gatewayRoutes.js");

const app = express();
const port = process.env.PORT;
const secret = process.env.SECRET;


//Remove in prod
app.use(cors({ origin: [process.env.FRONTEND_URL], credentials: true }))
//Remove in prod


app.use(express.json());
app.use(cookieParser(secret));

// Passport configuration
passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Here you can handle the user profile, like saving it to your database
      const res = await fetch(`${process.env.AUTH_URL}/googleAuth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.emails[0].value,
          username: profile.displayName,
          google_id: profile.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        return done(null, data);
      }
      return done(null, null);
    }
  )
);

app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure: true if using HTTPS
  })
);

// Serialize and deserialize user information into session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Middleware for Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/gateway/v1/api", Router);
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = req.user.token;
    res
      .cookie("access_token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        signed: true,
      })
      .json({ message: "User logged in successfully" });
  }
);

app.listen(port, () => {
  console.log(`Gateway is running on http://localhost:${port}`);
});
