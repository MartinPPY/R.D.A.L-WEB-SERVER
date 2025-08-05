import { Request, Response } from "express";
import usuarioPrisma from '../modelos/usuario.js';
import { comparePasswords, hashPassword } from "../servicios/passwordService.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Usuario } from "../modelos/interfaces.js";
import { generateToken } from "../servicios/authService.js";

export const logIn = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

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

        res.status(200).json({ token })

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'Error desconocido' })
    }


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

    } catch (error: PrismaClientKnownRequestError | any) {

        if (error.meta.target[0] === 'email') {
            res.status(400).json({ message: 'El email ya existe en los registros' });
            return
        }

        if (error.meta.target[0] === 'fono') {
            res.status(400).json({ message: 'El numero de telefono ya existe en los registros' });
            return
        }
        console.error(error)
        res.status(500).json({ message: 'error desconocido' });
    }
}