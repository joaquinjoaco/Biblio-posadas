"use client";

import { Store } from "@prisma/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Edit, X } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    rut: z.string().min(1, { message: "El RUT del negocio es obligatorio" }).max(12, { message: "No puede contener más de 12 caracteres" }),
    name: z.string().min(1, { message: "El nombre del negocio es obligatorio" }).max(128, { message: "No puede contener más de 128 caracteres" }),
    fantasyName: z.string().min(1, { message: "El nombre del negocio es obligatorio" }).max(128, { message: "No puede contener más de 128 caracteres" }),
    sector: z.string().min(1, { message: "El rubro del negocio es obligatorio" }).max(128, { message: "No puede contener más de 128 caracteres" }),
    address: z.string().min(1, { message: "La dirección del negocio es obligatoria" }).max(128, { message: "No puede contener más de 128 caracteres" }),
    city: z.string().min(1, { message: "La ciudad del negocio es obligatoria" }).max(128, { message: "No puede contener más de 128 caracteres" }),
    telephone: z.string().min(1, { message: "El teléfono  del negocio es obligatorio" }).max(128, { message: "No puede contener más de 128 caracteres" }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData // the form will have the current store's values as default (obviously).
    });

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true);
            setEdit(false);
            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh(); // refresh the component so it refetches the patched data.
            toast.success("Información del negocio actualizada.");

        } catch (error) {
            toast.error("Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Negocio"
                    description="Establece la información del negocio"
                />
                <div className="flex gap-x-2">
                    {/* Edit button */}
                    {!edit &&
                        <Button
                            disabled={loading}
                            variant="secondary"
                            // size="sm"
                            onClick={() => setEdit(true)}
                            type="button"
                            className="gap-x-2"
                        >
                            <Edit className="h-4 w-4" />
                            Editar
                        </Button>
                    }
                    {/* Cancel edit button */}
                    {(initialData && edit) &&
                        <Button
                            disabled={loading}
                            variant="secondary"
                            // size="sm"
                            onClick={() => setEdit(false)}
                            type="button"
                            className="gap-x-2"
                        >
                            <X className="h-4 w-4" />
                            Cancelar
                        </Button>
                    }
                    {/* Submit button */}
                    {(edit) &&
                        <Button
                            form="settings-form"
                            disabled={loading}
                            type="submit"
                        >
                            Guardar cambios
                        </Button>
                    }
                </div>
            </div>
            <Separator />

            <Form {...form}>
                <form id="settings-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="rut"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>RUT</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!edit} placeholder="RUT del negocio" />
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
                                    <FormLabel>Nombre de la empresa</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!edit} placeholder="Nombre de la empresa" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fantasyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre fantasía</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!edit} placeholder="Nombre fantasía" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sector"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rubro</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!edit} placeholder="Rubro del negocio" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!edit} placeholder="Dirección del negocio" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ciudad</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!edit} placeholder="Ciudad del negocio" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="telephone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teléfono(s)</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!edit} placeholder="Teléfono(s) del negocio" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </>
    )
}