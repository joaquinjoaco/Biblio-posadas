"use client";

import { useEffect, useState } from "react";
import * as z from "zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Driver } from "@prisma/client";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

// local imports.
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AssignOrderColumn } from "./columns";
import DriverSwitcher from "@/components/ui/driver-switcher";

const formSchema = z.object({
    driverId: z.string()
        .min(1, { message: "Debes seleccionar un repartidor para el pedido." })
});

type OrderFormValues = z.infer<typeof formSchema>;

interface AssignModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: AssignOrderColumn;
}

export const AssignModal: React.FC<AssignModalProps> = ({
    isOpen,
    onClose,
    initialData: initialData,
}) => {

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData.driver ? { driverId: initialData.driver.phone } : { driverId: '', }
    });

    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const params = useParams();

    const [currentDriver, setCurrentDriver] = useState<Driver | null>(initialData?.driver ? initialData.driver : null);

    const onSubmit = async (data: OrderFormValues) => {
        try {
            setLoading(true);
            // Only update the order satus and driverId.
            await axios.patch(`/api/${params.storeId}/ordenes/${initialData.id}/asignar`, { driverId: data.driverId });
            router.refresh();
            toast.success(`Pedido asignado a ${currentDriver?.name}`);
        } catch (error) {
            toast.error("Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
            setCurrentDriver(null);
            onClose();
        }
    }

    // handles driver change.
    const handleDriverChange = (driverId: string) => {
        const driver = initialData.drivers.find((d) => d.phone === driverId) || null;
        if (driver) {
            form.setValue('driverId', driver.phone);
            setCurrentDriver(driver);
        }
    }

    useEffect(() => {
        setIsMounted(true);
    }, [])


    if (!isMounted) {
        return null;
    }

    return (
        <Modal
            title="Asigna un repartidor"
            description="El pedido pasará a estado 'ENVIADO' al asignarle un repartidor. Podrás encontrarlo en la vista de pedidos enviados."
            isOpen={isOpen}
            onClose={onClose}
        >
            <Form {...form}>
                <form id="order-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

                    <div className="flex flex-col mb-4">
                        <FormField
                            control={form.control}
                            name="driverId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <DriverSwitcher
                                            items={initialData.drivers}
                                            currentDriver={currentDriver}
                                            handleDriverChange={handleDriverChange}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cerrar
                        </Button>
                        <Button variant="default" type="submit">
                            Asignar
                        </Button>
                    </div>

                </form>
            </Form>
        </Modal>
    );
};