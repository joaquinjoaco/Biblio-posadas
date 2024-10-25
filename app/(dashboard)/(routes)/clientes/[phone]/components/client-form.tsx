"use client";

import { Address, Client, Zone } from "@prisma/client";
import * as z from "zod";
import { ArrowLeft, History, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
import ClientTypeButtons from "./client-type-buttons";
import ClientAddresses from "./client-addresses";

interface ClientFormProps {
    initialData: Client & { addresses: Address[] } | null;
    zones: Zone[];
}

export const ClientForm: React.FC<ClientFormProps> = ({
    initialData,
    zones,
}) => {

    type ClientFormValues = z.infer<typeof formSchema>;

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // const [currentAddresses, setCurrentAddresses] = useState<Address[]>(initialData?.addresses ? initialData?.addresses : []);
    const [clientType, setClientType] = useState<"empresa" | "particular" | null>(initialData ? initialData.type : null);

    const title = clientType ? initialData ? "Editar cliente" : "Crear cliente" : "¿Particular o empresa?";
    const description = clientType ? initialData ? "Editar cliente" : "Crear un cliente" : "Escoge que tipo de cliente deseas registrar";
    const toastMessage = initialData ? "Cliente actualizado." : "Cliente creado";
    const action = initialData ? "Guardar cambios" : "Crear cliente";

    const addressSchema = z.object({
        address: z.string({ required_error: "La dirección no puede ser vacía" }).min(1, { message: "Debes poporcionar una dirección" }).max(128, { message: "No puede contener más de 128 caracteres" }), // for some reason throws undefined instead of this
        zoneId: z.string({ required_error: "La zona no puede ser vacía" }).min(1, { message: "Debes seleccionar una zona" }),
    });

    // declared inside so we can conditionally make some fields optional or required depending on client type.
    const formSchema = z.object({
        phone: z.string().min(1, { message: "El teléfono del cliente es obligatorio" })
            .max(32, { message: "No puede contener más de 32 caracteres" })
            .refine(value => /^\d+$/.test(value), { message: "El teléfono debe contener solo números" }),
        name: z.string().min(1, { message: "El nombre del cliente es obligatorio" }).max(128, { message: "No puede contener más de 128 caracteres" }),
        discount: z.coerce.number({ required_error: "El descuento es obligatorio", invalid_type_error: "Debes proporcionar un número entre 0 y 100" }).min(0, { message: "El descuento debes ser mayor o igual a 0" }).max(100, { message: "El descuento debes ser mayor o igual a 0" }),
        addresses: z.array(addressSchema).min(1, { message: "Debes registrar al menos una dirección para el cliente" }),
        isArchived: z.boolean().default(false).optional(),

        socialReason: z.string().max(128, { message: "No puede contener más de 128 caracteres" })
            // required when clientType === "empresa"
            .refine(data => clientType === "particular" || (data && data.trim().length > 0), {
                message: "La razón social es obligatoria",
            })
            .optional(),
        ruc: z.string().max(12, { message: "El ruc no debe tener más de 12 dígitos" })
            // required when clientType === "empresa"
            .refine(data => clientType === "particular" || (data && data.trim().length > 0), {
                message: "El ruc es obligatorio",
            })
            .optional(),
    });

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            socialReason: initialData.socialReason || '',
            ruc: initialData.ruc || '',
            discount: parseFloat(String(initialData?.discount)),
        } : {
            phone: '',
            name: '',
            socialReason: '',
            ruc: '',
            // discount: ,
            addresses: [],
            isArchived: false,
        }
    });

    const { fields: addressesFields, append: appendAddress, remove: removeAddress } = useFieldArray({
        name: "addresses",
        control: form.control,
    })

    const onSubmit = async (data: ClientFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                // Update the client.
                await axios.patch(`/api/${params.storeId}/clientes/${params.phone}`, data);
            } else {
                // Create the client.
                await axios.post(`/api/${params.storeId}/clientes`, { ...data, type: clientType });
            }

            router.push(`/${params.storeId}/clientes`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success(toastMessage);
        } catch (error: any) {
            if (error.response.status === 409) {
                if (error.response.data === "unique-constraint-failed") {
                    toast.error(`Ya existe un cliente registrado con el número ${data.phone}`);
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

            await axios.delete(`/api/${params.storeId}/clientes/${params.phone}`);

            router.push(`/${params.storeId}/clientes`);
            router.refresh(); // Refresh the component so it refetches the data.
            toast.success("Cliente eliminado.");

        } catch (error: any) {
            if (error.response.status === 409) {
                if (error.response.data === "fk-constraint-failed") {
                    toast.error("No se puede eliminar el cliente. Tiene pedidos registrados.");
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
        document.title = initialData ? initialData.name : "Nuevo cliente";
    }, []);

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
                title="¿Borrar cliente?"
                description="Se borrará el cliente, esta acción no se puede deshacer."
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
                        onClick={() => router.push(`/${params.storeId}/clientes/`)}
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
                                href={`/${params.storeId}/clientes/${params.phone}/historial`}
                                target="_blank"
                                className="flex flex-row text-sm font-medium items-center border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md"
                            >
                                <History className="h-4 w-4 mr-2" />
                                Ver historial
                            </Link>
                        </div>
                    )}

                    {/* submit button */}
                    {clientType &&
                        <Button
                            disabled={loading}
                            className="ml-auto"
                            type="submit"
                            form="client-form"
                        >
                            {action}
                        </Button>
                    }
                </div>

            </div>
            <Separator />

            {/* First the user has to choose whether to create a 'particular' or an 'empresa' type of client */}
            {(!clientType && !initialData) &&
                <ClientTypeButtons setClientType={setClientType} />
            }

            {clientType &&
                <Form {...form}>
                    <form id="client-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                        <div className="grid grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teléfono</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Teléfono del cliente" {...field} />
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
                                            <Input disabled={loading} placeholder="Nombre del cliente" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Optional fields for type "empresa" */}
                            {clientType === "empresa" &&
                                <>
                                    <FormField
                                        control={form.control}
                                        name="socialReason"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Razón social</FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder="Razón social de la empresa" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ruc"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>RUC</FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder="RUC de la empresa" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            }

                            <FormField
                                control={form.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descuento (%)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min={0} disabled={loading} placeholder="Descuento sin signo de porcentaje" {...field} />
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
                                                El cliente no aparecerá en el listado para ser seleccionado en los pedidos.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {/* CLIENT'S ADDRESSES */}
                            <ClientAddresses
                                form={form}
                                addressesFields={addressesFields}
                                appendAddress={appendAddress}
                                removeAddress={removeAddress}
                                zones={zones}
                                loading={loading}
                            />

                        </div>
                    </form>
                </Form >
            }
        </>
    )
}