import { Router } from 'express';
import { getUserId, googleSignIn, login, register } from '../controllers/authController';

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

/**
 * @route POST /api/v1/auth/getUserId
 * @desc verify the user and get user id

 */
router.get('/getUserId', getUserId);

router.post('/googleAuth',googleSignIn);

export default router;
