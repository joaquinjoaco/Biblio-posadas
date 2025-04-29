import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { es } from "date-fns/locale";
import { MemberColumn } from "./components/columns";
import { MembersClient } from "./components/client";

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
        "ID": socio.id.toString(),
        "Cédula": socio.ci?.toString() ?? "-",
        "Nombre": socio.nombre,
        "Apellido": socio.apellido,
        "Dirección": socio.direccion,
        "Teléfono": socio.telefono,
        "Ubicación": socio.ubicacion,

        isArchived: socio.isArchived,
        isArchivedText: socio.isArchived ? "Archivado" : "No",

        "Registro": format(socio.createdAt, "dd MMMM, yyyy", { locale: es }),
        "Actualizado": format(socio.updatedAt, "dd MMMM, yyyy", { locale: es })
    }));

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <MembersClient data={formattedMembers} />
                </div>
            </div>
        </>
    );
}

export default SociosPage;