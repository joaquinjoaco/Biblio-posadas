"use client";

import { AlertCircle, Check, FileSpreadsheet, Plus } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { OrderColumn, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { cn, formatter } from "@/lib/utils";
import { getRecentlyUpdatedOrdersCount } from "@/actions/get-recently-updated-orders-count";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { Badge } from "@/components/ui/badge";

export const revalidate = 0;

interface OrderClientProps {
    data: OrderColumn[];
    allDailyRevenue: number;
    posDailyRevenue: number;
    efectivoDailyRevenue: number;
    transferenciaDailyRevenue: number;
}

export const OrderClient: React.FC<OrderClientProps> = ({
    data,
    allDailyRevenue,
    posDailyRevenue,
    efectivoDailyRevenue,
    transferenciaDailyRevenue,
}) => {

    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const daily = searchParams.get('daily') === "true";
    const [updatedOrdersCount, setUpdatedOrdersCount] = useState(0);

    // Formats an array of objects into a readable worksheet.
    const formatIntoWorksheet = (arrayOfObjects: OrderColumn[]) => {
        const formattedArray = arrayOfObjects.map((item) => ({
            Estado: item.status,
            Repartidor: item.driverName,
            Cliente: item.clientId,
            Zona: item.deliveryZoneName,
            Costo_zona: item.deliveryZoneCost,
            Dirección: item.deliveryAddress,
            Total: item.totalPrice,
            Metodo_de_pago: item.payment,
            Fecha_emisión: item.createdAt,
            Fecha_actualización: item.updatedAt,
        }));
        const worksheet = XLSX.utils.json_to_sheet(formattedArray);
        return worksheet;
    }


    const generateSheet = () => {
        // Get today's date and set Hours, minutes, seconds, and miliseconds to 0 for accurate comparison.
        const todayDate = new Date().setHours(0, 0, 0, 0);
        // Workbook to append the sheets.
        const workbook = XLSX.utils.book_new();

        // Filter orders that have been assigned/created/updated today.
        const todaysOrders = data.filter(order => {
            // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison
            const updatedAtDate = new Date(order.updatedAtDate).setHours(0, 0, 0, 0);
            return updatedAtDate === todayDate;
        });

        if (daily) {
            // Sheet with todays summary
            const todaysSummarySheet = XLSX.utils.json_to_sheet(
                [
                    { // Row 1
                        "": "Cantidades",
                        "Pedidos del dia": todaysOrders.length,
                        POS: todaysOrders.filter((order) => {
                            return order.payment === "POS";
                        }).length,
                        EFECTIVO: todaysOrders.filter((order) => {
                            return order.payment === "EFECTIVO";
                        }).length,
                        TRANSFERENCIA: todaysOrders.filter((order) => {
                            return order.payment === "TRANSFERENCIA";
                        }).length,
                    },
                    { // Row 2
                        "": "Totales (UYU)",
                        "Pedidos del dia": formatter.format(todaysOrders.reduce((total, order) => {
                            return total + Number(order.totalPriceNumber)
                        }, 0)),
                        POS: formatter.format(todaysOrders.filter((order) => {
                            return order.payment === "POS";
                        }).reduce((total, order) => {
                            return total + Number(order.totalPriceNumber)
                        }, 0)),
                        EFECTIVO: formatter.format(todaysOrders.filter((order) => {
                            return order.payment === "EFECTIVO";
                        }).reduce((total, order) => {
                            return total + Number(order.totalPriceNumber)
                        }, 0)),
                        TRANSFERENCIA: formatter.format(todaysOrders.filter((order) => {
                            return order.payment === "TRANSFERENCIA";
                        }).reduce((total, order) => {
                            return total + Number(order.totalPriceNumber)
                        }, 0)),
                    },
                ],
            );

            // Sheet with todays orders
            const todaysOrdersSheet = formatIntoWorksheet(todaysOrders);

            // Sheet with todays 'POS' orders
            const todaysOrdersSheetPOS = formatIntoWorksheet(todaysOrders.filter(order => {
                return order.payment === "POS";
            }));

            // Sheet with todays 'EFECTIVO' orders
            const todaysOrdersSheetEFECTIVO = formatIntoWorksheet(todaysOrders.filter(order => {
                return order.payment === "EFECTIVO";
            }));

            // Sheet with todays 'TRANSFERENCIA' orders
            const todaysOrdersSheetTRANSFERENCIA = formatIntoWorksheet(todaysOrders.filter(order => {
                return order.payment === "TRANSFERENCIA";
            }));

            XLSX.utils.book_append_sheet(workbook, todaysSummarySheet, 'Resumen del día');
            XLSX.utils.book_append_sheet(workbook, todaysOrdersSheet, 'Pedidos de del día');
            XLSX.utils.book_append_sheet(workbook, todaysOrdersSheetPOS, 'Pedidos del día (POS)');
            XLSX.utils.book_append_sheet(workbook, todaysOrdersSheetEFECTIVO, 'Pedidos del día (EFECTIVO)');
            XLSX.utils.book_append_sheet(workbook, todaysOrdersSheetTRANSFERENCIA, 'Pedidos del día (TRANSFERENCIA)');
        } else {
            // Sheet with all orders
            const allOrdersSheet = formatIntoWorksheet(data)
            XLSX.utils.book_append_sheet(workbook, allOrdersSheet, 'Todos los pedidos');
        }

        // Save the workbook to a file (starts a download).
        // XLSX.writeFile(workbook, `${driver?.name}_${format(todayDate, "dd/MM/yy", { locale: es })}.xlsx`);
        XLSX.writeFile(workbook, `Pedidos.xlsx`);
    }




    const getCountFromServer = async () => {
        // Get orders count from a server action (new or updated at the current time).
        try {
            const newCount = await getRecentlyUpdatedOrdersCount(params.storeId.toString());
            if (newCount > 0) {
                setUpdatedOrdersCount(updatedOrdersCount + newCount);
            }
        } catch (error) {
            console.error("Error al contar las órdenes del día: ", error);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getCountFromServer();
        }, 6000); // runs every 6 seconds.
        return () => clearInterval(interval);
    }, [updatedOrdersCount]);


    return (
        <>
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background py-4">
                <div className="flex flex-col items-start">
                    <Heading
                        title={daily ? `Pedidos del día (${data.length})` : `Pedidos (${data.length})`}
                        description={daily ? "Vista general de los pedidos del día del negocio" : "Vista general de todos los pedidos del negocio"}
                        className=""
                    />
                </div>
                <div className="flex gap-x-2">
                    {/* Excel button */}
                    {daily &&
                        <Button disabled={data.length === 0} onClick={() => generateSheet()} className="bg-[#107C41] hover:bg-[#1d6e42] dark:text-foreground" >
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Generar archivo
                        </Button>
                    }
                    {/* Daily filter toggle */}
                    <Toggle
                        aria-label="Toggle daily"
                        pressed={daily}
                        onPressedChange={(pressed) => pressed.valueOf() ? router.push(`/${params.storeId}/ordenes?daily=true`) : router.push(`/${params.storeId}/ordenes`)}
                    >
                        <Check className={cn("mr-2 h-4 w-4", !daily && "hidden")} />
                        Pedidos del día
                    </Toggle>
                    {/* New service button */}
                    <Button onClick={() => { router.push(`/${params.storeId}/ordenes/nuevo`) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo pedido
                    </Button>
                </div>
            </div>
            {daily &&
                <div className="flex flex-col gap-x-2 truncate max-w-fit">
                    <Badge className="mb-2">Total del día: {formatter.format(allDailyRevenue)}</Badge>
                    <Badge className="mb-2">Total del día (POS): {formatter.format(posDailyRevenue)}</Badge>
                    <Badge className="mb-2">Total del día (EFECTIVO): {formatter.format(efectivoDailyRevenue)}</Badge>
                    <Badge className="mb-2">Total del día (TRANSFERENCIA): {formatter.format(transferenciaDailyRevenue)}</Badge>
                </div>
            }

            {updatedOrdersCount > 0 &&
                <TooltipWrapper content="Actualizar" className="mt-4">
                    <Button
                        onClick={() => {
                            setUpdatedOrdersCount(0);
                            router.refresh();
                        }}
                        size="sm"
                        className="bg-red-500 hover:bg-red-500/90"
                    >
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Hay {updatedOrdersCount} {updatedOrdersCount > 1 ? "pedidos nuevos o actualizados" : "pedido nuevo o actualizado"}
                    </Button>
                </TooltipWrapper>
            }
            <Separator />
            <DataTable filterKey="createdAt" columns={columns} data={data} />
        </>
    )
}