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
            ci,
            nombre,
            apellido,
            direccion,
            telefono,
            ubicacion,
            isArchived,
        } = body;


        // Check for the ci.
        if (!ci) {
            return new NextResponse("ci is required", { status: 400 });
        }

        // Check for the nombre.
        if (!nombre) {
            return new NextResponse("nombre is required", { status: 400 });
        }

        // Check for the apellido.
        if (!apellido) {
            return new NextResponse("apellido is required", { status: 400 });
        }

        // Check for the direccion.
        if (!direccion) {
            return new NextResponse("direccion is required", { status: 400 });
        }

        // Check for the telefono.
        if (!telefono) {
            return new NextResponse("telefono is required", { status: 400 });
        }

        // Check for the ubicacion.
        if (!ubicacion) {
            return new NextResponse("ubicacion is required", { status: 400 });
        }

        // If all the checks were passed, we can create the library's member.
        const socio = await prismadb.socio.create({
            data: {
                ci,
                nombre,
                apellido,
                direccion,
                telefono,
                ubicacion,
                isArchived
            }
        });

        return NextResponse.json(socio);

    } catch (error: any) {
        console.error('[SOCIOS_POST]', error.message);
        if (error.code === 'P2002') {
            return new NextResponse("Unique constraint failed", { status: 409 }); // likely unique constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }
}