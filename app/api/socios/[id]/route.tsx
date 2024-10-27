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
            return new NextResponse("member id is required", { status: 400 });
        }

        const body = await req.json();

        const {
            nombre,
            apellido,
            direccion,
            telefono,
            ubicacion,
        } = body;

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


        // We update the whole product and delete its images.
        const socio = await prismadb.socio.update({
            where: {
                id: id,
            },
            data: {
                nombre,
                apellido,
                direccion,
                telefono,
                ubicacion,
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
    { params }: { params: { id: number } }
) {

    try {
        const id = Number(params.id);
        // Check for the id.
        if (!id) {
            return new NextResponse("member id is required", { status: 400 });
        }

        const socio = await prismadb.socio.deleteMany({
            where: {
                id: id,
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