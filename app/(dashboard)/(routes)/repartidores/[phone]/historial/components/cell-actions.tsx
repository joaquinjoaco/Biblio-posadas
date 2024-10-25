"use client";

import { ExternalLink, Eye, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import { DriverOrderHistoryColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";

interface CellActionProps {
    data: DriverOrderHistoryColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onUnassign = async () => {
        try {
            setLoading(true);
            // Only update the order satus and driverId.
            await axios.patch(`/api/${params.storeId}/ordenes/${data.id}/desasignar`);
            router.refresh();
            toast.success("Se quitó la asignación del pedido.");
        } catch (error) {
            toast.error("Ocurrió un error inesperado.");
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
                onConfirm={onUnassign}
                loading={loading}
                buttonMessage="Quitar asignación"
                title="¿Quitar asignación?"
                description={`Se quitará la asignación del pedido a ${data.driverName}. Este volverá a estado 'EMITIDO', podrás encontrarlo en la vista general de pedidos.`}
            />

            <TooltipWrapper
                content="Quitar asignación"
                icon={<X className="h-4 w-4" />}
                className="flex flex-row items-center gap-x-2"
            >
                {/* Had to use a div because TooltipTrigger is also a button and buttons are not to be nested on eachother */}
                <div
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
                    onClick={() => setOpen(true)}
                >
                    <X className="h-4 w-4" />
                </div>
            </TooltipWrapper>

            <TooltipWrapper
                content="Ver pedido"
                icon={<ExternalLink className="h-4 w-4" />}
                className="flex flex-row items-center gap-x-2"
            >
                <Link
                    className="inline-flex justify-center items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 mt-[2px]"
                    href={`/${params.storeId}/ordenes/${data.id}`}
                    target="_blank"
                >
                    {/* accesibility fature, screenreaders only 'Ver detales' */}
                    <span className="sr-only">Ver pedido</span>
                    <Eye className="h-9 w-9 p-2 hover:bg-accent rounded-md transition-all" />
                </Link>
            </TooltipWrapper>
        </div>
    );
};