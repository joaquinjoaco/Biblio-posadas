import prismadb from "@/lib/prismadb";
import { LendingFormEdit } from "./components/lending-form-edit";

const BookPage = async (
    props: {
        params: Promise<{ id: string }>
    }
) => {
    const params = await props.params;

    const { id } = await params // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).

    const lending = await prismadb.prestamo.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            socio: true,
            libro: true,
        }
    })

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <LendingFormEdit initialData={lending} />
                </div>
            </div>
        </>
    );
}

export default BookPage;