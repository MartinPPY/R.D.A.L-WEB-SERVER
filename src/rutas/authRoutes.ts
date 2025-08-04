import express from 'express';
import { logIn } from '../controladores/authController.js';

const router = express.Router();

router.post('/log-in', logIn);

export default router;