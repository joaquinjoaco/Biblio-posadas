import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { Driver, Order } from "@prisma/client";

export const metadata = {
    title: "Pedidos",
}

export const revalidate = 0;

const OrdersPage = async ({
    params,
    searchParams,
}: {
    params: { storeId: string },
    searchParams: { daily: string },
}) => {
    // fetch all orders from the store
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            driver: true,
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    const formatOrders = (orders: (Order & { driver: Driver | null })[]) => {
        // Returns a formatted array that satisfies the OrderColumn type.
        const formattedOrders: OrderColumn[] = orders.map((order) => ({
            id: order.id,
            status: order.status.toUpperCase(),
            clientId: order.clientId,
            driverPhone: order.driver ? order.driver.phone : "",
            driverName: order.driver ? order.driver.name : "-",
            deliveryZoneName: order.deliveryZoneName,
            deliveryZoneCost: formatter.format(Number(order.deliveryZoneCost)),
            deliveryAddress: order.deliveryAddress,
            deliveryName: order.deliveryName,
            deliveryPhone: order.deliveryPhone,
            differentAddress: order.differentAddress,
            payment: order.payment.toUpperCase(),
            notes: order.notes,

            totalPrice: formatter.format(Number(order.totalPrice)),
            totalPriceNumber: Number(order.totalPrice),

            updatedAtDate: order.updatedAt,
            updatedAt: format(order.updatedAt, "dd MMMM, yyyy HH:mm", { locale: es }),
            createdAt: format(order.updatedAt, "dd MMMM, yyyy HH:mm", { locale: es }),
            storeId: order.storeId,
        }));

        return formattedOrders;
    }

    const filterOrders = (orders: (Order & { driver: Driver | null })[]) => {
        // Returns a filtered array with only today's orders if daily param is true.

        if (searchParams.daily === "true") {
            // Get today's date and set Hours, minutes, seconds, and miliseconds to 0 for accurate comparison.
            const todayDate = new Date().setHours(0, 0, 0, 0);
            // Filter the orders that have been created (or updated) today.
            const dailyOrders = orders.filter(order => {
                // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison
                const updatedAtDate = new Date(order.updatedAt).setHours(0, 0, 0, 0);
                return updatedAtDate === todayDate;
            });
            return dailyOrders;
        } else {
            // return all orders
            return orders;
        }
    }

    const filteredOrders = filterOrders(orders);
    const processedOrders = formatOrders(filteredOrders);

    // Only calculate the daily revenue when daily param is true.
    const allDailyRevenue = searchParams.daily === "true" ?
        filteredOrders.reduce((total, order) => {
            return order.status === "enviado" ? total + Number(order.totalPrice) : total
        }, 0)
        : 0;

    const posDailyRevenue = searchParams.daily === "true" ?
        filteredOrders.reduce((total, order) => {
            return order.status === "enviado" && order.payment === "pos" ? total + Number(order.totalPrice) : total
        }, 0)
        : 0;
    const efectivoDailyRevenue = searchParams.daily === "true" ?
        filteredOrders.reduce((total, order) => {
            return order.status === "enviado" && order.payment === "efectivo" ? total + Number(order.totalPrice) : total
        }, 0)
        : 0;

    const transferenciaDailyRevenue = searchParams.daily === "true" ?
        filteredOrders.reduce((total, order) => {
            return order.status === "enviado" && order.payment === "transferencia" ? total + Number(order.totalPrice) : total
        }, 0)
        : 0;

    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6t">
                    <OrderClient
                        data={processedOrders}
                        allDailyRevenue={allDailyRevenue}
                        posDailyRevenue={posDailyRevenue}
                        efectivoDailyRevenue={efectivoDailyRevenue}
                        transferenciaDailyRevenue={transferenciaDailyRevenue}
                    />
                </div>
            </div>
        </>
    );
}

export default OrdersPage;