import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { addUser, addUserWithGoogle, getUserByEmail, updateUserGoogleId } from '../database/db';
import { Payload } from '../models/payload';
import { validateCredentials } from './credentialCheckService';

// Ensure JWT_SECRET is loaded from environment variables and is a string
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable not set');
}

/**
 * Registers a new user by hashing their password and generating a JWT token.
 * 
 * @param {string} email - The user's email.
 * @param {string} username - The user's username.
 * @param {string} password - The user's raw password (before hashing).
 * @returns {Promise<string>} - Returns a JWT token upon successful registration.
 * @throws - Throws an error if any of the credentials are missing or registration fails.
 */
export const registerUser = async (email: string, username: string, password: string): Promise<string> => {
    // Basic validation for required fields
    if (!email || !username || !password) {
        throw new Error('Credentials not provided');
    }
    validateCredentials(email, username, password) // throws error if invalid credentials

    try {
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt();
        const password_hash = await bcrypt.hash(password, salt);

        // Add the user to the database
        const user_id = await addUser(email, username, password_hash);

        // Prepare the JWT payload
        const payload = { user_id, email, username };

        // Sign the JWT token using the secret
        const token = jwt.sign(payload, JWT_SECRET);

        return token;
    } catch (err: any) {
        console.error(`Error during registration: ${err}`);
        throw err;  // Propagate the error to the caller (controller)
    }
}

/**
 * Logs in a user by verifying their email and password, then generating a JWT token.
 * 
 * @param {string} email - The user's email.
 * @param {string} password - The user's raw password (before hashing).
 * @returns {Promise<string>} - Returns a JWT token upon successful login.
 * @throws - Throws an error if credentials are missing or invalid.
 */
export const loginUser = async (email: string, password: string): Promise<string> => {
    // Ensure the email and password are provided
    if (!email || !password) {
        throw new Error('Email or password not provided');
    }

    try {
        // Fetch the user from the database by email
        const user = await getUserByEmail(email);
        if (!user) throw new Error(`No user found with email: ${email}`)



        // Validate that the user exists and the password is correct
        if (!(await bcrypt.compare(password, user.password_hash || ""))) throw new Error('Invalid credentials');


        // Prepare the JWT payload
        const payload = { user_id: user.user_id, email, username: user.username };

        // Sign the JWT token using the secret
        const token = jwt.sign(payload, JWT_SECRET);

        return token;
    } catch (err: any) {
        console.error(`Error during login: ${err}`);
        throw err;  // Propagate the error to the caller (controller)
    }
}

export const verifyToken = (token?: string) => {


    try {
        if (!token) {
            throw new Error("You are not Authorized");
        }
        const result = jwt.verify(token, JWT_SECRET) as Payload;
        return result;
    } catch (err: any) {
        console.error(`Error during login: ${err}`);
        throw err;
    }


}


export const signinWithGoogle = async (email: string, username: string, google_id: string) => {
    try {
        // Fetch the newly registered user from the database
        const user = await getUserByEmail(email);
        // Add a check if no user is found (edge case handling)

        let user_id;
        let newUser = false;
        if (!user) {
            user_id = await addUserWithGoogle(email, username, google_id)
            newUser = true;
        } else if (!user.google_id) {
            user_id = await updateUserGoogleId(email, google_id);
        } else {
            user_id = user.user_id;
        }


        // Prepare the JWT payload
        const payload = { user_id, email, username };

        // Sign the JWT token using the secret
        const token = jwt.sign(payload, JWT_SECRET);

        return { token, newUser };

    } catch (error: any) {
        console.error(error);
        throw error;


    }

}