import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

const JWT_SECRET: string = process.env.JWT_SECRET || 'default_secret'

export const authenticatedToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token
    if (!token) {
        res.status(404).json({ message: 'No se ha encontrado el token' })
        return
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {

        if (err) {
            return res.status(403).json({ message: 'Token no verificado. No tienes acceso a este recurso' })
        }

        next()
    })

}