import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ClientOrderHistoryColumn } from "./components/columns";
import { ClientOrderHistoryClient } from "./components/client";

export const metadata = {
    title: "Historial de pedidos",
}

const ClientOrderHistoryPage = async ({
    params,
    searchParams,
}: {
    params: { storeId: string, phone: string },
    searchParams: { daily: string },

}) => {
    // fetch all orders from the client
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId,
            clientId: params.phone,
        },
        include: {
            client: true,
            driver: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const client = await prismadb.client.findFirst({
        where: {
            storeId: params.storeId,
            phone: params.phone,
        }
    });

    const formatOrders = (orders: any) => {
        const formattedOrders: ClientOrderHistoryColumn[] = orders.map((order: any) => ({
            id: order.id,
            status: order.status.toUpperCase(),
            clientId: order.clientId,
            driverPhone: order.driver ? order.driver.phone : "",
            driverName: order.driver ? order.driver.name : "-",
            deliveryZoneName: order.deliveryZoneName,
            deliveryAddress: order.deliveryAddress,
            deliveryName: order.deliveryName,
            deliveryPhone: order.deliveryPhone,
            differentAddress: order.differentAddress,
            payment: order.payment.toUpperCase(),
            notes: order.notes,

            totalPrice: formatter.format(Number(order.totalPrice)),

            updatedAtDate: format(order.updatedAt, "dd MMMM, yyyy HH:mm", { locale: es }),
            createdAt: format(order.createdAt, "dd MMMM, yyyy HH:mm", { locale: es }),
            storeId: order.storeId,
        }));

        // Return daily orders or all orders.
        if (searchParams.daily === "true") {
            // Get today's date and set Hours, minutes, seconds, and miliseconds to 0 for accurate comparison.
            const todayDate = new Date().setHours(0, 0, 0, 0);

            // Filter the orders that have been created (or updated) today.
            const dailyOrders = formattedOrders.filter(order => {
                // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison
                const updatedAtDate = new Date(order.updatedAtDate).setHours(0, 0, 0, 0);
                return updatedAtDate === todayDate;
            });
            return dailyOrders;

        } else {
            // return all orders
            return formattedOrders;
        }
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ClientOrderHistoryClient data={formatOrders(orders)} client={client} />
            </div>
        </div>
    );
};

export default ClientOrderHistoryPage;