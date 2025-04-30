import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { es } from "date-fns/locale";
import { MemberHistoryClient } from "./components/client";
import { LendingColumn } from "./components/columns";
import lendings_api from "@/lib/lendings_api";

export const metadata = {
    title: "Historial",
}

const MemberHistoryPage = async (
    props: {
        params: Promise<{ id: string }>
        searchParams: Promise<{ historico: string }>
    }
) => {
    const params = await props.params
    const searchParams = await props.searchParams
    const historic = searchParams.historico === "true";

    const { id } = await params // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).

    let lendings;

    if (historic) {
        lendings = await lendings_api.lendings.all(Number(id));
    } else {
        // Only their active and expired lendings.
        const expiredLendings = await lendings_api.lendings.expired(Number(id));
        const activeLendings = await lendings_api.lendings.active(Number(id));

        lendings = [...expiredLendings, ...activeLendings]
    }

    const member = await prismadb.socio.findUnique({
        where: {
            id: Number(id)
        }
    })

    const today = new Date();

    const formattedLendings: LendingColumn[] = lendings.map((lending) => ({
        "Nº de préstamo": lending.id.toString(),
        "Inventario": lending.idLibro.toString(),
        "Socio": lending.idSocio.toString(),
        "Efectuado": format(lending.fechaPrestado, "dd MMMM, yyyy", { locale: es }),
        "Vencimiento": format(lending.fechaDevolucionEstipulada, "dd MMMM, yyyy", { locale: es }),
        "Devolución": lending.fechaDevolucionFinal ? format(lending.fechaDevolucionFinal, "dd MMMM, yyyy", { locale: es })
            : today > lending.fechaDevolucionEstipulada ? "VENCIDO" : "ACTIVO",
        "Registro": format(lending.createdAt, "dd MMMM, yyyy", { locale: es }),
        "Actualizado": format(lending.updatedAt, "dd MMMM, yyyy", { locale: es })
    }));

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6t">
                    <MemberHistoryClient data={formattedLendings} member={member} />
                </div>
            </div>
        </>
    );
}

export default MemberHistoryPage;