"use client";

import { Copy, Edit, Handshake, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BookColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CellActionProps {
    data: BookColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // const onCopy = (id: string) => {
    //     navigator.clipboard.writeText(id);
    //     toast.success("Número de inventario del libro copiado al portapapeles.")
    // }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/libros/${data.inventario}`);
            router.refresh(); // Refresh the component so it refetches the data.
            toast.success("Libro eliminado.");
            router.refresh();
        } catch (error: any) {
            if (error.response.status === 409) {
                if (error.response.data === "fk-constraint-failed") {
                    toast.error("No se puede eliminar el libro. Aparece en préstamos registrados.");
                } else {
                    toast.error("Ocurrió un error inesperado.");
                }
            }
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <div className="flex gap-x-2 items-center">
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
                title="Eliminar libro?"
                description="Se eliminará el libro, esta acción es destructiva y no se puede deshacer."
                buttonMessage="Confirmar"
            />
            <TooltipWrapper
                content={data.isArchived ? "Libro archivado" : "Prestar libro"}
                className="flex flex-row items-center gap-x-2"
            >
                <div
                    className={cn("inline-flex justify-center items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10", data.isArchived ? "pointer-events-none opacity-50" : "")}
                    onClick={() => router.push(`/prestamos/prestar/${data.inventario}`)}
                >
                    {/* accesibility fature, screenreaders only 'Prestar libro' */}
                    <span className="sr-only">Prestar libro</span>
                    <Handshake className="h-9 w-9 p-2 hover:bg-accent rounded-md transition-all" />
                </div>

            </TooltipWrapper>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        {/* accesibility fature, screenreaders only 'open menu' */}
                        <span className="sr-only">Abrir menú de acciones</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Acciones
                    </DropdownMenuLabel>
                    <DropdownMenuItem disabled={data.isArchived} onClick={() => router.push(`/prestamos/prestar/${data.inventario}`)}>
                        <Handshake className="mr-2 h-4 w-4" />
                        Prestar libro
                    </DropdownMenuItem>
                    {/* Won't work if client isnt running on https */}
                    {/* <DropdownMenuItem onClick={() => onCopy(data.inventario.toString())}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar Nº de inventario
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={() => router.push(`/libros/${data.inventario}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>

            </DropdownMenu>

        </div>
    );
};