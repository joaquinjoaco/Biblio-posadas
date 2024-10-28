"use client";

import { Socio } from "@prisma/client";
import * as z from "zod";
import { ArrowLeft, Check, ChevronsUpDown, Trash } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    nombre: z.string().min(1, { message: 'El nombre del socio es obligatorio' }).max(255, { message: 'El nombre es demasiado largo' }),
    apellido: z.string().min(1, { message: 'El apellido del socio es obligatorio' }).max(255, { message: 'El apellido es demasiado largo' }),
    direccion: z.string().min(1, { message: 'El título del socio es obligatorio' }).max(255, { message: 'La dirección es demasiado larga' }),
    telefono: z.string().min(1, { message: 'El teléfono del socio es obligatorio' }).max(255, { message: 'El teléfono es demasiado largo' }),
    ubicacion: z.string().min(1, { message: 'La ubicación del socio es obligatoria' }),
    isArchived: z.boolean().default(false).optional(),
});

type MemberFormValues = z.infer<typeof formSchema>;

interface MemberFormProps {
    initialData: Socio | null;
}

export const MemberForm: React.FC<MemberFormProps> = ({
    initialData,
}) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const ubicaciones = [
        { label: "Dentro", value: "DENTRO" },
        { label: "Fuera", value: "FUERA" },
    ];

    const title = initialData ? "Editar socio" : "Registrar socio";
    const description = initialData ? "Editar el socio de la biblioteca" : "Registrar un nuevo socio de la biblioteca";
    const toastMessage = initialData ? "Socio actualizado." : "Socio registrado";
    const action = initialData ? "Guardar cambios" : "Registrar socio";

    const defaultValues = initialData ? {
        ...initialData,
    } : {
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        ubicacion: ''
    }

    const form = useForm<MemberFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit = async (data: MemberFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                // Update the product.
                await axios.patch(`/api/socios/${params.id}`, data);
            } else {
                // Create the product.
                await axios.post(`/api/socios`, data);
            }

            router.push(`/socios`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success(toastMessage);

        } catch (error: any) {
            if (error.response.status === 409) {
                toast.error(`Ocurrió un error al generar el ID del socio.`);
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
            await axios.delete(`/api/socios/${params.id}`);
            router.push(`/socios`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success("Socio eliminado.");

        } catch (error: any) {
            if (error.response.status === 409) {
                if (error.response.data === "fk-constraint-failed") {
                    toast.error("No se puede eliminar el socio. Aparece en préstamos registrados.");
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
        document.title = initialData ? initialData.nombre : "Nuevo socio";
    }, [])

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
                title="¿Eliminar socio?"
                description="Se eliminará el socio, esta acción es destructiva y no se puede deshacer."
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
                        onClick={() => router.push(`/socios`)}
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
                        form="socio-form"
                    >
                        {action}
                    </Button>
                </div>

            </div>
            <Separator />

            <Form {...form}>
                <form id="socio-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-2 gap-8">
                        <FormItem>
                            <FormLabel>ID del socio</FormLabel>
                            <FormControl>
                                <Input
                                    disabled
                                    placeholder={initialData ? initialData.id.toString() : "Autogenerado"}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nombre del socio" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="apellido"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Apellido</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Apellido del socio" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="direccion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Dirección del socio" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="telefono"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teléfono</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Teléfono del socio" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ubicacion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ubicación</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "flex justify-between h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? ubicaciones.find(
                                                            (ubicacion) => ubicacion.value === field.value
                                                        )?.label
                                                        : "Ubicación"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent align="start" className="w-[200px] p-0">
                                            <Command>
                                                <CommandList>
                                                    <CommandGroup>
                                                        {ubicaciones.map((ubicacion) => (
                                                            <CommandItem
                                                                value={ubicacion.label}
                                                                key={ubicacion.value}
                                                                onSelect={() => {
                                                                    form.setValue("ubicacion", ubicacion.value)
                                                                }}
                                                                className="cursor-pointer"
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        ubicacion.value === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {ubicacion.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
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
                                            Si el socio desea cancelar o pausar su membresía. Quedará "archivado" y no aparecerá para
                                            ser seleccionado en los préstamos en pos de evitar errores.
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