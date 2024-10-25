import { Button } from "@/components/ui/button";
import { Pointer, Store, User } from "lucide-react";

interface ClientTypeButtonsProps {
    setClientType: React.Dispatch<React.SetStateAction<"empresa" | "particular" | null>>
}

const ClientTypeButtons: React.FC<ClientTypeButtonsProps> = ({
    setClientType,
}) => {
    return (
        <div className="grid grid-cols-2 gap-8">
            <Button
                variant="outline"
                onClick={() => setClientType("empresa")}
                className="group py-[30vh] bg-gradient-to-b from-muted/50 to-muted hover:bg-accent"
                size="lg"
            >
                <div className="flex flex-col justify-center items-center">
                    <div className="flex items-center gap-x-2">
                        <Store className="h-6 w-6" />
                        <p className="text-2xl font-bold">Empresa</p>
                    </div>
                    <p className="text-muted-foreground">
                        Podrás registrar:
                    </p>
                    <div className="text-muted-foreground mt-2 list-none font-normal">
                        <li>Teléfono</li>
                        <li>Nombre</li>
                        <li>RUC</li>
                        <li>Razón social</li>
                        <li>Múltiples direcciones</li>
                        <li>Descuento (%)</li>
                    </div>
                    <Pointer className="h-12 w-12 mt-8 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </div>
            </Button>
            <Button
                variant="outline"
                onClick={() => setClientType("particular")}
                className="group py-[30vh] bg-gradient-to-b from-muted/50 to-muted hover:bg-accent"
            >
                <div className="flex flex-col justify-center items-center">
                    <div className="flex items-center gap-x-2">
                        <User className="h-6 w-6" />
                        <p className="text-2xl font-bold">Particular</p>
                    </div>
                    <p className="text-muted-foreground">
                        Podrás registrar:
                    </p>
                    <div className="text-muted-foreground mt-2 list-none font-normal">
                        <li>Teléfono</li>
                        <li>Nombre</li>
                        <li>Múltiples direcciones</li>
                        <li>Descuento (%)</li>
                    </div>
                    <Pointer className="h-12 w-12 mt-8 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </div>
            </Button>
        </div>
    );
}

export default ClientTypeButtons;