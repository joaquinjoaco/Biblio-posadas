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
            return new NextResponse("member id is required", { status: 400 });
        }

        const body = await req.json();

        const {
            ci,
            nombre,
            apellido,
            direccion,
            telefono,
            ubicacion,
            isArchived
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


        const socio = await prismadb.socio.update({
            where: {
                id: Number(id),
            },
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
        console.log('[SOCIOS_PATCH]', error);
        if (error.code === 'P2002') {
            return new NextResponse("Unique constraint failed", { status: 409 }); // likely unique constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }

}

export async function DELETE(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    segmentData: { params: Params }
) {

    try {
        const params = await segmentData.params
        const id = params.id

        // Check for the id.
        if (!id) {
            return new NextResponse("member id is required", { status: 400 });
        }

        const socio = await prismadb.socio.deleteMany({
            where: {
                id: Number(id),
            }
        });

        return NextResponse.json(socio);
    } catch (error: any) {
        console.log('[SOCIOS_DELETE]', error);
        if (error.code === 'P2003') {
            return new NextResponse("fk-constraint-failed", { status: 409 }); // FK constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }

}