import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function PATCH(
    req: Request,
    { params }: { params: { id: number } } // comes from [id]
) {

    try {
        const id = Number(params.id);
        // Check for the id.
        if (!id) {
            return new NextResponse("id is required", { status: 400 });
        }

        const body = await req.json();

        const {
            fechaPrestado,
            fechaDevolucionEstipulada,
            fechaDevolucionFinal
        } = body;

        // Check for the fechaPrestado.
        if (!fechaPrestado) {
            return new NextResponse("fechaPrestado is required", { status: 400 });
        }

        // Check for the apellido.
        if (!fechaDevolucionEstipulada) {
            return new NextResponse("fechaDevolucionEstipulada is required", { status: 400 });
        }

        const lending = await prismadb.prestamo.update({
            where: {
                id: id,
            },
            data: {
                fechaPrestado: fechaPrestado,
                fechaDevolucionEstipulada: fechaDevolucionEstipulada,
                fechaDevolucionFinal: fechaDevolucionFinal
            }
        });

        return NextResponse.json(lending);
    } catch (error: any) {
        console.log('[PRESTAMOS_PATCH]', error);
        if (error.code === 'P2002') {
            return new NextResponse("Unique constraint failed", { status: 409 }); // likely unique constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }

}