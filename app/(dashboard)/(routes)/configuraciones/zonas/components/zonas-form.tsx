"use client";

import { Store, Zone } from "@prisma/client";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Edit, MapPin, PlusCircle, Trash, X } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";

interface SettingsFormProps {
    initialData: Store & { zones: Zone[] };
}

const zoneSchema = z.object({
    id: z.string(),
    realId: z.string(),
    name: z.string({ required_error: "El nombre de la zona es obligatorio" }).min(1, { message: "El nombre de la zona es obligatorio" }).max(64, { message: "No puede contener más de 64 caracteres" }),
    cost: z.coerce.number({ invalid_type_error: "El costo de envío no es válido" }), // coerce because we are using a decimal
});

const formSchema = z.object({
    zones: z.array(zoneSchema)
        .min(1, { message: "Debes registrar al menos una zona de reparto" }), // these we updateMany
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);

    const [deletedZones, setDeletedZones] = useState<{ id: string; }[]>([]);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // Zod seems to be very good at trolling because I don't know for what reason it is replacing zone.id's for its own uuids even if they already had a default value from initialData.
            // workaround: since the real id's are getting replaced I made a new 'realId' field in the object where I store the 'realId' from the server, and let zod do whatever it wants with the 'id' field.
            // March 10 2024 7:56PM: Turns out it wasn't zod, it is react-hook-form that generates an id for every fieldArray item, overriding the original one. So this is my workaround:
            zones: initialData.zones.map((zone) => ({ ...zone, realId: zone.id, cost: parseFloat(String(zone.cost)) })),
        }
    });

    const { fields: zoneFields, append: appendZone, remove: removeZone } = useFieldArray({
        name: "zones",
        control: form.control,
    })

    const onSubmit = async (data: SettingsFormValues) => {
        // replace the zones id field with the real id's and add the deletedZones object. 
        const finalData = {
            zones: data.zones.map((zone) => ({
                id: zone.realId,
                name: zone.name,
                cost: zone.cost,
            })),
            deletedZones: deletedZones
        }
        try {
            setLoading(true);
            setEdit(false);
            await axios.patch(`/api/stores/${params.storeId}/zonas`, finalData);
            setDeletedZones([]);
            router.push(`/${params.storeId}/configuraciones/zonas`);
            toast.success("Zonas del negocio actualizadas.");
        } catch (error: any) {
            if (error.response.status === 409) {
                if (error.response.data === "address-zoneId-fk-constraint-failed") {
                    toast.error("No se puede eliminar la(s) zona(s). Hay direcciones de clientes vinculadas a ella.");
                } else {
                    toast.error("Ocurrió un error inesperado.");
                }
            } else {
                toast.error("Ocurrió un error inesperado.");
            }
            setDeletedZones([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Zonas de reparto"
                    description="Establece las zonas de reparto y sus costos"
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
                            onClick={() => {
                                setEdit(false)
                                // revert all state to its default values.
                                // setCurrentZones(initialData.zones)
                                // setNewZones([])
                                // removeZone() instead of removing all fields we set the form's value to its defaults.
                                form.reset()
                                setDeletedZones([])
                            }}
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
                <form id="settings-form" onSubmit={form.handleSubmit(onSubmit)} className="pt-4 space-y-8 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {/* Zones */}
                        {zoneFields.map((zone, idx) => (
                            <div key={zone.id} className="col-span-full lg:col-span-1 bg-accent rounded-md p-4 space-y-2">
                                <div className="flex items-center">
                                    <Badge>
                                        <MapPin className="h-4 w-4 mr-2" />
                                        {zone.name ? zone.name : "Nueva zona"}
                                    </Badge>
                                    {edit &&
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                removeZone(idx)
                                                setDeletedZones([
                                                    ...deletedZones,
                                                    { id: zone.realId }
                                                ])
                                            }}
                                            size="icon"
                                            className="ml-auto"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>}
                                </div>
                                <FormField
                                    control={form.control}
                                    name={`zones.${idx}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre de la zona</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={!edit} placeholder="Nombre de la zona" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`zones.${idx}.cost`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Costo de envío (UYU)</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={!edit} placeholder="Costo de envío" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}

                        {/* Add new zone button */}
                        {edit &&
                            <Button
                                type="button"
                                className="col-span-full"
                                variant="outline"
                                size="lg"
                                onClick={() => {
                                    appendZone({ id: "", realId: "", name: "", cost: 0 })
                                }}
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Agregar nueva zona de reparto
                            </Button>
                        }
                    </div>
                    <FormField
                        control={form.control}
                        name={`zones`}
                        render={({ field }) => (
                            <FormItem>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </>
    )
}