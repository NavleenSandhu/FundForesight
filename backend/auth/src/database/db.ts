import { Pool } from 'pg';
import { User } from '../models/userModel';

// Initialize the PostgreSQL connection pool using environment variables
const pool = new Pool({
    user: process.env.DB_USER,                // PostgreSQL username
    host: process.env.DB_HOST,                // PostgreSQL host (usually localhost or container IP)
    database: process.env.DB_NAME,            // Database name
    password: process.env.DB_PASSWORD,        // Password
    port: Number(process.env.DB_PORT) || 5432 // Convert port to a number, default to 5432 if not provided
})

/**
 * Fetches a user from the database based on their email.
 * 
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<any>} - Returns a promise resolving to the user record.
 * @throws - Throws an error if the database query fails.
 */
export const getUserByEmail = async (email: string): Promise<User> => {
    // Query the database to find the user by email
    const res = await pool.query<User>('SELECT * FROM users WHERE email=$1', [email]);

   
    return res.rows[0]; // return the first and only user with matching email
}

/**
 * Adds a new user to the database.
 * 
 * @param {string} email - The user's email.
 * @param {string} username - The user's username.
 * @param {string} password_hash - The hashed password of the user.
 * @returns {Promise<number>} - Returns the row count indicating how many records were inserted.
 * @throws - Throws a custom error if a user already exists, or the database operation fails.
 */
export const addUser = async (email: string, username: string, password_hash: string): Promise<number | null> => {
    try {
        // Insert the new user into the database
        const res = await pool.query(
            'INSERT INTO users(email, username, password_hash) VALUES($1, $2, $3) RETURNING user_id',
            [email, username, password_hash]
        );

        return res.rows[0].user_id;
    } catch (err: any) {
        // Handle specific error: Unique constraint violation (e.g., duplicate email)
        if (err.code === '23505') {  // '23505' is the PostgreSQL error code for unique violations
            throw new Error('A user with the same credentials already exists!');
        }

        // Log unexpected errors for debugging
        console.error(`Error adding user: ${err.message}`);

        // Rethrow the error to propagate it to the caller
        throw err;
    }
}

export const updateUserGoogleId = async (email: string, google_id: string) => { 
    try {
        const res = await pool.query(
            "UPDATE users SET google_id = $1 WHERE email = $2 RETURNING user_id", [google_id, email]
        );
        return res.rows[0].user_id;
    } catch (error:any) {
        // Log unexpected errors for debugging
        console.error(`Error adding user: ${error.message}`);

        // Rethrow the error to propagate it to the caller
        throw error;
    }
}

export const addUserWithGoogle = async (email: string, username: string, google_id: string): Promise<number | null> => {
    try {
        // Insert the new user into the database
        const res = await pool.query(
            'INSERT INTO users(email, username, google_id) VALUES($1, $2, $3) RETURNING user_id',
            [email, username, google_id]
        );

        return res.rows[0].user_id;
    } catch (err: any) {
        // Log unexpected errors for debugging
        console.error(`Error adding user: ${err.message}`);

        // Rethrow the error to propagate it to the caller
        throw err;
    }
}
