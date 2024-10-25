import prismadb from "@/lib/prismadb";
import OrderForm from "./components/order-form";


const OrderViewPage = async ({
    params
}: {
    params: { storeId: string, orderId: string }
}) => {

    const order = await prismadb.order.findUnique({
        where: {
            id: params.orderId
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                }
            },
            client: {
                include: {
                    addresses: {
                        include: { zone: true }
                    },
                }
            },
            driver: true
        }
    });

    const clients = await prismadb.client.findMany({
        where: {
            storeId: params.storeId,
            isArchived: false,
        },
        include: {
            addresses: {
                include: { zone: true }
            },
        },
        orderBy: {
            createdAt: 'asc',
        }
    });

    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId,
            isArchived: false,
        }
    });

    const zones = await prismadb.zone.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            cost: 'asc'
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderForm initialData={order} products={products} clients={clients} zones={zones} />
            </div>
        </div>
    );
};

export default OrderViewPage;