import { Request, Response } from 'express';
import { loginUser, registerUser, verifyToken, signinWithGoogle } from '../services/authService';

/**
 * Handles user registration.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} - Sends a JWT token upon successful registration.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, username, password } = req.body;
    try {
        // Register the user and return a JWT token
        const token = await registerUser(email, username, password);
        res.status(200).json({ token });
    } catch (error: any) {
        console.error(`Error during registration: ${error.message}`);

        // Send a proper error response with the message
        res.status(400).json({ error: error.message });
    }
};

/**
 * Handles user login.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} - Sends a JWT token upon successful login.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        // Log in the user and return a JWT token
        const token = await loginUser(email, password);
        res.status(200).json({ token });
    } catch (error: any) {
        console.error(`Error during login: ${error.message}`);

        // Send a proper error response with the message
        res.status(400).json({ error: error.message });
    }
};

export const getUserId = async (req: Request, res: Response): Promise<void> => { 
    const token = req.header("auth_token")
    try {
        const{ user_id} = verifyToken(token);
        res.status(200).json({user_id})
    } catch (error:any) {
        console.log(`Error while verifying `);
        res.status(400).json({ error: error.message });
    }
    
}

export const googleSignIn = async (req: Request, res: Response): Promise<void> => {
    const { email, username,google_id } = req.body;
    try {
        // Log in the user and return a JWT token
        const token = await signinWithGoogle(email,username,google_id);
        res.status(200).json({ token });
    } catch (error: any) {
        console.error(`Error during login: ${error.message}`);

        // Send a proper error response with the message
        res.status(400).json({ error: error.message });
    }
};