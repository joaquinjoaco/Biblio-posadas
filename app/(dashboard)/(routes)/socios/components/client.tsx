"use client";

import { useRouter } from "next/navigation";
import { FileSpreadsheet, Plus } from "lucide-react";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { MemberColumn, columns } from "./columns";
import { MembersDataTable } from "@/components/ui/members-data-table";

interface MembersClientProps {
    data: MemberColumn[];
}

export const MembersClient: React.FC<MembersClientProps> = ({
    data
}) => {

    const router = useRouter();
    // const params = useParams();

    const generateSheet = () => {
        // Function to convert an array of objects to a worksheet.
        const sheetFromArrayOfObjects = (arrayOfObjects: MemberColumn[]) => {
            // Re-format the already formatted data prop to readable values for a human in a worksheet.
            const formattedArray = arrayOfObjects.map((item) => ({
                "ID": item.id,
                "Nombre": item.nombre,
                "Apellido": item.apellido,
                "Dirección": item.direccion,
                "Título": item.telefono,
                "País": item.ubicacion,
                "Archivado": item.isArchivedText,

                "Fecha de registro": item.registro,
                "Fecha de actualización": item.actualizado,
            }));
            const worksheet = XLSX.utils.json_to_sheet(formattedArray);
            return worksheet;
        };

        // Create a workbook.
        const workbook = XLSX.utils.book_new();
        // Add a worksheet with product data.
        XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(data), 'Socios');
        // Save the workbook to a file (starts a download).
        XLSX.writeFile(workbook, 'Socios.xlsx');
    }

    return (
        <>
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background py-4">
                <Heading
                    title={`Socios (${data.length})`}
                    description="Administra los socios de la biblioteca"
                />
                <div className="flex gap-x-2">
                    <Button onClick={() => { router.push(`/socios/nuevo`) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo socio
                    </Button>
                    <Button disabled={data.length === 0} onClick={() => generateSheet()} className="bg-[#107C41] hover:bg-[#1d6e42] dark:text-foreground" >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Generar archivo
                    </Button>
                </div>
            </div>
            <Separator />
            <MembersDataTable columns={columns} data={data} />
        </>
    )
}