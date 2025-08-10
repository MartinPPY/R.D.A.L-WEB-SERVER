import express from 'express';
import { logIn, registroUsuario, verificarUser } from '../controladores/authController.js';

const router = express.Router();

router.post('/log-in', logIn);
router.post('/registro',registroUsuario);
router.get('/verify',verificarUser)

export default router;