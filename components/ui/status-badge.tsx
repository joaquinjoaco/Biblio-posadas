import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
    status: "emitido" | "enviado" | "cancelado",
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
}) => {

    return (
        <Badge
            variant={status.toLowerCase() as "emitido" | "enviado" | "cancelado"}
        >
            {status}
        </Badge>
    );
}

export default StatusBadge;