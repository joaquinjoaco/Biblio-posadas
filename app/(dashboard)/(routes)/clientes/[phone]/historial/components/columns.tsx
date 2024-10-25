"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import Link from "next/link";

export type ClientOrderHistoryColumn = {
    id: string;
    status: string;
    clientId: string;
    driverPhone: string;
    driverName: string;
    differentAddress: boolean;
    deliveryName: string;
    deliveryPhone: string;
    deliveryZoneName: string;
    deliveryAddress: string;
    notes: string;
    payment: string;
    totalPrice: string;
    updatedAtDate: Date;
    createdAt: string;
    storeId: string;
}

export const columns: ColumnDef<ClientOrderHistoryColumn>[] = [
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => <StatusBadge status={row.original.status as "emitido" | "enviado" | "cancelado"} />
    },
    {
        accessorKey: "clientId",
        header: "Cliente",
    },
    {
        accessorKey: "driverName",
        header: "Repartidor",
        cell: ({ row }) =>
            row.original.driverName === "-" ?
                <>
                    {row.original.driverName}
                </>
                :
                <TooltipWrapper
                    content="Historial del repartidor"
                    icon={<ExternalLink className="h-4 w-4" />}
                    className="flex flex-row items-center gap-x-2"
                >
                    <Link
                        href={`/${row.original.storeId}/repartidores/${row.original.driverPhone}/historial`}
                        target="_blank"
                        className="text-sky-600"
                    >
                        {row.original.driverName}
                    </Link>
                </TooltipWrapper>
    },
    {
        accessorKey: "deliveryZoneName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Zona
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "deliveryAddress",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Dirección del envío
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "totalPrice",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Total (UYU)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "payment",
        header: "Método de pago",
    },

    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fecha de emisión
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "updatedAtDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fecha de actualización
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
