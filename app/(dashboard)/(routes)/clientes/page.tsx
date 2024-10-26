import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { ClientsClient } from "./components/client";
import { ClientColumn } from "./components/columns";
import { es } from "date-fns/locale";

export const metadata = {
    title: "Clientes",
}

const ClientsPage = async (
    props: {
        params: Promise<{ storeId: string }>,
        searchParams: Promise<{ type: string }>
    }
) => {
    const searchParams = await props.searchParams;
    const params = await props.params;
    // fetch all billboards from the store
    const clients = await prismadb.client.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            addresses: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedClients: ClientColumn[] = clients.map((item: any) => ({
        phone: item.phone,
        typeText: item.type.toUpperCase(),
        type: item.type,
        name: item.name ? item.name : "-",
        ruc: item.ruc ? item.ruc : "-",
        socialReason: item.socialReason ? item.socialReason : "-",
        address: item.addresses.length > 0 ? item.addresses[0].address : "-", // first address in the array
        discount: Number(item.discount) === 0 ? "-" : item.discount + "%",
        isArchived: item.isArchived,
        isArchivedText: item.isArchived ? "Archivado" : "-",
        createdAt: format(item.createdAt, "dd MMMM, yyyy", { locale: es }),
        updatedAt: format(item.updatedAt, "dd MMMM, yyyy", { locale: es }),
    }));

    const filterClients = () => {
        const type = searchParams.type;
        // Return 'particulares' or 'empresas' if the searchParam is valid.
        if (type === "particular" || type === "empresa") {
            const filteredClients = formattedClients.filter(client => {
                return client.type === type;
            });
            return filteredClients;
        } else {
            return formattedClients;
        }
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6t">
                <ClientsClient data={filterClients()} formattedClients={formattedClients} />
            </div>
        </div>
    );
}

export default ClientsPage;