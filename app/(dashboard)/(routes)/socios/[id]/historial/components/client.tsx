"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, FileSpreadsheet, Filter } from "lucide-react";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { LendingColumn, columns } from "./columns";
import { LendingsDataTable } from "@/components/ui/lendings-data-table";
import { Socio } from "@prisma/client";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useEffect } from "react";

interface MemberHistoryClientProps {
    data: LendingColumn[];
    member: Socio | null;
}

export const MemberHistoryClient: React.FC<MemberHistoryClientProps> = ({
    data,
    member
}) => {

    const router = useRouter()

    const searchParams = useSearchParams()
    const historic = searchParams.get('historico') === "true"

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
        XLSX.writeFile(workbook, `Prestamos ${member?.nombre} ${member?.apellido}.xlsx`);
    }

    useEffect(() => {
        document.title = `${member?.nombre} ${member?.apellido}`; // Set the document title.
    }, [historic])

    return (
        <>
            <div className="flex items-center space-x-16 2xl:space-x-0 2xl:justify-between sticky top-0 z-10 bg-background py-4">
                <Heading
                    title={`Préstamos de ${member?.nombre} ${member?.apellido} (${data.length})`}
                    description="Historial de los préstamos del socio"
                />
                <div className="flex gap-x-2">
                    {/* Back button */}
                    <Button
                        disabled={false}
                        variant="secondary"
                        // size="sm"
                        onClick={() => router.push(`/socios`)}
                        type="button"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                    {/* Historic filter toggle */}
                    <TooltipWrapper
                        content={historic ? "Clic para ver sólo los préstamos activos y vencidos" : "Clic para ver todos los préstamos del socio"}>
                        <Toggle
                            variant={"default"}
                            pressed={historic}
                            onPressedChange={(pressed) => pressed.valueOf() ? router.push(`/socios/${member?.id}/historial?historico=true`) : router.push(`/socios/${member?.id}/historial`)}
                        >
                            <Check className={cn("mr-2 h-4 w-4", !historic && "hidden")} />
                            Mostrar histórico
                        </Toggle>
                    </TooltipWrapper>
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