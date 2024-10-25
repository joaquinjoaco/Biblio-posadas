"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { AssignOrderColumn, columns } from "./columns";
// import { Apilist } from "@/components/ui/api-list";

interface AssignClientProps {
    data: AssignOrderColumn[]
}

export const AssignClient: React.FC<AssignClientProps> = ({
    data
}) => {

    return (
        <>
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background py-4">
                <Heading
                    title={`Pedidos emitidos (${data.length})`}
                    description="Asigna pedidos a repartidores"
                />
            </div>
            <Separator />
            <DataTable filterKey="createdAt" columns={columns} data={data} />
            {/* <Heading title="API" description="Llamadas de API para los pedidos" />
            <Separator />
            <Apilist entityName="orders" entityIdName="orderId" /> */}
        </>
    )
}