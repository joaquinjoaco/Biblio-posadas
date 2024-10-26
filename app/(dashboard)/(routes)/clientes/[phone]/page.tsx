import prismadb from "@/lib/prismadb";
import { ClientForm } from "./components/client-form";

const ClientPage = async (
    props: {
        params: Promise<{ storeId: string, phone: string }>
    }
) => {
    const params = await props.params;

    const client = await prismadb.client.findUnique({
        where: {
            phone: params.phone
        },
        include: {
            addresses: true,
        },
    });

    const zones = await prismadb.zone.findMany({
        where: {
            storeId: params.storeId,
        }
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ClientForm initialData={client} zones={zones} />
            </div>
        </div>
    );
}

export default ClientPage;