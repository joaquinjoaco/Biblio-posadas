/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

// local imports.
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
) {
    try {
        const body = await req.json();

        const {
            idLibro,
            idSocio,
            fechaPrestado,
            fechaDevolucionEstipulada
        } = body;


        // Check for the idLibro.
        if (!idLibro) {
            return new NextResponse("idLibro is required", { status: 400 });
        }

        // Check for the idSocio.
        if (!idSocio) {
            return new NextResponse("idSocio is required", { status: 400 });
        }

        // Check for the fechaPrestado.
        if (!fechaPrestado) {
            return new NextResponse("fechaPrestado is required", { status: 400 });
        }

        // Check for the fechaDevolucionEstipulada.
        if (!fechaDevolucionEstipulada) {
            return new NextResponse("fechaDevolucionEstipulada is required", { status: 400 });
        }

        // If all the checks were passed, we can create the lending.
        const lending = await prismadb.prestamo.create({
            data: {
                idLibro: Number(idLibro),
                idSocio: Number(idSocio),
                fechaPrestado: fechaPrestado,
                fechaDevolucionEstipulada: fechaDevolucionEstipulada,
            }
        });

        return NextResponse.json(lending);

    } catch (error: any) {
        console.error('[PRESTAMOS_POST]', error.message);
        if (error.code === 'P2002') {
            return new NextResponse("Unique constraint failed", { status: 409 }); // likely unique constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }
}