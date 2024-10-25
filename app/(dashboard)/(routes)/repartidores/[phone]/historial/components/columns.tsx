"use client"
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-actions";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";

export type DriverOrderHistoryColumn = {
    id: string;
    clientId: string;
    status: string;
    driverName?: string;
    differentAddress: boolean;
    deliveryName: string;
    deliveryZoneName: string;
    deliveryZoneCost: string;
    deliveryZoneCostNumber: number;
    deliveryPhone: string;
    deliveryAddress: string;
    notes: string;
    payment: string;
    totalPrice: string;
    updatedAt: string;
    updatedAtDate: Date;
    createdAt: string;
    createdAtTime: string;
}

export const columns: ColumnDef<DriverOrderHistoryColumn>[] = [
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => <StatusBadge status={row.original.status as "emitido" | "enviado" | "cancelado"} />
    },
    {
        accessorKey: "driverName",
        header: "Repartidor",
    },
    {
        accessorKey: "clientId",
        header: "Cliente",
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
        accessorKey: "createdAtTime",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Hora
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "updatedAt",
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
