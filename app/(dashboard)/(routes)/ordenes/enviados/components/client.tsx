"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { SentOrderColumn, columns } from "./columns";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Toggle } from "@/components/ui/toggle";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SentClientProps {
    data: SentOrderColumn[]
}

export const SentClient: React.FC<SentClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const daily = searchParams.get('daily') === "true";

    return (
        <>
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background py-4">
                <Heading
                    title={daily ? `Pedidos enviados del día (${data.length})` : `Pedidos enviados (${data.length})`}
                    description={daily ? "Pedidos del día asignados a repartidores" : "Pedidos asignados a repartidores"}
                />
                <Toggle
                    aria-label="Toggle bold"
                    pressed={daily}
                    onPressedChange={(pressed) => pressed.valueOf() ? router.push(`/${params.storeId}/ordenes/enviados?daily=true`) : router.push(`/${params.storeId}/ordenes/enviados`)}
                >
                    <Check className={cn("mr-2 h-4 w-4", !daily && "hidden")} />
                    Pedidos del día
                </Toggle>
            </div>
            <Separator />
            <DataTable filterKey="createdAt" columns={columns} data={data} />
        </>
    )
}