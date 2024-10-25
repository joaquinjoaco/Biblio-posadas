"use client";

import { Product } from "@prisma/client";
import * as z from "zod";
import { ArrowLeft, Trash } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    id: z.string().min(1, { message: 'El código del producto debe tener al menos 1 caracter' }),
    name: z.string().min(1, { message: 'El nombre del producto es obligatorio' }),
    description: z.string().max(1024, { message: 'La descripción excede el límite de 1024 caracteres' }).optional(),
    price: z.coerce.number().min(1, { message: 'El precio debe ser mayor a 0' }), // coerce because we are using a decimal
    iva: z.coerce.number().min(1, { message: 'El IVA debe ser mayor a 0' }), // coerce because we are using a decimal
    isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
}) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar producto" : "Crear producto";
    const description = initialData ? "Editar el producto del negocio" : "Registrar un nuevo un producto del negocio";
    const toastMessage = initialData ? "Producto actualizado." : "Producto creado";
    const action = initialData ? "Guardar cambios" : "Crear producto";

    const defaultValues = initialData ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),
        iva: parseFloat(String(initialData?.iva)),
    } : {
        id: '',
        name: '',
        description: '',
        price: 0,
        iva: 0,
        isArchived: false,
    }

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                // Update the product.
                await axios.patch(`/api/${params.storeId}/productos/${params.productId}`, data);
            } else {
                // Create the product.
                await axios.post(`/api/${params.storeId}/productos`, data);

            }
            router.push(`/${params.storeId}/productos`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success(toastMessage);

        } catch (error: any) {
            if (error.response.status === 409) {
                toast.error(`Ya existe un producto registrado con el código ${data.id}`);
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
            await axios.delete(`/api/${params.storeId}/productos/${params.productId}`);
            router.push(`/${params.storeId}/productos`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success("Producto eliminado.");

        } catch (error: any) {
            if (error.response.status === 409) {
                if (error.response.data === "fk-constraint-failed") {
                    toast.error("No se puede eliminar el producto. Aparece en pedidos registrados.");
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
        document.title = initialData ? initialData.name : "Nuevo producto";
    }, [])

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
                title="¿Borrar producto?"
                description="Se borrará el producto, esta acción no se puede deshacer."
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
                        onClick={() => router.push(`/${params.storeId}/productos/`)}
                        type="button"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                    {initialData && (
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
                    )}
                    <Button
                        disabled={loading}
                        className="ml-auto"
                        type="submit"
                        form="product-form"
                    >
                        {action}
                    </Button>
                </div>

            </div>
            <Separator />

            <Form {...form}>
                <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Código del producto" {...field} />
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
                                        <Input disabled={loading} placeholder="Nombre del producto" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="iva"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>IVA (%)</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="Porcentaje de IVA para el producto" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Precio unitario (UYU)</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="Precio unitario en pesos uruguayos" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción (opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea disabled={loading} placeholder="Descripción del producto" {...field} />
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
                                            El producto no aparecerá en el listado para ser seleccionado en las facturas.
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