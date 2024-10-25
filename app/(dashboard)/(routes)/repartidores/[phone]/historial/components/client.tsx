"use client";

import { ArrowLeft, Check, FileSpreadsheet } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import * as XLSX from 'xlsx';
import { es } from "date-fns/locale";

import { Driver } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { DriverOrderHistoryColumn, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { cn, formatter } from "@/lib/utils";
import { format } from "date-fns";

interface DriverOrderHistoryClientProps {
    data: DriverOrderHistoryColumn[];
    driver: Driver | null;
}

export const DriverOrderHistoryClient: React.FC<DriverOrderHistoryClientProps> = ({
    data,
    driver
}) => {

    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const daily = searchParams.get('daily') === "true";

    const totalRevenue = daily ? data.reduce((total, Item) => {
        return total + Item.deliveryZoneCostNumber
    }, 0) : 0;

    // Formats an array of objects into a readable worksheet.
    const formatIntoWorksheet = (arrayOfObjects: DriverOrderHistoryColumn[]) => {
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
                [{
                    Pedidos_del_dia: todaysOrders.length,
                    POS: todaysOrders.filter((order) => {
                        return order.payment === "POS";
                    }).length,
                    EFECTIVO: todaysOrders.filter((order) => {
                        return order.payment === "EFECTIVO";
                    }).length,
                    TRANSFERENCIA: todaysOrders.filter((order) => {
                        return order.payment === "TRANSFERENCIA";
                    }).length,
                    Ganancias_del_dia: formatter.format(totalRevenue),
                }]
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
        }
        //  else {
        //     // Sheet with all orders
        //     const allOrdersSheet = formatIntoWorksheet(data)
        //     XLSX.utils.book_append_sheet(workbook, allOrdersSheet, 'Todos los pedidos');
        // }

        // Save the workbook to a file (starts a download).
        XLSX.writeFile(workbook, `${driver?.name}_${format(todayDate, "dd/MM/yy", { locale: es })}.xlsx`);
    }

    return (
        <>
            {driver ?
                <>
                    <div className="flex items-center justify-between sticky top-0 z-10 bg-background py-4">
                        <Heading
                            title={daily ? `Pedidos del día tomados (${data.length})` : `Pedidos tomados (${data.length})`}
                            description={daily ? `Ganancias del día de ${driver?.name} ${formatter.format(totalRevenue)}` : `Todos los pedidos tomados por ${driver?.name}`}
                        />
                        <div className="flex gap-x-2">
                            {/* Daily orders toggle */}
                            <Toggle
                                aria-label="Toggle bold"
                                pressed={daily}
                                onPressedChange={(pressed) => pressed.valueOf() ? router.push(`/${params.storeId}/repartidores/${params.phone}/historial?daily=true`) : router.push(`/${params.storeId}/repartidores/${params.phone}/historial`)}
                            >
                                <Check className={cn("mr-2 h-4 w-4", !daily && "hidden")} />
                                Pedidos del día
                            </Toggle>
                            {/* Excel button */}
                            {daily &&
                                <Button disabled={data.length === 0} onClick={() => generateSheet()} className="bg-[#107C41] hover:bg-[#1d6e42] dark:text-foreground" >
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                    Generar archivo
                                </Button>
                            }
                            {/* Back button */}
                            <Button
                                type="button"
                                variant="secondary"
                                // size="sm"
                                className="gap-x-2"
                                onClick={() => router.push(`/${params.storeId}/repartidores/`)}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver
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
                            <CardDescription>No encontramos un repartidor con el número {params.phone}</CardDescription>

                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => router.push(`/${params.storeId}/repartidores/`)}
                                >
                                    Ir a repartidores
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            }
        </>
    )
}