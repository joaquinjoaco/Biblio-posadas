import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { BooksClient } from "./components/client";
import { BookColumn } from "./components/columns";
import { es } from "date-fns/locale";


export const metadata = {
    title: "Libros",
}

const BooksPage = async ({
    params
}: {
    params: {}
}) => {
    // Fetch all books.
    const books = await prismadb.libro.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedBooks: BookColumn[] = books.map((book) => ({
        inventario: book.inventario.toString(),
        colocacion: book.colocacion,
        autor: book.autor,
        titulo: book.titulo,
        pais: book.pais,
        descriptores: book.descriptores,

        isArchived: book.isArchived,
        isArchivedText: book.isArchived ? "Archivado" : "-",

        registro: format(book.createdAt, "dd MMMM, yyyy", { locale: es }),
        actualizado: format(book.updatedAt, "dd MMMM, yyyy", { locale: es })
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6t">
                <BooksClient data={formattedBooks} />
            </div>
        </div>
    );
}

export default BooksPage;