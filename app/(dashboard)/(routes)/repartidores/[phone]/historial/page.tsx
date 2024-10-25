import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DriverOrderHistoryColumn } from "./components/columns";
import { DriverOrderHistoryClient } from "./components/client";

export const metadata = {
    title: "Pedidos del repartidor",
}


const DriverOrderHistoryPage = async ({
    params,
    searchParams,
}: {
    params: { storeId: string, phone: string },
    searchParams: { daily: string },
}) => {

    // fetch all orders from the store
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId,
            driverId: params.phone,
        },
        include: {
            driver: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const driver = await prismadb.driver.findFirst({
        where: {
            storeId: params.storeId,
            phone: params.phone,
        }
    })

    const formatOrders = (orders: any) => {
        const formattedOrders: DriverOrderHistoryColumn[] = orders.map((order: any) => ({
            id: order.id,
            clientId: order.clientId,
            status: order.status.toUpperCase(),
            driverName: order.driver?.name,
            deliveryAddress: order.deliveryAddress,
            deliveryZoneName: `${order.deliveryZoneName} (${formatter.format(Number(order.deliveryZoneCost))})`,
            deliveryZoneCost: formatter.format(Number(order.deliveryZoneCost)),
            deliveryZoneCostNumber: Number(order.deliveryZoneCost),
            deliveryName: order.deliveryName,
            deliveryPhone: order.deliveryPhone,
            differentAddress: order.differentAddress,
            payment: order.payment.toUpperCase(),
            notes: order.notes,

            totalPrice: formatter.format(Number(order.totalPrice)),

            updatedAt: format(order.updatedAt, "dd MMMM, yyyy HH:mm", { locale: es }),
            updatedAtDate: order.updatedAt,
            createdAt: format(order.createdAt, "dd MMMM, yyyy", { locale: es }),
            createdAtTime: format(order.createdAt, "HH:mm", { locale: es }),
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
                <DriverOrderHistoryClient data={formatOrders(orders)} driver={driver} />
            </div>
        </div>
    );
};

export default DriverOrderHistoryPage;