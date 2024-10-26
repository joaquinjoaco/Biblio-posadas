import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { es } from "date-fns/locale";


export const metadata = {
    title: "Productos",
}

const ProductsPage = async (
    props: {
        params: Promise<{ storeId: string }>
    }
) => {
    const params = await props.params;
    // fetch all products from the store
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        isArchived: item.isArchived,
        isArchivedText: item.isArchived ? "Archivado" : "-",
        price: formatter.format(item.price.toNumber()),
        iva: item.iva.toNumber(),

        createdAt: format(item.createdAt, "dd MMMM, yyyy", { locale: es }),
        updatedAt: format(item.updatedAt, "dd MMMM, yyyy", { locale: es })
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6t">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    );
}

export default ProductsPage;