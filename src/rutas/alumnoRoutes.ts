import express from 'express';
import { filtrarActividades, registrarActividad, traerActividadesPorAlumno, traerResumenMensual } from '../controladores/alumnoController.js';

const router = express.Router();

router.post('/registrar-actividad', registrarActividad);
router.get('/actividades', traerActividadesPorAlumno)
router.get('/actividades-filtradas', filtrarActividades)
router.get('/resumen-mensual', traerResumenMensual)

export default router;