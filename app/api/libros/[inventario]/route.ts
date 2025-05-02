/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

type Params = Promise<{ inventario: string }>


export async function PATCH(
    req: Request,
    segmentData: { params: Params } // comes from [inventario]
) {

    try {
        const params = await segmentData.params
        const inventario = params.inventario
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


        // We update the book.
        const book = await prismadb.libro.update({
            where: {
                inventario: Number(inventario),
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
    segmentData: { params: Params }
) {

    try {
        const params = await segmentData.params
        const inventario = params.inventario
        console.log("inventario ", inventario)
        if (!inventario) {
            return new NextResponse("inventario is required", { status: 400 });
        }

        const book = await prismadb.libro.deleteMany({
            where: {
                inventario: Number(inventario),
            }
        });

        return NextResponse.json(book);
    } catch (error: any) {
        console.error('[LIBROS_DELETE]', error.message);
        if (error?.code === 'P2003') {
            return new NextResponse("fk-constraint-failed", { status: 409 }); // FK constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }

}

export async function GET(
    _req: Request, // Not used, but required for API route signature
    segmentData: { params: Params }
) {
    // Fetches a book by its inventory number and returns a boolean indicating if it is lended or not,
    // and if it is lended it will also return the current lending id.
    try {
        const params = await segmentData.params;
        const inventario = params.inventario;

        // Check for the inventario.
        if (!inventario) {
            return new NextResponse("inventario is required", { status: 400 });
        }

        // Fetch the book.
        const book = await prismadb.libro.findUnique({
            where: {
                inventario: Number(inventario),
            },
        });

        // Check if the book exists.
        if (!book) {
            return new NextResponse("Book not found", { status: 404 });
        }


        // Check for any 'pending' lending for the book.
        const lendings = await prismadb.prestamo.findMany({
            where: {
                idLibro: book.inventario,
                fechaDevolucionFinal: null, // if the lending has no final return date, then it is considered as currently lended.
            },
            include: {
                socio: true,
            }
        })
        const lended = lendings.length !== 0

        return NextResponse.json({
            book: book,
            lended: lended,
            lendingId: lended ? lendings[0].id : null
        })

    } catch (error: any) {
        console.error("[LIBROS_GET]", error.message);
        return new NextResponse("Internal error", { status: 500 });
    }
}