import { Usuario } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { Payload } from '../modelos/interfaces.js'

const JWT_SECRET: string = process.env.JWT_SECRET || 'default_secret'

export const generateToken = (usuario: Usuario): string => {
    return jwt.sign({ id: usuario.id, email: usuario.email, tipoUsuario: usuario.tipo_usuario_id }, JWT_SECRET)
}

export const decifrarToken = (token: string): Payload | null => {
    try {
        const decoded: Payload = jwt.verify(token, JWT_SECRET) as Payload
        return decoded
    } catch (error: any) {
        console.error(error)
        return null
    }

}