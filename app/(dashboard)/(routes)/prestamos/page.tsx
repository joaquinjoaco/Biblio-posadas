import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { es } from "date-fns/locale";
import { LendingColumn } from "./components/columns";
import { LendingsClient } from "./components/client";


export const metadata = {
    title: "Prestamos",
}

const LendingsPage = async ({
    // params
}: {
        // params: {}
    }) => {
    // Fetch all books.
    const lendings = await prismadb.prestamo.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            libro: true,
            socio: true,
        }
    });

    const formattedLendings: LendingColumn[] = lendings.map((lending) => ({
        "Nº de préstamo": lending.id.toString(),
        inventario: lending.libro.inventario.toString(),
        socio: lending.socio.id.toString(),
        efectuado: format(lending.fechaPrestado, "dd MMMM, yyyy", { locale: es }),
        "Devolución estipulada": format(lending.fechaDevolucionEstipulada, "dd MMMM, yyyy", { locale: es }),
        "Devolución final": lending.fechaDevolucionFinal ? format(lending.fechaDevolucionFinal, "dd MMMM, yyyy", { locale: es }) : "PENDIENTE",
        registro: format(lending.createdAt, "dd MMMM, yyyy", { locale: es }),
        actualizado: format(lending.updatedAt, "dd MMMM, yyyy", { locale: es })
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6t">
                <LendingsClient data={formattedLendings} />
            </div>
        </div>
    );
}

export default LendingsPage;