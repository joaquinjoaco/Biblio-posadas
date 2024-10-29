import prismadb from "@/lib/prismadb";
import { LendingFormByBookForm } from "./components/lending-form-by-book";

const BookPage = async (
    props: {
        params: Promise<{ inventario: string }>
    }
) => {
    const params = await props.params;

    const { inventario } = await params // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).

    const book = await prismadb.libro.findUnique({
        where: {
            inventario: Number(inventario)
        }
    })

    const lendings = await prismadb.prestamo.findMany({
        where: {
            idLibro: book?.inventario,
            fechaDevolucionFinal: null, // if the lending has no final return date, then it is considered as currently lended.
        },
        include: {
            socio: true,
        }
    })
    console.log(lendings)

    const members = await prismadb.socio.findMany({
        where: {
            isArchived: false, // non archived members only.
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    // check if the book is currently lended, we can tell by the results given by the query.
    const lended = lendings.length !== 0;

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <LendingFormByBookForm book={book} members={members} lended={lended} lendings={lendings} />
            </div>
        </div>
    );
}

export default BookPage;