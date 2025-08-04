import express from 'express';
import { logIn, registroUsuario } from '../controladores/authController.js';

const router = express.Router();

router.post('/log-in', logIn);
router.post('/registro',registroUsuario);

export default router;