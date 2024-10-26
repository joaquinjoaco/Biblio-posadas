import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { SentClient } from "./components/client";
import { SentOrderColumn } from "./components/columns";

export const metadata = {
    title: "Enviados",
}

const AssignPage = async (
    props: {
        params: Promise<{ storeId: string }>
        searchParams: Promise<{ daily: string }>,
    }
) => {
    const searchParams = await props.searchParams;
    const params = await props.params;
    // fetch all orders with status 'emitido' from the store
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId,
            status: "enviado",
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

    // non archived drivers.
    const drivers = await prismadb.driver.findMany({
        where: {
            storeId: params.storeId,
            isArchived: false,
        }
    });

    const formatOrders = (orders: any) => {
        const formattedOrders: SentOrderColumn[] = orders.map((order: any) => ({
            id: order.id,
            status: order.status.toUpperCase(),
            clientId: order.clientId,
            driver: order.driver,
            driverName: order.driver.name,
            deliveryZoneName: order.deliveryZoneName,
            deliveryAddress: order.deliveryAddress,
            deliveryName: order.deliveryName,
            deliveryPhone: order.deliveryPhone,
            differentAddress: order.differentAddress,
            payment: order.payment.toUpperCase(),
            notes: order.notes,

            totalPrice: formatter.format(Number(order.totalPrice)),
            updatedAtDate: order.updatedAt,
            updatedAt: format(order.updatedAt, "dd MMMM, yyyy HH:mm", { locale: es }),
            createdAt: format(order.createdAt, "dd MMMM, yyyy HH:mm", { locale: es }),

            drivers: drivers, // Maybe not the best decision... should just fetch them in AssignModal
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
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6t">
                    <SentClient data={formatOrders(orders)} />
                </div>
            </div>
        </>
    );
}

export default AssignPage;