import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { DriversClient } from "./components/client";
import { DriverColumn } from "./components/columns";
import { es } from "date-fns/locale";


export const metadata = {
    title: "Repartidores",
}

const DriversPage = async (
    props: {
        params: Promise<{ storeId: string }>
    }
) => {
    const params = await props.params;
    // fetch all billboards from the store
    const drivers = await prismadb.driver.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            name: 'asc'
        }
    });

    const formattedDrivers: DriverColumn[] = drivers.map((item) => ({
        phone: item.phone,
        name: item.name,
        isArchived: item.isArchived,
        isArchivedText: item.isArchived ? "Archivado" : "-",
        createdAt: format(item.createdAt, "dd MMMM, yyyy", { locale: es }),
        updatedAt: format(item.updatedAt, "dd MMMM, yyyy", { locale: es }),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6t">
                <DriversClient data={formattedDrivers} />
            </div>
        </div>
    );
}

export default DriversPage;