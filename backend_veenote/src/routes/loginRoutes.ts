import {Router} from 'express';
import { loginMiddleWare, logout } from '../controller/auth/authController.js';

/**
 * This is the route for login
 * POST /api/v1/login
 */

const router = Router();

router.post('/login', loginMiddleWare);

/**
 * This the route for logout
 * POST /api/v1/logout
 */

router.post('/logout', logout);

