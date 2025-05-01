/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Edit, ExternalLink, Handshake, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
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

interface CellActionProps {
    data: BookColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

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
                title="¿Eliminar libro?"
                description="Se eliminará el libro, esta acción es destructiva y no se puede deshacer."
                buttonMessage="Confirmar"
            />

            {/* 
            When opening a modal from a Dropdown menu shit will 'freeze' for some reason after closing the modal.
            Setting modal={false} on Dropdown menu root keeps shit dancing properly.
            https://github.com/shadcn-ui/ui/issues/1912#:~:text=Adding%20modal%3D%7Bfalse%7D%20on%20dropdown%20menu%20root%20worked%20for%20me!
             */}
            <DropdownMenu modal={false}>
                <TooltipWrapper content="Acciones">
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            {/* accesibility fature, screenreaders only 'open menu' */}
                            <span className="sr-only">Abrir menú de acciones</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipWrapper>
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

            <TooltipWrapper
                content={data.isArchived ? "Libro archivado" :
                    <div className="flex items-center gap-x-2">
                        <ExternalLink className="h-4 w-4" />
                        Prestar Libro
                    </div>
                }
                className="flex flex-row items-center gap-x-2"
            >
                <Button
                    variant="outline"
                    size="icon"
                    disabled={data.isArchived}
                    onClick={() => window.open(`/prestamos/prestar/${data.inventario}`)}
                >
                    {/* accesibility feature, screenreaders only 'Prestar libro' */}
                    <span className="sr-only">Prestar libro</span>
                    <Handshake />
                </Button>
            </TooltipWrapper>
        </div>
    );
};