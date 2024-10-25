"use client";

import { ArrowLeft, Check } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { ClientOrderHistoryColumn, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Client } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ClientOrderHistoryClientProps {
    data: ClientOrderHistoryColumn[];
    client: Client | null;
}

export const ClientOrderHistoryClient: React.FC<ClientOrderHistoryClientProps> = ({
    data,
    client
}) => {

    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const daily = searchParams.get('daily') === "true";

    return (
        <>
            {client ?
                <>
                    <div className="flex items-center justify-between sticky top-0 z-10 bg-background py-4">
                        <div className="space-y-2">
                            <Heading
                                title={daily ? `Historial de pedidos del día (${data.length})` : `Historial de pedidos (${data.length})`}
                                description={daily ? `Los pedidos del día realizados por ${client?.name}` : `Todos los pedidos realizados por ${client?.name}`}
                            />
                            <Badge>{client.type.toUpperCase()}</Badge>
                        </div>
                        <div className="flex gap-x-2">
                            {/* Daily orders toggle */}
                            <Toggle
                                aria-label="Toggle bold"
                                pressed={daily}
                                onPressedChange={(pressed) => pressed.valueOf() ? router.push(`/${params.storeId}/clientes/${params.phone}/historial?daily=true`) : router.push(`/${params.storeId}/clientes/${params.phone}/historial`)}
                            >
                                <Check className={cn("mr-2 h-4 w-4", !daily && "hidden")} />
                                Pedidos del día
                            </Toggle>
                            {/* Back button */}
                            <Button
                                type="button"
                                variant="secondary"
                                // size="sm"
                                className="gap-x-2"
                                onClick={() => router.push(`/${params.storeId}/clientes/`)}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver a clientes
                            </Button>
                        </div>
                    </div>
                    <Separator />
                    <DataTable filterKey="createdAt" columns={columns} data={data} />
                </>
                :
                <div className="flex items-center justify-center h-[80vh]">
                    <Card>
                        <CardHeader>
                            <CardTitle>¡Cuidado!</CardTitle>
                            <CardDescription>No encontramos un cliente con número {params.phone}</CardDescription>

                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => router.push(`/${params.storeId}/clientes/`)}
                                >
                                    Ir a clientes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            }
        </>
    )
}