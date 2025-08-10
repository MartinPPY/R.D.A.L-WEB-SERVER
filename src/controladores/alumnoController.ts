import { Request, Response } from "express";
import usuarioPrisma from '../modelos/usuario.js';
import { comparePasswords, hashPassword } from "../servicios/passwordService.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Payload, Usuario } from "../modelos/interfaces.js";
import { decifrarToken, generateToken } from "../servicios/authService.js";
import areaPrisma from '../modelos/areaTrabjo.js'

export const registrarActividad = async (req: Request, res: Response): Promise<void> => {
    const { email, password,fecha,horaInicio,horaTermino,areaTrabajo } = req.body;

    if (!email) {
        res.status(400).json({ message: 'El email es obligatorio' });
        return
    }

    if (!password) {
        res.status(400).json({ message: 'La contraseña es obligatoria' });
        return
    }

    try {
        const usuario: Usuario | null = await usuarioPrisma.findUnique({ where: { email: email } })
        if (!usuario) {
            res.status(404).json({ message: 'Usuario no encontrado!' })
            return
        }
        const passwordMacth: boolean = await comparePasswords(password, usuario.password)
        if (!passwordMacth) {
            res.status(401).json({ message: 'credenciales invalidas!' })
            return
        }

        const token = generateToken(usuario)
        const isProduction = process.env.NODE_ENV === 'production';
        const areasTrabajo = await areaPrisma.findMany()

        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/'
        })





        res.status(200).json({ estado: true, areasTrabajo })

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'Error desconocido' })
    }


}