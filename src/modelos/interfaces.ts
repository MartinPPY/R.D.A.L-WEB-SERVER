import { Tipo_Usuario } from "@prisma/client"

export interface tipoUsuario {
    id: number,
    nombre: string
}

export interface usuario {
    id: number,
    nombres: string,
    apellido_paterno: string,
    apellido_materno: string,
    email: string,
    fono: number
    password: string
    tipo_usuario_id: number
    tipo_usuario?: Tipo_Usuario
}