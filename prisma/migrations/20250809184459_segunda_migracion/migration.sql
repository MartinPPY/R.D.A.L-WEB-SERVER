/*
  Warnings:

  - A unique constraint covering the columns `[areaTrabajoId]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Usuario" ADD COLUMN     "areaTrabajoId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Area_Trabajo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Area_Trabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Actividad" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora_inicio" TIMESTAMP(3) NOT NULL,
    "hora_termino" TIMESTAMP(3) NOT NULL,
    "id_area_trabajo" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "estado" BOOLEAN NOT NULL,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Solicitud" (
    "id" SERIAL NOT NULL,
    "id_actividad" INTEGER NOT NULL,
    "estado" BOOLEAN NOT NULL,
    "comentario" TEXT NOT NULL,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Solicitud_id_actividad_key" ON "public"."Solicitud"("id_actividad");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_areaTrabajoId_key" ON "public"."Usuario"("areaTrabajoId");

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_areaTrabajoId_fkey" FOREIGN KEY ("areaTrabajoId") REFERENCES "public"."Area_Trabajo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Actividad" ADD CONSTRAINT "Actividad_id_area_trabajo_fkey" FOREIGN KEY ("id_area_trabajo") REFERENCES "public"."Area_Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Actividad" ADD CONSTRAINT "Actividad_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Solicitud" ADD CONSTRAINT "Solicitud_id_actividad_fkey" FOREIGN KEY ("id_actividad") REFERENCES "public"."Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
