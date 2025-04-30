"use client"

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BookNotFoundProps {
    inventario: string;
}

const BookNotFound: React.FC<BookNotFoundProps> = ({
    inventario
}) => {

    const router = useRouter()

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="py-6 px-8 mx-4 max-w-[600px] rounded-2xl bg-destructive text-destructive-foreground">
                <p className="font-semibold text-lg">
                    No se encontró el libro con Nº {inventario}
                </p>
                <p>
                    El libro que intentas prestar no existe o ha sido eliminado
                </p>
                <div className="mt-4">
                    <Link className="underline" href={`/libros/nuevo`}>Registrar un nuevo libro</Link>
                </div>
                <div className="mt-4">
                    <Button variant="secondary" className="flex items-center gap-x-2" onClick={() => router.back()}>
                        <ArrowLeft />
                        Volver
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default BookNotFound;