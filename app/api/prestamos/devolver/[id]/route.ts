/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

type Params = Promise<{ id: string }>

export async function PATCH(
    req: Request,
    segmentData: { params: Params }
) {
    try {
        const params = await segmentData.params
        const id = params.id

        // Check for the id.
        if (!id) {
            return new NextResponse("id is required", { status: 400 });
        }

        const body = await req.json();

        const {
            fechaDevolucionFinal
        } = body;

        // Check for the fechaPrestado.
        if (!fechaDevolucionFinal) {
            return new NextResponse("fechaDevolucionFinal is required", { status: 400 });
        }

        const lending = await prismadb.prestamo.update({
            where: {
                id: Number(id),
            },
            data: {
                fechaDevolucionFinal: fechaDevolucionFinal
            }
        })

        return NextResponse.json(lending);
    } catch (error: any) {
        console.error('[PRESTAMOS_PATCH]', error.message);
        if (error.code === 'P2002') {
            return new NextResponse("Unique constraint failed", { status: 409 }); // likely unique constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }

}