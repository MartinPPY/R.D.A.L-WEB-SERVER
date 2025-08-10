export interface TipoUsuario {
    id: number,
    nombre: string
}

export interface Usuario {
    id: number,
    nombres: string,
    apellido_paterno: string,
    apellido_materno: string,
    email: string,
    fono: number
    password: string
    tipo_usuario_id: number
    tipo_usuario?: TipoUsuario,
    areaTrabajoId:number | null
}

export interface Payload{
    id:number,
    email:string,
    tipoUsuadio:number
}