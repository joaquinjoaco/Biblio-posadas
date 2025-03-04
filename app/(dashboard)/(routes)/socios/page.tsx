import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { es } from "date-fns/locale";
import { MemberColumn } from "./components/columns";
import { MembersClient } from "./components/client";
import { Header } from "@/components/ui/header";


export const metadata = {
    title: "Socios",
}

const SociosPage = async () => {
    // Fetch all books.
    const socios = await prismadb.socio.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedMembers: MemberColumn[] = socios.map((socio) => ({
        id: socio.id.toString(),
        nombre: socio.nombre,
        apellido: socio.apellido,
        direccion: socio.direccion,
        telefono: socio.telefono,
        ubicacion: socio.ubicacion,

        isArchived: socio.isArchived,
        isArchivedText: socio.isArchived ? "Archivado" : "No",

        registro: format(socio.createdAt, "dd MMMM, yyyy", { locale: es }),
        actualizado: format(socio.updatedAt, "dd MMMM, yyyy", { locale: es })
    }));

    const breadcrumbs = [
        {
            name: `Socios`,
            url: '/socios'
        }
    ]
    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <MembersClient data={formattedMembers} />
                </div>
            </div>
        </>
    );
}

export default SociosPage;