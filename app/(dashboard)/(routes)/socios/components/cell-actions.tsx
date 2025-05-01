"use client";

import { Edit, Eye, Handshake, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MemberColumn } from "./columns";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import MemberCard from "./member-card";

interface CellActionProps {
    data: MemberColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const router = useRouter()

    return (
        <div className="flex items-center space-x-2">
            <TooltipWrapper
                content={<MemberCard data={data} />}
                className="flex flex-row items-center gap-x-2"
            >
                <Button
                    variant="secondary"
                    size="icon"
                    className="cursor-help"
                >
                    <Eye />
                </Button>
            </TooltipWrapper>

            <DropdownMenu>
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
                        {data["Nombre"]} {data["Apellido"]}
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/socios/${data["ID"]}/historial`)}>
                        <Handshake className="mr-2 h-4 w-4" />
                        Ver préstamos de {data["Nombre"]}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/socios/${data["ID"]}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    );
};