import { Router } from 'express';
import { login, register } from '../controllers/authController';

const router = Router();

// Authentication Routes

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', register);

/**
 * @route POST /api/v1/auth/login
 * @desc Login a user
 * @access Public
 */
router.post('/login', login);

export default router;
