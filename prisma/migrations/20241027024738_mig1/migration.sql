-- npx prisma migrate dev

-- CreateEnum
CREATE TYPE "Ubicacion" AS ENUM ('DENTRO', 'FUERA');

-- CreateTable
CREATE TABLE "Libro" (
    "inventario" SERIAL NOT NULL,
    "colocacion" VARCHAR(255) NOT NULL,
    "autor" VARCHAR(255) NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "pais" VARCHAR(255) NOT NULL,
    "descriptores" VARCHAR(255) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Libro_pkey" PRIMARY KEY ("inventario")
);

-- Set the starting value for the sequence
ALTER SEQUENCE "Libro_inventario_seq" RESTART WITH 35125;

-- CreateTable
CREATE TABLE "Socio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" INTEGER NOT NULL,
    "ubicacion" "Ubicacion" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prestamo" (
    "id" SERIAL NOT NULL,
    "idLibro" INTEGER NOT NULL,
    "idSocio" INTEGER NOT NULL,
    "fechaPrestado" TIMESTAMP(3) NOT NULL,
    "fechaDevolucionEstipulada" TIMESTAMP(3) NOT NULL,
    "fechaDevolucionFinal" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prestamo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_idLibro_fkey" FOREIGN KEY ("idLibro") REFERENCES "Libro"("inventario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_idSocio_fkey" FOREIGN KEY ("idSocio") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
