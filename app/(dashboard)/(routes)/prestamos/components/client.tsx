"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Check, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { LendingColumn, columns } from "./columns";
import { LendingsDataTable } from "@/components/ui/lendings-data-table";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface LendingsClientProps {
    data: LendingColumn[];
}

export const LendingsClient: React.FC<LendingsClientProps> = ({
    data
}) => {

    const router = useRouter();
    const searchParams = useSearchParams()

    const status = searchParams.get('status')
    // const title = status === 'activos' ? `Préstamos activos (${data.length})`
    //     : status === 'vencidos' ? `Préstamos vencidos (${data.length})`
    //         : status === 'devueltos' ? `Préstamos devueltos (${data.length})`
    //             : `Préstamos (${data.length})`

    const generateSheet = () => {
        // Function to convert an array of objects to a worksheet.
        const sheetFromArrayOfObjects = (arrayOfObjects: LendingColumn[]) => {
            // Re-format the already formatted data prop to readable values for a human in a worksheet.
            const formattedArray = arrayOfObjects.map((item) => ({
                "ID": item["Nº de préstamo"],
                "Nº de inventario del libro": item["Inventario"],
                "ID del socio": item["Socio"],
                "Efectuado": item["Efectuado"],
                "Vencimiento": item["Vencimiento"],
                "Devolución": item["Devolución"],
                "Fecha de registro": item["Registro"],
                "Fecha de actualización": item["Actualizado"],
            }));
            const worksheet = XLSX.utils.json_to_sheet(formattedArray);
            return worksheet;
        };

        // Create a workbook.
        const workbook = XLSX.utils.book_new();
        // Add a worksheet with product data.
        XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(data), 'Prestamos');
        // Save the workbook to a file (starts a download).
        XLSX.writeFile(workbook, 'Prestamos.xlsx');
    }

    return (
        <>
            <div className="flex items-center space-x-16 2xl:space-x-0 2xl:justify-between sticky top-0 z-10 bg-background py-4">
                <Heading
                    title={`Préstamos ${status || ""} (${data.length})`}
                    description="Administra los préstamos de la biblioteca"
                />
                <div className="flex gap-x-2">
                    <Toggle
                        variant={"default"}
                        pressed={status === "activos"}
                        onPressedChange={(pressed) => pressed.valueOf() ? router.push(`/prestamos?status=activos`) : router.push(`/prestamos`)}
                    >
                        <Check className={cn("mr-2 h-4 w-4", status !== "activos" && "hidden")} />

                        Activos
                    </Toggle>
                    <Toggle
                        variant={"default"}
                        pressed={status === "vencidos"}
                        onPressedChange={(pressed) => pressed.valueOf() ? router.push(`/prestamos?status=vencidos`) : router.push(`/prestamos`)}
                    >
                        <Check className={cn("mr-2 h-4 w-4", status !== "vencidos" && "hidden")} />
                        Vencidos
                    </Toggle>
                    <Toggle
                        variant={"default"}
                        pressed={status === "devueltos"}
                        onPressedChange={(pressed) => pressed.valueOf() ? router.push(`/prestamos?status=devueltos`) : router.push(`/prestamos`)}
                    >
                        <Check className={cn("mr-2 h-4 w-4", status !== "devueltos" && "hidden")} />
                        Devueltos
                    </Toggle>
                    <Button disabled={data.length === 0} onClick={() => generateSheet()} className="bg-[#107C41] hover:bg-[#1d6e42] dark:text-foreground" >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Generar archivo
                    </Button>
                </div>
            </div>
            <Separator />
            <LendingsDataTable columns={columns} data={data} />
        </>
    )
}