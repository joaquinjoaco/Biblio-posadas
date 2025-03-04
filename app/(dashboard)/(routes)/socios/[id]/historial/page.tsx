import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { es } from "date-fns/locale";
import { LendingColumn } from "../../../prestamos/components/columns";
import { MemberHistoryClient } from "./components/client";
import { Header } from "@/components/ui/header";


export const metadata = {
    title: "Historial",
}

const MemberHistoryPage = async (
    props: {
        params: Promise<{ id: string }>
    }
) => {
    const params = await props.params

    const { id } = await params // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).

    const lendings = await prismadb.prestamo.findMany({
        where: {
            idSocio: Number(id),
        }
    })

    const member = await prismadb.socio.findUnique({
        where: {
            id: Number(id)
        }
    })

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

    const breadcrumbs = [
        {
            name: `Socios`,
            url: '/socios'
        },
        {
            name: `Préstamos de ${member?.nombre} ${member?.apellido}`,
            url: `/socios/${id}/historial`
        }
    ]
    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6t">
                    <MemberHistoryClient data={formattedLendings} member={member} />
                </div>
            </div>
        </>
    );
}

export default MemberHistoryPage;