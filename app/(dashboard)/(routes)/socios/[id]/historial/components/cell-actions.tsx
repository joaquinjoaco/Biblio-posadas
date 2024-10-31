"use client";

import { Edit, } from "lucide-react";
// import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { useState } from "react";
// import axios from "axios";


import { buttonVariants } from "@/components/ui/button";
import { LendingColumn } from "./columns";
// import { AlertModal } from "@/components/modals/alert-modal";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";

interface CellActionProps {
    data: LendingColumn;
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
    //     toast.success("Número de préstamo copiado al portapapeles.")
    // }

    // const onDelete = async () => {
    //     try {
    //         setLoading(true);
    //         await axios.delete(`/api/prestamos/${data["Nº de préstamo"]}}`);
    //         router.refresh(); // Refresh the component so it refetches the data.
    //         toast.success("Préstamo eliminado.");
    //         router.refresh();
    //     } catch (error: any) {
    //         if (error.response.status === 409) {
    //             if (error.response.data === "fk-constraint-failed") {
    //                 toast.error("No se puede eliminar el préstamo.");
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

            <TooltipWrapper
                content={"Editar préstamo"}
                className="flex flex-row items-center gap-x-2"
            >
                <div
                    className={buttonVariants({ variant: "outline", size: "icon" })}
                    onClick={() => router.push(`/prestamos/${data["Nº de préstamo"]}`)}
                >
                    {/* accesibility fature, screenreaders only 'Prestar libro' */}
                    <Edit className="h-6 w-6" />
                </div>
            </TooltipWrapper>
        </>
    );
};