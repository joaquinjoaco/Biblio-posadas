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

    const members = await prismadb.socio.findMany({
        orderBy: {
            createdAt: 'asc'
        }
    })


    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <LendingFormByBookForm book={book} members={members} />
            </div>
        </div>
    );
}

export default BookPage;