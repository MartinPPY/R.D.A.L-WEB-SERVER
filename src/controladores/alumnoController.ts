import { Request, Response } from "express";
import usuarioPrisma from '../modelos/usuario.js';
import actividadPrisma from '../modelos/actividad.js'
import { AlumnoActividades, Payload, Usuario } from "../modelos/interfaces.js";
import { decifrarToken } from "../servicios/authService.js";
import { pool } from "../app.js";

export const registrarActividad = async (req: Request, res: Response): Promise<void> => {
    const { fecha, horaInicio, horaTermino, areaTrabajo } = req.body;

    const camposObligatorios: any = {
        fecha: 'La fecha es obligatoria!',
        horaInicio: 'La hora de inicio es obligatoria!',
        horaTermino: 'La hora de termino es obligatoria!',
        areaTrabajo: 'El area de trabajo es obligatoria!'
    }

    for (const campo in camposObligatorios) {
        if (!req.body[campo]) {
            res.status(400).json({ message: camposObligatorios[campo] });
            return
        }
    }

    try {
        const token: string = req.cookies.token
        if (!token) {
            res.status(401).json({ message: 'el usuario no posee un token de autenticacion!' })
            return
        }

        const payload: Payload | null = decifrarToken(token)
        if (!payload) {
            res.status(401).json({ message: 'no se pudo decifrar el token' })
            return
        }

        const usuario: Usuario | null = await usuarioPrisma.findUnique({ where: { email: payload.email } })

        if (!usuario) {
            res.status(404).json({ message: 'no se ha encontrado el usuario que registro esta actividad' })
            return
        }

        await actividadPrisma.create({
            data: {
                estado: false,
                fecha: fecha,
                hora_inicio: horaInicio,
                hora_termino: horaTermino,
                id_area_trabajo: areaTrabajo,
                id_usuario: usuario.id
            }
        })

        res.status(201).json({ message: 'Actividad creada!' })

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'Error desconocido' })
    }


}

export const traerActividadesPorAlumno = async (req: Request, res: Response): Promise<void> => {

    const token: string = req.cookies.token
    if (!token) {
        res.status(401).json({ message: 'el usuario no posee un token de autenticacion!' })
        return
    }

    const payload: Payload | null = decifrarToken(token)
    if (!payload) {
        res.status(401).json({ message: 'no se pudo decifrar el token' })
        return
    }

    const client = await pool.connect()

    try {

        const results = await client.query('SELECT FN_ALUMNO_TRAER_ACTIVIDADES($1)', [payload.id])
        const actividades: AlumnoActividades = results.rows[0].fn_alumno_traer_actividades

        res.status(200).json({ actividades })

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'Error desconocido' })
    } finally {
        client.release()
    }
}

export const filtrarActividades = async (req: Request, res: Response): Promise<void> => {

    let mesFiltro, areaFiltro
    const { mes, area } = req.query;


    if (mes === 'false') {
        mesFiltro = null
    } else {
        mesFiltro = Number(mes)
    }

    if (area === 'false') {
        areaFiltro = null
    } else {
        areaFiltro = area
    }

    const token: string = req.cookies.token
    if (!token) {
        res.status(401).json({ message: 'el usuario no posee un token de autenticacion!' })
        return
    }

    const payload: Payload | null = decifrarToken(token)
    if (!payload) {
        res.status(401).json({ message: 'no se pudo decifrar el token' })
        return
    }

    const client = await pool.connect()

    try {

        const results = await client.query('SELECT FN_ALUMNO_FILTRAR_ACTIVIDADES($1,$2,$3)', [payload.id, mesFiltro, areaFiltro])
        const actividades: AlumnoActividades = results.rows[0].fn_alumno_filtrar_actividades
        res.status(200).json({ actividades })

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'Error desconocido' })
    } finally {
        client.release()
    }
}

export const traerResumenMensual = async (req: Request, res: Response): Promise<void> => {

    const token: string = req.cookies.token
    if (!token) {
        res.status(401).json({ message: 'el usuario no posee un token de autenticacion!' })
        return
    }

    const payload: Payload | null = decifrarToken(token)
    if (!payload) {
        res.status(401).json({ message: 'no se pudo decifrar el token' })
        return
    }

    const client = await pool.connect()

    try {

        const results = await client.query('SELECT FN_ALUMNO_TRAER_RESUMEN_MES($1)', [payload.id])
        const horasAprobadas: number = results.rows[0].fn_alumno_traer_resumen_mes
        const tarifa: number = 2450
        const montoAcumulado: number = horasAprobadas * tarifa

        res.status(200).json({ horasAprobadas: horasAprobadas, montoAcumulado: montoAcumulado, ordenCompra: 'No vigente' })

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'Error desconocido' })
    } finally {
        client.release()
    }
}