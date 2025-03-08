"use client";

import { useRouter } from "next/navigation";
import { FileSpreadsheet, Plus } from "lucide-react";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { BookColumn, columns } from "./columns";
import { BooksDataTable } from "@/components/ui/books-data-table";

interface BooksClientProps {
    data: BookColumn[];
}

export const BooksClient: React.FC<BooksClientProps> = ({
    data
}) => {

    const router = useRouter();
    // const params = useParams();

    const generateSheet = () => {
        // Function to convert an array of objects to a worksheet.
        const sheetFromArrayOfObjects = (arrayOfObjects: BookColumn[]) => {
            // Re-format the already formatted data prop to readable values for a human in a worksheet.
            const formattedArray = arrayOfObjects.map((item) => ({
                "Archivado": item.isArchivedText,
                "Inventario": item.inventario,
                "Colocación": item.colocacion,
                "Autor": item.autor,
                "Título": item.titulo,
                "País": item.pais,
                "Descriptores": item.descriptores,

                "Fecha de registro": item.registro,
                "Fecha de actualización": item.actualizado,
            }));
            const worksheet = XLSX.utils.json_to_sheet(formattedArray);
            return worksheet;
        };

        // Create a workbook.
        const workbook = XLSX.utils.book_new();
        // Add a worksheet with product data.
        XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(data), 'Libros');
        // Save the workbook to a file (starts a download).
        XLSX.writeFile(workbook, 'Libros.xlsx');
    }

    return (
        <>
            <div className="flex items-center space-x-16 2xl:space-x-0 2xl:justify-between sticky top-0 z-10 bg-background py-4">
                <Heading
                    title={`Libros (${data.length})`}
                    description="Administra los libros de la biblioteca"
                />
                <div className="flex gap-x-2">
                    <Button onClick={() => { router.push(`/libros/nuevo`) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo libro
                    </Button>
                    <Button disabled={data.length === 0} onClick={() => generateSheet()} className="bg-[#107C41] hover:bg-[#1d6e42] dark:text-foreground" >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Generar archivo
                    </Button>
                </div>
            </div>
            <Separator />
            <BooksDataTable columns={columns} data={data} />
        </>
    )
}