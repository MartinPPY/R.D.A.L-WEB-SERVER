import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './rutas/authRoutes.js'

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());

console.log('Preparando servidor web');

app.use('/auth', authRoutes)

export default app;