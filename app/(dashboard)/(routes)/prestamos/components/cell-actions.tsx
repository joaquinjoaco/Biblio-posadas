/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LendingColumn } from "./columns";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";

interface CellActionProps {
    data: LendingColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const router = useRouter();

    return (
        <>
            <TooltipWrapper
                content={"Editar préstamo"}
                className="flex flex-row items-center gap-x-2"
            >
                <Button
                    onClick={() => router.push(`/prestamos/${data["Nº de préstamo"]}`)}
                    variant="outline"
                    size="icon"
                >
                    <Edit className="h-6 w-6" />
                </Button>
            </TooltipWrapper>
        </>
    );
};