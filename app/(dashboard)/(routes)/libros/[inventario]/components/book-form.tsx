/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Libro } from "@prisma/client";
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

const formSchema = z.object({
    colocacion: z.string().min(1, { message: 'La colocación del libro es obligatoria' }).max(255, { message: 'La colocación es demasiado larga' }),
    autor: z.string().min(1, { message: 'El autor del libro es obligatorio' }).max(255, { message: 'El autor del libro es demasiado largo' }),
    titulo: z.string().min(1, { message: 'El título del libro es obligatorio' }).max(255, { message: 'El título del libro es demasiado largo' }),
    pais: z.string().min(1, { message: 'El país del libro es obligatorio' }).max(255, { message: 'El país del libro es demasiado largo' }),
    descriptores: z.string().min(1, { message: 'Los descriptores del libro son obligatorios' }).max(255, { message: 'Los descriptores del libro son demasiado largos' }),
    isArchived: z.boolean().default(false).optional(),
});

type BookFormValues = z.infer<typeof formSchema>;

interface BookFormProps {
    initialData: Libro | null;
}

export const BookForm: React.FC<BookFormProps> = ({
    initialData,
}) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar libro" : "Registrar libro";
    const description = initialData ? "Editar el libro de la biblioteca" : "Registrar un nuevo libro de la biblioteca";
    const toastMessage = initialData ? "Libro actualizado." : "Libro registrado";
    const action = initialData ? "Guardar cambios" : "Registrar libro";

    const defaultValues = initialData ? {
        ...initialData,
    } : {
        colocacion: '',
        autor: '',
        titulo: '',
        pais: '',
        descriptores: '',
        isArchived: false,
    }

    const form = useForm<BookFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit = async (data: BookFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                // Update the book.
                await axios.patch(`/api/libros/${params.inventario}`, data);
            } else {
                // Create the book.
                await axios.post(`/api/libros`, data);
            }

            router.push(`/libros`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success(toastMessage);

        } catch (error: any) {
            if (error.response.status === 409) {
                toast.error(`Ocurrió un error al generar el Nº de inventario.`);
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
            await axios.delete(`/api/libros/${params.inventario}`);
            router.push(`/libros`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success("Libro eliminado.");

        } catch (error: any) {
            if (error.response.status === 409) {
                if (error.response.data === "fk-constraint-failed") {
                    toast.error("No se puede eliminar el libro. Aparece en préstamos registrados.");
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
        document.title = initialData ? initialData.titulo : "Nuevo libro";
    }, [])

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
                title="¿Eliminar libro?"
                description="Se eliminará el libro, esta acción es destructiva y no se puede deshacer."
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
                        onClick={() => router.push(`/libros`)}
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
                        form="book-form"
                    >
                        {action}
                    </Button>
                </div>

            </div>
            <Separator />

            <Form {...form}>
                <form id="book-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-2 gap-8">
                        <FormItem>
                            <FormLabel>Nº de inventario</FormLabel>
                            <FormControl>
                                <Input
                                    disabled
                                    placeholder={initialData ? initialData.inventario.toString() : "Autogenerado"}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="colocacion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Colocación</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Colocación del libro" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="autor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Autor</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Autor del libro" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="titulo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Título del libro" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pais"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>País</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="País del libro" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="descriptores"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descriptores</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Descriptores del libro" {...field} />
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
                                            Si el libro se encuentra en mal estado o ya no disponen del mismo. Quedará &quot;archivado&quot;
                                            y el botón para prestarlo se desactivará para evitar errores.
                                            Podrás volver a desarchivarlo desde este mismo lugar.
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