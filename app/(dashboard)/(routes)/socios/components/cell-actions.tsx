"use client";

import { Edit, Handshake, MoreHorizontal } from "lucide-react";
// import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { useState } from "react";
// import axios from "axios";


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MemberColumn } from "./columns";
// import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
    data: MemberColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    // const params = useParams();
    const router = useRouter();

    // const [loading, setLoading] = useState(false);
    // const [open, setOpen] = useState(false);

    // const onCopy = (id: string) => {
    //     navigator.clipboard.writeText(id);
    //     toast.success("Número de ID del socio copiado al portapapeles.")
    // }

    // const onDelete = async () => {
    //     try {
    //         setLoading(true);
    //         await axios.delete(`/api/socios/${data.id}`);
    //         router.refresh(); // Refresh the component so it refetches the data.
    //         toast.success("Socio eliminado.");
    //         router.refresh();
    //     } catch (error: any) {
    //         if (error.response.status === 409) {
    //             if (error.response.data === "fk-constraint-failed") {
    //                 toast.error("No se puede eliminar el socio. Aparece en préstamos registrados.");
    //             } else {
    //                 toast.error("Ocurrió un error inesperado.");
    //             }
    //         }
    //     } finally {
    //         setLoading(false);
    //         setOpen(false);
    //     }
    // }

    return (
        <>
            {/* <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
                title="Eliminar socio?"
                description="Se eliminará el socio, esta acción es destructiva y no se puede deshacer."
                buttonMessage="Confirmar"
            /> */}

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
                    {/* Won't work if client isnt running on https */}
                    {/* <DropdownMenuItem onClick={() => onCopy(data.id.toString())}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar ID del socio
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={() => router.push(`/socios/${data.id}/historial`)}>
                        <Handshake className="mr-2 h-4 w-4" />
                        Prestamos del socio
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/socios/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                    </DropdownMenuItem> */}
                </DropdownMenuContent>

            </DropdownMenu>

        </>
    );
};