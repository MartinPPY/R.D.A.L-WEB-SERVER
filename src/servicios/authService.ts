import { Usuario } from '@prisma/client'
import jwt from 'jsonwebtoken'

const JWT_SECRET: string = process.env.JWT_SECRET || 'default_secret'

export const generateToken = (usuario: Usuario): string => {
    return jwt.sign({ id: usuario.id, email: usuario.email, tipoUsuario: usuario.tipo_usuario_id }, JWT_SECRET)
}