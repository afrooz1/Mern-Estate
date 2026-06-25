import express from 'express';
import { google, signOut, signin, signup } from '../controllers/auth.controller.js';
import { authLimiter } from '../utils/rateLimiter.js';

const router = express.Router();

router.post('/signup', authLimiter, signup);
router.post('/signin', authLimiter, signin);
router.post('/google', authLimiter, google);
router.get('/signout', signOut);

export default router;