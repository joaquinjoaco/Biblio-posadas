"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Check, FileSpreadsheet, Plus } from "lucide-react";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { ClientColumn, columns } from "./columns";
import { Toggle } from "@/components/ui/toggle";

interface ClientsClientProps {
    data: ClientColumn[]; // filtered clients
    formattedClients: ClientColumn[]; // all clients to generate the xlsx file regardless of filters
}

export const ClientsClient: React.FC<ClientsClientProps> = ({
    data,
    formattedClients,
}) => {

    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');

    const title = type === "empresa" ? `Empresas (${data.length})` : type === "particular" ? `Particulares (${data.length})` : `Todos los clientes (${data.length})`;
    const description = type === "empresa" ? "Mostrando todos los clientes empresas" : type === "particular" ? "Mostrando todos los clientes particulares" : "Mostrando todos los clientes (empresa y particulares)";

    const generateSheet = () => {
        // Function to convert an array of objects to a worksheet.
        const particularesSheet = (arrayOfObjects: ClientColumn[]) => {
            // Filter clients of type "particular" and then map them to formatted objects
            const filteredArray = arrayOfObjects.filter(client => client.type === "particular");
            const formattedArray = filteredArray.map((client) =>
            ({
                Teléfono: client.phone,
                Nombre: client.name,
                Dirección: client.address,
                Descuento: client.discount,
                Archivado: client.isArchivedText,

                Fecha_creación: client.createdAt,
                Fecha_actualización: client.updatedAt,
            }));

            const worksheet = XLSX.utils.json_to_sheet(formattedArray);
            return worksheet;
        };

        const empresasSheet = (arrayOfObjects: ClientColumn[]) => {
            // Filter clients of type "particular" and then map them to formatted objects
            const filteredArray = arrayOfObjects.filter(client => client.type === "empresa");
            const formattedArray = filteredArray.map((client) =>
            ({
                Teléfono: client.phone,
                Nombre: client.name,
                Razón_social: client.socialReason,
                RUC: client.ruc,
                Dirección: client.address,
                Descuento: client.discount,
                Archivado: client.isArchivedText,

                Fecha_creación: client.createdAt,
                Fecha_actualización: client.updatedAt,
            }));

            const worksheet = XLSX.utils.json_to_sheet(formattedArray);
            return worksheet;
        };

        // Create a workbook.
        const workbook = XLSX.utils.book_new();

        // Add a worksheet with product data.
        XLSX.utils.book_append_sheet(workbook, particularesSheet(formattedClients), 'Particulares');
        XLSX.utils.book_append_sheet(workbook, empresasSheet(formattedClients), 'Empresas');

        // Save the workbook to a file (starts a download).
        XLSX.writeFile(workbook, 'clientes.xlsx');
    }

    return (
        <>
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background py-4">
                <div className="flex flex-col space-y-2 ">
                    <Heading
                        title={title}
                        description={description}
                    />
                    <div className="flex flex-row gap-x-2">
                        <Toggle
                            aria-label="Toggle bold"
                            pressed={type === "empresa"}
                            onPressedChange={(pressed) => pressed.valueOf() ? router.push(`/${params.storeId}/clientes?type=empresa`) : router.push(`/${params.storeId}/clientes`)}
                        >
                            <Check className={`mr-2 h-4 w-4 ${type !== "empresa" ? "hidden" : ""}`} />
                            Empresas
                        </Toggle>
                        <Toggle
                            aria-label="Toggle bold"
                            pressed={type === "particular"}
                            onPressedChange={(pressed) => pressed.valueOf() ? router.push(`/${params.storeId}/clientes?type=particular`) : router.push(`/${params.storeId}/clientes`)}
                        >
                            <Check className={`mr-2 h-4 w-4 ${type !== "particular" ? "hidden" : ""}`} />
                            Particulares
                        </Toggle>
                        <Toggle
                            aria-label="Toggle bold"
                            pressed={type !== "empresa" && type !== "particular"}
                            onPressedChange={() => router.push(`/${params.storeId}/clientes`)}
                        >
                            <Check className={`mr-2 h-4 w-4 ${type === "empresa" || type === "particular" ? "hidden" : ""}`} />
                            Todos
                        </Toggle>
                    </div>
                </div>
                <div className="flex gap-x-2">

                    <Button onClick={() => { router.push(`/${params.storeId}/clientes/nuevo`) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo cliente
                    </Button>
                    <Button disabled={data.length === 0} onClick={() => generateSheet()} className="bg-[#107C41] hover:bg-[#1d6e42] dark:text-foreground" >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Generar archivo
                    </Button>
                </div>
            </div>
            <Separator />
            <DataTable filterKey="address" columns={columns} data={data} />
        </>
    )
}