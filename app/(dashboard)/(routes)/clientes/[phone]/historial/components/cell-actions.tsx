"use client";

import { ExternalLink, Eye } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { ClientOrderHistoryColumn } from "./columns";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";

interface CellActionProps {
    data: ClientOrderHistoryColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const params = useParams();

    return (
        <>
            <TooltipWrapper
                content="Ver pedido"
                icon={<ExternalLink className="h-4 w-4" />}
                className="flex flex-row items-center gap-x-2"
            >
                <Link
                    className="inline-flex justify-center items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
                    href={`/${params.storeId}/ordenes/${data.id}`}
                    target="_blank"
                >
                    {/* accesibility fature, screenreaders only 'Ver detales' */}
                    <span className="sr-only">Ver pedido</span>
                    <Eye className="h-9 w-9 p-2 hover:bg-accent rounded-md transition-all" />
                </Link>
            </TooltipWrapper>
        </>
    );
};