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

        // If all the checks were passed, we can create the book.
        const book = await prismadb.libro.create({
            data: {
                colocacion,
                autor,
                titulo,
                pais,
                descriptores,
                isArchived
            }
        });

        return NextResponse.json(book);

    } catch (error: any) {
        console.error('[LIBROS_POST]', error.message);
        if (error.code === 'P2002') {
            return new NextResponse("Unique constraint failed", { status: 409 }); // likely unique constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }
}


// Unused but could be consumed from another system if needed.
// export async function GET(
//     _req: Request,
// ) {
//     try {

//         const books = await prismadb.libro.findMany({
//             where: {
//                 isArchived: false // we never want to load books that are archived.
//             },
//             orderBy: {
//                 inventario: 'asc',
//             }
//         });

//         return NextResponse.json(books);

//     } catch (error) {
//         console.log('[LIBROS_GET]', error);
//         return new NextResponse("Internal error", { status: 500 });
//     }
// }