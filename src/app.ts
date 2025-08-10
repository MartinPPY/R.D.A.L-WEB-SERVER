import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './rutas/authRoutes.js'
import cors from 'cors'

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:4200',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

console.log('Preparando servidor web');

app.use('/auth', authRoutes)

export default app;