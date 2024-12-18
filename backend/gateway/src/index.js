const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const session = require("express-session");
const cors = require('cors');
require("dotenv").config();
const path = require("path");
const Router = require("./routes/gatewayRoutes.js");
const { initBudgets } = require("./utils/initBudgets.js");

const app = express();
const port = process.env.PORT;
const secret = process.env.SECRET;

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
            // Create budgets if new user
            if (data.newUser) {
                await initBudgets(data.token);
            }
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
        const { token, newUser } = req.user;
        res
            .cookie("access_token", token, {
                maxAge: 315360000 * 1000,
                httpOnly: true,
                signed: true,
                secure: true,
            })
        // if not newUser redirect to dashboard
        if (newUser) {
            res.redirect("/auth/plaidAccount");
        } else {
            res.redirect("/dashboard/home");
        }
    }
);

const staticPath = path.join(__dirname, 'static')
app.use('/', express.static(staticPath))

app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'))
})

app.listen(port, () => {
    console.log(`Gateway is running on http://localhost:${port}`);
});
