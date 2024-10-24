To implement Google authentication in your Express project using TypeScript, you'll typically use the `passport.js` library with the `passport-google-oauth20` strategy. Here's a basic setup:

### 1. Install the required packages:

```bash
npm install express passport passport-google-oauth20 dotenv @types/passport @types/express
```

### 2. Create a `.env` file for your Google OAuth credentials:

```plaintext
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

### 3. Create `auth.ts` for authentication logic:

```ts
import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create the Express app
const app = express();

// Passport configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    (accessToken, refreshToken, profile, done) => {
      // Here you can handle the user profile, like saving it to your database
      return done(null, profile);
    }
  )
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

// Google auth routes
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/dashboard');
  }
);

// Route for logging out
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
```

### 4. Add session support (optional):

If you plan to persist user sessions, you'll also need `express-session`.

```bash
npm install express-session @types/express-session
```

Then add this to your `auth.ts`:

```ts
import session from 'express-session';

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure: true if using HTTPS
  })
);
```

### 5. Run your application:

```bash
tsc && node dist/auth.js
```

With this setup, you should be able to authenticate users via Google OAuth.

---

Let’s break down the `auth.ts` file, line by line, to understand what each part is doing:

### 1. Import required modules:
```ts
import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
```
- `express`: This imports the Express framework, which is used to create a web server.
- `passport`: This is the core library of Passport.js, a middleware for handling authentication.
- `GoogleStrategy`: This is the Google OAuth 2.0 authentication strategy provided by the `passport-google-oauth20` package.
- `dotenv`: This is used to load environment variables from a `.env` file. It allows you to keep sensitive information like Google client IDs and secrets outside of your codebase.

---

### 2. Load environment variables:
```ts
dotenv.config();
```
- This line tells the app to load the environment variables from a `.env` file into `process.env`. This makes variables like `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` available to the application.

---

### 3. Create an Express app:
```ts
const app = express();
```
- This creates an Express application, which will be used to define routes and handle requests.

---

### 4. Passport configuration:
```ts
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    (accessToken, refreshToken, profile, done) => {
      // Here you can handle the user profile, like saving it to your database
      return done(null, profile);
    }
  )
);
```
- `passport.use()`: This line initializes a new authentication strategy for Passport.js.
- `GoogleStrategy`: This is the OAuth 2.0 strategy for Google.
  - `clientID`, `clientSecret`: These come from your Google Developer Console and are necessary to authenticate users via Google.
  - `callbackURL`: This is the URL where Google will redirect users after they have authenticated.
- Inside the callback function (`(accessToken, refreshToken, profile, done)`):
  - `accessToken`: The token used to access the Google APIs on behalf of the user.
  - `refreshToken`: A token that can be used to obtain a new access token when the old one expires.
  - `profile`: The user's Google profile. This object contains information such as their email and Google ID.
  - `done`: This is a function that signals the completion of the authentication process. `null` is the error (no error here), and `profile` is passed to represent the user.

---

### 5. Serialize and deserialize user information:
```ts
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
```
- These functions are needed when you are using sessions in your application.
  - `serializeUser`: This function is called when a user is authenticated. It determines what user data should be stored in the session (in this case, the entire `user` object).
  - `deserializeUser`: This function is called on subsequent requests to retrieve the user object from the session.

---

### 6. Initialize Passport middleware:
```ts
app.use(passport.initialize());
app.use(passport.session());
```
- `passport.initialize()`: This initializes Passport.js middleware.
- `passport.session()`: This enables session support for persistent login sessions.

---

### 7. Define the Google OAuth routes:

#### Route to start the authentication process:
```ts
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
```
- When a user hits the `/auth/google` route, it triggers the Google authentication process.
- `scope`: The scope defines what information you are requesting from the user. Here, we're asking for their profile information (name, picture) and email.

#### Route to handle the OAuth callback:
```ts
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);
```
- After the user successfully authenticates, Google will redirect them back to this `/auth/google/callback` route.
- `passport.authenticate('google', { failureRedirect: '/' })`: This middleware processes the callback from Google. If authentication fails, the user is redirected to the home page (`/`).
- `res.redirect('/dashboard')`: If authentication is successful, the user is redirected to the `/dashboard` route.

---

### 8. Route to log out a user:
```ts
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});
```
- This route allows users to log out. `req.logout()` is a Passport.js method that terminates the session.
- `res.redirect('/')`: After logging out, the user is redirected to the home page.

---

### 9. Start the server:
```ts
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```
- `process.env.PORT || 3000`: This sets the port number. It checks if there's a port specified in the environment variables; otherwise, it defaults to `3000`.
- `app.listen()`: This starts the Express server on the specified port and logs a message indicating that the server is running.

---

### 10. Export the app (optional):
```ts
export default app;
```
- This exports the `app` instance so it can be imported and used in other files.

---

This code sets up Google authentication using Passport.js, allowing users to log in with their Google accounts. The routes handle the login process, callback, and logout functionality.

---

When a user chooses to log in with their Google account (Gmail) using the authentication flow set up with Passport.js and Google OAuth 2.0, several key steps take place. Here's a breakdown of the entire process, from when they select Gmail to when they're authenticated and redirected:

### 1. **User clicks "Log in with Google"**
   - The user clicks on a button or link in the web application that triggers a request to the `/auth/google` route.

### 2. **Request sent to `/auth/google` route**
   - The browser sends a GET request to `/auth/google`. This is defined in your `auth.ts` file:

   ```ts
   app.get(
     '/auth/google',
     passport.authenticate('google', { scope: ['profile', 'email'] })
   );
   ```

   - **What happens here:**
     - The `passport.authenticate('google')` middleware is invoked. 
     - Passport.js starts the Google OAuth process and redirects the user to the Google login page (https://accounts.google.com/).
     - `scope: ['profile', 'email']`: The app requests access to the user’s profile information (name, picture, etc.) and their email address.

### 3. **User is redirected to Google’s login page**
   - The user is now on Google's login page and sees a list of Gmail accounts (if they are logged into multiple Google accounts) or is prompted to log in with their Google account.

### 4. **User selects a Google account (Gmail)**
   - The user selects their Gmail account or logs in with their credentials. This allows Google to verify the user.

### 5. **Google asks for permissions (optional)**
   - If it's the first time the user is logging in with your app, Google may prompt them to approve the permissions requested (access to profile information and email).
   - The user grants permission for your app to access their profile and email.

### 6. **Google redirects back to your app's callback URL**
   - After the user selects their Gmail account and grants permissions, Google sends them back to your app. Specifically, Google redirects the user to the **callback URL** you defined:

   ```ts
   callbackURL: process.env.GOOGLE_CALLBACK_URL!
   ```
   - This URL is set in your `.env` file (e.g., `http://localhost:3000/auth/google/callback`).
   - Google also includes an **authorization code** in the query parameters when redirecting the user to your app. This code will be used to exchange for an access token.

### 7. **The `/auth/google/callback` route is triggered**
   - When the user lands on this route, the request hits your `/auth/google/callback` route:

   ```ts
   app.get(
     '/auth/google/callback',
     passport.authenticate('google', { failureRedirect: '/' }),
     (req, res) => {
       res.redirect('/dashboard');
     }
   );
   ```

   - **What happens here:**
     - `passport.authenticate('google')`: This middleware processes the response from Google.
     - Behind the scenes, Passport.js takes the **authorization code** from the query parameters and exchanges it with Google for:
       - An **access token**: This allows your app to make authenticated requests to Google's APIs on behalf of the user.
       - A **refresh token**: If your app needs to maintain access for an extended period, it can use this to get a new access token without the user needing to log in again.
       - The **user's profile information**: Google sends the profile data (like name, email, profile picture, etc.) back to your app.
     - If the user authentication succeeds, Passport’s `done(null, profile)` callback is called, which moves the request to the next middleware.
     - If authentication fails (e.g., user denied permissions), the user is redirected to `/`.

### 8. **Handling the user profile in the Passport callback**
   - Once the authentication is successful, the callback you defined in `GoogleStrategy` is triggered:

   ```ts
   new GoogleStrategy(
     {
       clientID: process.env.GOOGLE_CLIENT_ID!,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
       callbackURL: process.env.GOOGLE_CALLBACK_URL!,
     },
     (accessToken, refreshToken, profile, done) => {
       return done(null, profile);
     }
   )
   ```

   - **What happens here:**
     - `accessToken`: The token used to access Google APIs.
     - `refreshToken`: Token used to refresh the access token when it expires (if your app needs it).
     - `profile`: The user’s Google profile, which includes:
       - `id`: User’s unique Google ID.
       - `displayName`: User’s full name.
       - `emails`: Array of email objects (typically, the user’s Gmail).
       - `photos`: Array of profile picture URLs.
     - This is where you could save the user's profile information to your database if needed.
     - `done(null, profile)`: This tells Passport to complete the process and pass the user profile forward.

### 9. **Passport serializes the user into the session**
   - Once the `done` callback is executed, Passport calls the `serializeUser` method:

   ```ts
   passport.serializeUser((user, done) => {
     done(null, user);
   });
   ```

   - **What happens here:**
     - The user’s profile is saved into the session, enabling persistent login across requests.
     - You can customize what data gets saved (e.g., just saving the user ID, not the full profile).

### 10. **User is redirected to the dashboard**
   - If the authentication was successful, the final middleware in the `/auth/google/callback` route executes:

   ```ts
   res.redirect('/dashboard');
   ```

   - **What happens here:**
     - The user is redirected to the `/dashboard` route, which could be a protected route in your app.
     - At this point, the user is authenticated, and their session contains their profile information (or the part of it you chose to serialize).

### 11. **Subsequent requests use the session (optional)**
   - If you’re using sessions, Passport will look up the user from the session in every subsequent request by calling `deserializeUser`:

   ```ts
   passport.deserializeUser((obj, done) => {
     done(null, obj);
   });
   ```

   - **What happens here:**
     - The serialized user (e.g., user profile or user ID) is retrieved from the session and added to `req.user`.
     - You can access `req.user` in other routes to know which user is making the request.

### Recap of the flow:

1. User clicks "Login with Google" -> Redirect to Google login.
2. User logs into Google and grants permissions.
3. Google redirects to your app's callback URL with an authorization code.
4. Your app exchanges the code for an access token, refresh token, and profile info.
5. User is authenticated, and their profile is serialized into the session.
6. User is redirected to the dashboard or another protected route.

This entire flow allows the user to authenticate with their Gmail account securely using OAuth 2.0 and Google as the identity provider.

---

Since you won’t be storing passwords for Google-authenticated users, you can validate them in the same way you would for any other user by using JSON Web Tokens (JWT). However, the process of issuing and verifying the JWT will differ slightly for Google-authenticated users. Here's a strategy you can follow:

### 1. **Issue a JWT upon successful Google authentication:**
When a user successfully authenticates with Google (in the callback function), you can issue a JWT for them. You will still store the user's email and Google ID (from the Google profile), but you won’t need a password for these users.

In the Google authentication callback:

```ts
import jwt from 'jsonwebtoken';

// Inside the callback function for Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists in your database by Google ID or email
        const user = await findUserByGoogleIdOrEmail(profile.id, profile.emails[0].value);
        
        if (!user) {
          // If the user does not exist, create a new user record with Google ID
          const newUser = await createUserWithGoogle(profile.id, profile.displayName, profile.emails[0].value);
        }

        // Issue a JWT for the user
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET!,
          { expiresIn: '1h' }
        );

        // Pass the token in response or cookie
        return done(null, { token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
```

### 2. **Store minimal user data:**
You should store the following information for Google-authenticated users:
- Google ID (from `profile.id`): This is unique to each user and can be used to identify them.
- Email: You still store the email for identifying the user.
- (Optional) Display name or profile picture from Google’s `profile` object.

### 3. **No password storage for Google users:**
For Google-authenticated users, you do not store a password hash. Instead, you rely solely on their Google ID for user identification and JWT for session validation.

### 4. **Validating Google-authenticated users using JWT:**
Once the JWT is issued, you can use it to authenticate users over your protected routes in the same way you authenticate users who log in with email/password.

You would validate JWTs in your middleware for routes that require authentication:

```ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// JWT verification middleware
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = verified; // Attach the decoded token data to req.user
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export default verifyToken;
```

### 5. **Use JWT on protected routes:**
For routes that require authentication, use the JWT middleware to ensure only authenticated users can access them:

```ts
app.get('/protected-route', verifyToken, (req, res) => {
  // At this point, req.user contains the decoded JWT payload (e.g., user ID and email)
  res.json({ message: 'You are authenticated!', user: req.user });
});
```

### How it works:
- After a user successfully logs in via Google, your app generates a JWT and sends it back to the client (either in a response header, body, or as a cookie).
- For subsequent requests, the client sends the JWT in the `Authorization` header as a Bearer token.
- Your middleware (`verifyToken`) checks the token, verifies its validity, and extracts the user’s data (like user ID and email) to validate the request.

### Summary:
- **JWT is issued for Google-authenticated users**: You’ll issue a JWT in the Google auth callback based on the user’s Google ID and email.
- **No password stored for Google users**: You only need the Google ID and email to identify users.
- **JWT validation**: Use JWT in headers to validate users on protected routes, regardless of whether they logged in via Google or email/password.

This way, the validation process remains consistent for both Google-authenticated and regular users, as both types of users rely on JWT to access protected routes.