"use client";

import { Driver } from "@prisma/client";
import * as z from "zod";
import { ArrowLeft, History, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const formSchema = z.object({
    phone: z.string().min(1, { message: 'El teléfono del repartidor es obligatorio' }).max(32, { message: "No puede contener más de 32 caracteres" }),
    name: z.string().min(1, { message: 'El nombre del repartidor es obligatorio' }).max(128, { message: "No puede contener más de 128 caracteres" }),
    isArchived: z.boolean().default(false).optional(),
});

type DriverFormValues = z.infer<typeof formSchema>;

interface DriverFormProps {
    initialData: Driver | null;
}

export const DriverForm: React.FC<DriverFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar repartidor" : "Crear repartidor";
    const description = initialData ? "Editar repartidor" : "Crear un repartidor";
    const toastMessage = initialData ? "Repartidor actualizado." : "Repartidor creado";
    const action = initialData ? "Guardar cambios" : "Crear repartidor";

    const form = useForm<DriverFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            phone: '',
            name: '',
            isArchived: false,
        }
    });

    const onSubmit = async (data: DriverFormValues) => {
        try {
            setLoading(true);

            if (initialData) {
                // Update the driver.
                await axios.patch(`/api/${params.storeId}/repartidores/${params.phone}`, data);
            } else {
                // Create the driver.
                await axios.post(`/api/${params.storeId}/repartidores`, data);
            }

            router.push(`/${params.storeId}/repartidores`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success(toastMessage);
        } catch (error: any) {
            if (error.response.status === 409) {
                if (error.response.data === "unique-constraint-failed") {
                    toast.error(`Ya existe un repartidor registrado con el número ${data.phone}`);
                }
            } else {
                toast.error("Ocurrió un error inesperado.");
            }
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);

            await axios.delete(`/api/${params.storeId}/repartidores/${params.phone}`);

            router.push(`/${params.storeId}/repartidores`);
            router.refresh(); // Refresh the component so it refetches the data.
            toast.success("Repartidor eliminado.");

        } catch (error: any) {
            if (error.response.status === 409) {
                if (error.response.data === "fk-constraint-failed") {
                    toast.error("No se puede eliminar el repartidor. Tiene pedidos vinculados.");
                } else {
                    toast.error("Ocurrió un error inesperado.");
                }
            }
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    useEffect(() => {
        document.title = initialData ? initialData.name : "Nuevo repartidor";
    }, [])

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
                title="¿Borrar repartidor?"
                description="Se borrará el repartidor, esta acción no se puede deshacer."
                buttonMessage="Confirmar"
            />
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background py-4">
                <Heading
                    title={title}
                    description={description}
                />

                <div className="flex gap-x-2">
                    {/* Back button */}
                    <Button
                        disabled={false}
                        variant="secondary"
                        // size="sm"
                        onClick={() => router.push(`/${params.storeId}/repartidores/`)}
                        type="button"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                    {initialData && (
                        <div className="flex flex-row gap-x-2">
                            <Button
                                disabled={loading}
                                variant="destructive"
                                // size="sm"
                                onClick={() => setOpen(true)}
                                type="button"
                            >
                                <Trash className="h-4 w-4 mr-2" />
                                Eliminar
                            </Button>
                            <Link
                                href={`/${params.storeId}/repartidores/${params.phone}/historial`}
                                target="_blank"
                                className="flex flex-row text-sm font-medium items-center border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md"
                            >
                                <History className="h-4 w-4 mr-2" />
                                Ver historial
                            </Link>
                        </div>
                    )}
                    {/* submit button */}
                    <Button
                        disabled={loading}
                        className="ml-auto"
                        type="submit"
                        form="driver-form"
                    >
                        {action}
                    </Button>
                </div>

            </div>
            <Separator />

            <Form {...form}>
                <form id="driver-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teléfono</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Teléfono del repartidor" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nombre del repartidor" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Archivado
                                        </FormLabel>
                                        <FormDescription>
                                            El repartidor no aparecerá en el listado para ser vinculado a pedidos.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                    </div>
                </form>
            </Form>
        </>
    )
}