"use client";

import { ArrowUpRightSquare, ExternalLink, Eye } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { AssignOrderColumn } from "./columns";
import { AssignModal } from "./assign-modal";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";

interface CellActionProps {
    data: AssignOrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const [open, setOpen] = useState(false);
    const params = useParams();

    return (
        <div className="flex items-center gap-x-2">
            <AssignModal isOpen={open} onClose={() => setOpen(false)} initialData={data} />
            <TooltipWrapper
                content="Asignar"
                icon={<ArrowUpRightSquare className="h-4 w-4" />}
                className="flex flex-row items-center gap-x-2"
            >
                {/* Had to use a div because TooltipTrigger is also a button and buttons are not to be nested on eachother */}
                <div
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
                    onClick={() => setOpen(true)}
                >
                    <ArrowUpRightSquare className="h-4 w-4" />
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
                    <Eye className="h-9 w-9 p-2" />
                </Link>
            </TooltipWrapper>
        </div>
    );
};