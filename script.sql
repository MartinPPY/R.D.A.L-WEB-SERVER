INSERT INTO "Tipo_Usuario"(nombre)VALUES('Administrador');
INSERT INTO "Tipo_Usuario"(nombre)VALUES('Alumno Ayudante');
INSERT INTO "Area_Trabajo" (nombre) VALUES('Difusión');
INSERT INTO "Area_Trabajo" (nombre) VALUES('Extensión');
INSERT INTO "Area_Trabajo" (nombre) VALUES('Comunicación');
INSERT INTO "Area_Trabajo" (nombre) VALUES('Financiamiento');
INSERT INTO "Area_Trabajo" (nombre) VALUES('Biblioteca');
INSERT INTO "Area_Trabajo" (nombre) VALUES('Cetecom');

-- Primero creamos la función que hará la inserción
CREATE OR REPLACE FUNCTION crear_solicitud_actividad()
RETURNS TRIGGER AS $$
BEGIN
    -- Insertamos en Solicitud usando el id de la Actividad recién creada
    INSERT INTO "Solicitud" (id_actividad, estado, comentario)
    VALUES (NEW.id, FALSE, 'no aprobada');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ahora creamos el trigger que llama a la función
CREATE TRIGGER trigger_crear_solicitud
AFTER INSERT ON "Actividad"
FOR EACH ROW
EXECUTE FUNCTION crear_solicitud_actividad();



--FUNCIONES PARA EL USUARIO ALUMNO
CREATE OR REPLACE FUNCTION FN_ALUMNO_TRAER_ACTIVIDADES(p_alumno_id INTEGER) RETURNS JSON
LANGUAGE PLPGSQL AS $$
DECLARE
V_ACTIVIDADES JSON;

BEGIN

SELECT JSON_AGG(ACT) INTO V_ACTIVIDADES FROM(
SELECT
    TO_CHAR(A.fecha,'DD-MM-YYYY') AS FECHA,
    TO_CHAR(
        (A.hora_inicio AT TIME ZONE 'UTC') AT TIME ZONE 'America/Santiago',
        'HH24:MI'
    ) AS INICIO,
	TO_CHAR(
        (A.hora_termino AT TIME ZONE 'UTC') AT TIME ZONE 'America/Santiago',
        'HH24:MI'
    ) AS TERMINO,
	AT.nombre as AREA
	
FROM
    "Actividad" A INNER JOIN "Area_Trabajo" AT on AT.id = A.id_area_trabajo
WHERE
    id_usuario = p_alumno_id
) ACT;

RETURN COALESCE(V_ACTIVIDADES, '[]'::json);

END;
$$;




