"use client";

import { useParams, useRouter } from "next/navigation";
import { FileSpreadsheet, Plus } from "lucide-react";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
// import { Apilist } from "@/components/ui/api-list";

import { DriverColumn, columns } from "./columns";

interface DriversClientProps {
    data: DriverColumn[]
}

export const DriversClient: React.FC<DriversClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    const generateSheet = () => {
        // Function to convert an array of objects to a worksheet.
        const sheetFromArrayOfObjects = (arrayOfObjects: DriverColumn[]) => {
            // Re-format the already formatted data prop to readable values for a human in a worksheet.
            const formattedArray = arrayOfObjects.map((item) => ({
                Teléfono: item.phone,
                Nombre: item.name,
                Archivado: item.isArchivedText,

                Fecha_creación: item.createdAt,
                Fecha_actualización: item.updatedAt,
            }));
            const worksheet = XLSX.utils.json_to_sheet(formattedArray);
            return worksheet;
        };

        // Create a workbook.
        const workbook = XLSX.utils.book_new();

        // Add a worksheet with drivers data.
        XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(data), 'Lista de repartidores');

        // Save the workbook to a file (starts a download).
        XLSX.writeFile(workbook, 'repartidores.xlsx');
    }

    return (
        <>
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background py-4">
                <Heading
                    title={`Repartidores (${data.length})`}
                    description="Administra los repartidores del negocio"
                />
                <div className="flex gap-x-2">
                    <Button onClick={() => { router.push(`/${params.storeId}/repartidores/nuevo`) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo repartidor
                    </Button>
                    <Button disabled={data.length === 0} onClick={() => generateSheet()} className="bg-[#107C41] hover:bg-[#1d6e42] dark:text-foreground" >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Generar archivo
                    </Button>
                </div>
            </div>
            <Separator />
            <DataTable filterKey="name" columns={columns} data={data} />

            {/* <Heading title="API" description="Llamadas de API para los repartidores" />
            <Separator />
            <Apilist entityName="repartidores" entityIdName="phone" /> */}
        </>
    )
}