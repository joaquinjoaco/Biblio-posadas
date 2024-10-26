import prismadb from "@/lib/prismadb";
import { BookForm } from "./components/book-form";
const BookPage = async (
    props: {
        params: Promise<{ inventario: string }>
    }
) => {
    const params = await props.params;

    const { inventario } = await params // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).
    const numeroInventario = inventario === 'nuevo' ? -1 : params.inventario

    const book = await prismadb.libro.findUnique({
        where: {
            inventario: Number(numeroInventario)
        }
    })


    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BookForm initialData={book} />
            </div>
        </div>
    );
}

export default BookPage;