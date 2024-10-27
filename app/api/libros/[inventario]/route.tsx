import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";


// export async function GET(
//     _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
//     { params }: { params: { inventario: number } }
// ) {

//     try {

//         const inventario = Number(params.inventario);
// Check for the inventario.
// if (!inventario) {
//     return new NextResponse("inventario is required", { status: 400 });
// }
//         const book = await prismadb.libro.findUnique({
//             where: {
//                 inventario: inventario,
//             },
//         });

//         return NextResponse.json(book);
//     } catch (error) {
//         console.log('[LIBROS_GET]', error);
//         return new NextResponse("Internal error", { status: 500 });
//     }
// }

export async function PATCH(
    req: Request,
    { params }: { params: { inventario: number } } // comes from [inventario]
) {

    try {
        const inventario = Number(params.inventario);
        // Check for the inventario.
        if (!inventario) {
            return new NextResponse("inventario is required", { status: 400 });
        }

        const body = await req.json();

        const {
            colocacion,
            autor,
            titulo,
            pais,
            descriptores,
            isArchived,
        } = body;


        // Check for the Colocación.
        if (!colocacion) {
            return new NextResponse("colocacion is required", { status: 400 });
        }

        // Check for the autor.
        if (!autor) {
            return new NextResponse("autor is required", { status: 400 });
        }

        // Check for the titulo.
        if (!titulo) {
            return new NextResponse("titulo is required", { status: 400 });
        }

        // Check for the pais.
        if (!pais) {
            return new NextResponse("pais is required", { status: 400 });
        }

        // Check for the descriptores.
        if (!descriptores) {
            return new NextResponse("descriptores is required", { status: 400 });
        }


        // We update the whole product and delete its images.
        const book = await prismadb.libro.update({
            where: {
                inventario: inventario,
            },
            data: {
                colocacion,
                autor,
                titulo,
                pais,
                descriptores,
                isArchived,
            }
        });

        return NextResponse.json(book);
    } catch (error: any) {
        console.log('[LIBROS_PATCH]', error);
        if (error.code === 'P2002') {
            return new NextResponse("Unique constraint failed", { status: 409 }); // likely unique constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }

}

export async function DELETE(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    { params }: { params: { inventario: number } }
) {

    try {
        const inventario = Number(params.inventario);
        // Check for the inventario.
        if (!inventario) {
            return new NextResponse("inventario is required", { status: 400 });
        }

        const book = await prismadb.libro.deleteMany({
            where: {
                inventario: inventario,
            }
        });

        return NextResponse.json(book);
    } catch (error: any) {
        console.log('[LIBROS_DELETE]', error);
        if (error.code === 'P2003') {
            return new NextResponse("fk-constraint-failed", { status: 409 }); // FK constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }

}