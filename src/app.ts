import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());

console.log('Preparando servidor web');

export default app;