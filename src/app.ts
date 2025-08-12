import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './rutas/authRoutes.js'
import alumnoRoutes from './rutas/alumnoRoutes.js'
import cors from 'cors'
import pg, { Pool } from 'pg'

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

export const pool = new Pool({
    host: process.env.HOST,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.PG_PORT || '5432'),
    max: 100,
    connectionString: process.env.DATABASE_URL,
    /*ssl: {
        rejectUnauthorized: false. usarlo en produccion
    }*/
})




console.log('Preparando servidor web');

app.use('/auth', authRoutes)
app.use('/alumno', alumnoRoutes)

export default app;