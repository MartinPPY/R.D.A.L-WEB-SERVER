import { Request, Response } from "express";
import usuarioPrisma from '../modelos/usuario.js';

export const logIn = async (req: Request, res: Response): Promise<void> => {

    res.status(200).json({ message: 'login!' })

}

export const registroUsuario = async (req: Request, res: Response): Promise<void> => {
    const { nombre, apellidoMaterno, apellidoPaterno, email, fono, tipoUsuarioId, password } = req.body;
    try {

        await usuarioPrisma.create({
            data: {
                nombres: nombre,
                apellido_materno: apellidoMaterno,
                apellido_paterno: apellidoPaterno,
                email: email,
                fono: fono,
                password: password,
                tipo_usuario_id: tipoUsuarioId
            }
        });
        res.status(201).json({ message: 'usuario creado!' });

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'error desconocido' });
    }
}