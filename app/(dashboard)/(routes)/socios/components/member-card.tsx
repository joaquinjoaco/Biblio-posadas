import { formatCedula } from "@/lib/utils";
import { MemberColumn } from "./columns";
import { IdCard, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface MemberCardProps {
    data: MemberColumn;

}

const MemberCard: React.FC<MemberCardProps> = ({
    data
}) => {
    return (
        <div>
            <div className="flex h-full w-[400px] select-none flex-col p-4 no-underline outline-none">
                <div className="flex flex-col text-lg font-medium">
                    {data["Nombre"]} {data["Apellido"]}
                </div>

                <div className="flex items-center gap-x-2">
                    <Badge variant="default" className="w-fit my-2">
                        {data["Ubicación"]}
                    </Badge>
                    {data["isArchived"] &&
                        <Badge variant="destructive" className="w-fit my-2">
                            {data["isArchivedText"]}
                        </Badge>
                    }
                </div>

                <div className="text-sm leadin-tight space-y-2">
                    <p className="flex items-center gap-x-2">
                        <IdCard className="h-4 w-4" />
                        {formatCedula(data["Cédula"])}
                    </p>
                    <p className="flex items-center gap-x-2">
                        <Phone className="h-4 w-4" />
                        {formatCedula(data["Teléfono"])}
                    </p>
                    <p className="flex items-center gap-x-2 pb-4">
                        <MapPin className="h-4 w-4" />
                        {formatCedula(data["Dirección"])}
                    </p>
                    <Separator />
                    <div className="text-muted-foreground">
                        <div className="grid grid-cols-2 items-center">
                            <div className="flex items-center gap-x-2">
                                Registro
                            </div>
                            <p className="text-right">
                                {formatCedula(data["Registro"])}
                            </p>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="flex items-center gap-x-2">
                                Actualización
                            </div>
                            <p className="text-right">
                                {formatCedula(data["Actualizado"])}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MemberCard;