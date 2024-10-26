import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { CancelledClient } from "./components/client";
import { CancelledOrderColumn } from "./components/columns";

export const metadata = {
    title: "Cancelados",
}

const AssignPage = async (
    props: {
        params: Promise<{ storeId: string }>
    }
) => {
    const params = await props.params;
    // fetch all orders with status 'cancelado' from the store
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId,
            status: "cancelado",
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                }
            },
            driver: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const drivers = await prismadb.driver.findMany({
        where: {
            storeId: params.storeId,
        }
    });

    const formattedOrders: CancelledOrderColumn[] = orders.map((order) => ({
        id: order.id,
        status: order.status.toUpperCase(),
        clientId: order.clientId,
        driver: order.driver ? order.driver : null, // should never encounter second case in this page, but should encounter it in 'enviados' page...
        deliveryZoneName: order.deliveryZoneName,
        driverName: order.driver ? order.driver.name : "-", // should never encounter second case in this page, but should encounter it in 'enviados' page...
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
                    <CancelledClient data={formattedOrders} />
                </div>
            </div>
        </>
    );
}

export default AssignPage;