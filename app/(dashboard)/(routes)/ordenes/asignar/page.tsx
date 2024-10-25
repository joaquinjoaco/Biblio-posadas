import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { AssignClient } from "./components/client";
import { AssignOrderColumn } from "./components/columns";

export const metadata = {
    title: "Asignar pedidos",
}

const AssignPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    // fetch all orders with status 'emitido' from the store.
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId,
            status: "emitido",
        },
        include: {
            driver: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // non archived drivers.
    const drivers = await prismadb.driver.findMany({
        where: {
            storeId: params.storeId,
            isArchived: false,
        }
    });

    const formattedOrders: AssignOrderColumn[] = orders.map((order) => ({
        id: order.id,
        status: order.status.toUpperCase(),
        clientId: order.clientId,
        driver: order.driver ? order.driver : null, // should never encounter second case in this page, but should encounter it in 'enviados' page...
        driverName: order.driver ? order.driver.name : "-", // should never encounter second case in this page, but should encounter it in 'enviados' page...
        deliveryZoneName: order.deliveryZoneName,
        deliveryAddress: order.deliveryAddress,
        deliveryName: order.deliveryName,
        deliveryPhone: order.deliveryPhone,
        differentAddress: order.differentAddress,
        payment: order.payment.toUpperCase(),
        notes: order.notes,

        totalPrice: formatter.format(Number(order.totalPrice)),

        updatedAt: format(order.updatedAt, "dd MMMM, yyyy HH:mm", { locale: es }),
        createdAt: format(order.createdAt, "dd MMMM, yyyy HH:mm", { locale: es }),
        // createdAtTime: format(order.createdAt, "HH:mm", { locale: es }),

        drivers: drivers, // Maybe not the best decision... should just fetch them in AssignModal
    }));

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6t">
                    <AssignClient data={formattedOrders} />
                </div>
            </div>
        </>
    );
}

export default AssignPage;