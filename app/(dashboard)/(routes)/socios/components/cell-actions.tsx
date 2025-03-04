"use client";

import { Edit, Handshake, MoreHorizontal } from "lucide-react";
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

interface CellActionProps {
    data: MemberColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const router = useRouter();

    return (
        <>
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
                    <DropdownMenuItem onClick={() => router.push(`/socios/${data.id}/historial`)}>
                        <Handshake className="mr-2 h-4 w-4" />
                        Prestamos del socio
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/socios/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </DropdownMenuItem>
                </DropdownMenuContent>

            </DropdownMenu>

        </>
    );
};