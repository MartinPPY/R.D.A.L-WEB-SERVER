import { Request, Response } from "express";
import usuarioPrisma from '../modelos/usuario.js';
import { hashPassword } from "../servicios/passwordService.js";

export const logIn = async (req: Request, res: Response): Promise<void> => {

    res.status(200).json({ message: 'login!' })

}

export const registroUsuario = async (req: Request, res: Response): Promise<void> => {
    const { nombre, apellidoMaterno, apellidoPaterno, email, fono, tipoUsuarioId, password } = req.body;
    /* validacion de campos vacios */
    const camposObligatorios: any = {
        nombre: 'Los nombres deben ser obligatorios',
        apellidoMaterno: 'El apellido materno es obligatorio',
        apellidoPaterno: 'El apellido paterno es obligatorio',
        email: 'El email es obligatorio',
        fono: 'El teléfono es obligatorio',
        tipoUsuarioId: 'El tipo de usuario es obligatorio',
        password: 'La contraseña es obligatoria'
    };

    for (const campo in camposObligatorios) {
        if (!req.body[campo]) {
            res.status(400).json({ message: camposObligatorios[campo] });
            return
        }
    }

    /* validacion de email */
    const duocEmailRegex = /^[a-zA-Z0-9._%+-]+@(duocuc\.cl|duoc\.cl)$/;

    if (!email || !duocEmailRegex.test(email)) {
        res.status(400).json({ message: 'El correo debe tener un formato válido y ser @duocuc.cl o @duoc.cl' });
        return
    }

    /* validacion de fono  */
    if (fono.length < 9) {
        res.status(400).json({ message: 'El numero de telefono no es valido!' });
        return
    }

    try {

        const hashedPassword: string = await hashPassword(password);

        await usuarioPrisma.create({
            data: {
                nombres: nombre,
                apellido_materno: apellidoMaterno,
                apellido_paterno: apellidoPaterno,
                email: email,
                fono: fono,
                password: hashedPassword,
                tipo_usuario_id: tipoUsuarioId
            }
        });
        res.status(201).json({ message: 'usuario creado!' });

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'error desconocido' });
    }
}