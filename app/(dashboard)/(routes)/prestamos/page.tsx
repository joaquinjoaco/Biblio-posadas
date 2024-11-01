import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { es } from "date-fns/locale";
import { LendingColumn } from "./components/columns";
import { LendingsClient } from "./components/client";


export const metadata = {
    title: "Prestamos",
}

const LendingsPage = async (
    props: {
        searchParams: Promise<{ status: string }>
    }
) => {
    const searchParams = await props.searchParams;  // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).
    let lendings;

    if (searchParams.status === 'activos') {
        // Currently active/pending lendings, books that are yet to be returned.
        lendings = await prismadb.prestamo.findMany({
            where: {
                fechaDevolucionFinal: null
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    } else if (searchParams.status === 'vencidos') {
        // Expired lendings, books that are yet to be returned after the agreed return date.
        const todayDate = new Date().setHours(0, 0, 0, 0);
        lendings = await prismadb.prestamo.findMany({
            where: {
                fechaDevolucionFinal: null,
                fechaDevolucionEstipulada: {
                    lt: new Date(todayDate)
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    } else if (searchParams.status === 'devueltos') {
        // Returned books.
        lendings = await prismadb.prestamo.findMany({
            where: {
                fechaDevolucionFinal: {
                    not: null
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    } else {
        // fetch all lendings
        lendings = await prismadb.prestamo.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    const today = new Date();

    const formattedLendings: LendingColumn[] = lendings.map((lending) => ({
        "Nº de préstamo": lending.id.toString(),
        inventario: lending.idLibro.toString(),
        socio: lending.idSocio.toString(),
        efectuado: format(lending.fechaPrestado, "dd MMMM, yyyy", { locale: es }),
        "Vencimiento": format(lending.fechaDevolucionEstipulada, "dd MMMM, yyyy", { locale: es }),
        "Devolución": lending.fechaDevolucionFinal ? format(lending.fechaDevolucionFinal, "dd MMMM, yyyy", { locale: es })
            : today > lending.fechaDevolucionEstipulada ? "VENCIDO" : "ACTIVO",
        registro: format(lending.createdAt, "dd MMMM, yyyy", { locale: es }),
        actualizado: format(lending.updatedAt, "dd MMMM, yyyy", { locale: es })
    }));



    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <LendingsClient data={formattedLendings} />
            </div>
        </div>
    );
}

export default LendingsPage;