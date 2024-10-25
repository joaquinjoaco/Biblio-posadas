"use client";

import { Trash, } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import { CancelledOrderColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";

interface CellActionProps {
    data: CancelledOrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();


    const onDelete = async () => {
        try {
            setLoading(true);

            await axios.delete(`/api/${params.storeId}/ordenes/${data.id}`);

            router.refresh(); // Refresh the component so it refetches the data.
            toast.success("Pedido eliminado.");
        } catch (error) {
            toast.error("Ocurrió un error inesperado.")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
                title="¿Borrar pedido?"
                description="Se borrará el pedido, esta acción no se puede deshacer."
                buttonMessage="Confirmar"
            />
            <TooltipWrapper
                content="Eliminar"
                icon={<Trash className="h-4 w-4" />}
                className="flex flex-row items-center gap-x-2"
            >
                {/* Had to use a div because TooltipTrigger is also a button and buttons are not to be nested on eachother */}
                <div
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4" />
                </div>
            </TooltipWrapper>
        </div>
    );
};