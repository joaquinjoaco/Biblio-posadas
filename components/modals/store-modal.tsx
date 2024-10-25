"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-hot-toast";

// local imports
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    rut: z.string().min(1, { message: "El RUT del negocio es obligatorio" }).max(128, { message: "No puede contener más de 128 caracteres" }),
    name: z.string().min(1, { message: "El nombre del negocio es obligatorio" }).max(128, { message: "No puede contener más de 128 caracteres" }),
    fantasyName: z.string().min(1, { message: "El nombre del negocio es obligatorio" }).max(128, { message: "No puede contener más de 128 caracteres" }),
    sector: z.string().min(1, { message: "El rubro del negocio es obligatorio" }).max(128, { message: "No puede contener más de 128 caracteres" }),
    address: z.string().min(1, { message: "La dirección del negocio es obligatoria" }).max(128, { message: "No puede contener más de 128 caracteres" }),
    city: z.string().min(1, { message: "La ciudad del negocio es obligatoria" }).max(128, { message: "No puede contener más de 128 caracteres" }),
    telephone: z.string().min(1, { message: "El teléfono  del negocio es obligatorio" }).max(128, { message: "No puede contener más de 128 caracteres" }),
});

type StoreValues = z.infer<typeof formSchema>;
export const StoreModal = () => {

    const storeModal = useStoreModal(); // state management for the modal.

    const [loading, setLoading] = useState(false);

    const form = useForm<StoreValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rut: "",
            name: "",
            fantasyName: "",
            sector: "",
            address: "",
            city: "",
            telephone: "",
        },
    });

    const onSubmit = async (values: StoreValues) => {
        try {
            setLoading(true);
            const response = await axios.post('/api/stores', values);
            // "window.location.assign" Does a refresh unlike the next router.
            // Using next router would sometimes cause the store modal to remain even after creating a store.
            window.location.assign(`/${response.data.id}`);

        } catch (error) {
            toast.error("Ocurrió un problema inesperado.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            title="Crear un nuevo negocio"
            description="Añade un nuevo negocio para comenzar a utilizar la herramienta. Estos datos serán visibles en las facturas."
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-4 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Business's RUT */}
                            <FormField
                                control={form.control}
                                name="rut"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>RUT del negocio</FormLabel>
                                        <FormControl>
                                            {/* We spread 'field' to gain access to all its props */}
                                            <Input
                                                disabled={loading}
                                                placeholder="21548349011..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Company name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre de la empresa</FormLabel>
                                        <FormControl>
                                            {/* We spread 'field' to gain access to all its props */}
                                            <Input
                                                disabled={loading}
                                                placeholder="ENTUER SRL..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Business's fantasy name */}
                            <FormField
                                control={form.control}
                                name="fantasyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre fantasía</FormLabel>
                                        <FormControl>
                                            {/* We spread 'field' to gain access to all its props */}
                                            <Input
                                                disabled={loading}
                                                placeholder="La princesa..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Business's sector */}
                            <FormField
                                control={form.control}
                                name="sector"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rubro del negocio</FormLabel>
                                        <FormControl>
                                            {/* We spread 'field' to gain access to all its props */}
                                            <Input
                                                disabled={loading}
                                                placeholder="Fábrica de pastas..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Business's address */}
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dirección del negocio</FormLabel>
                                        <FormControl>
                                            {/* We spread 'field' to gain access to all its props */}
                                            <Input
                                                disabled={loading}
                                                placeholder="José E. Rodó..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Business's city */}
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ciudad del negocio</FormLabel>
                                        <FormControl>
                                            {/* We spread 'field' to gain access to all its props */}
                                            <Input
                                                disabled={loading}
                                                placeholder="Montevideo..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Business's telephone */}
                            <FormField
                                control={form.control}
                                name="telephone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teléfono del negocio</FormLabel>
                                        <FormControl>
                                            {/* We spread 'field' to gain access to all its props */}
                                            <Input
                                                disabled={loading}
                                                placeholder="2400 2066 - 2402 3598..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button
                                    disabled={loading}
                                    variant="outline"
                                    onClick={storeModal.onClose}
                                    type="button" // if not specified the cancel button will also submit.
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    disabled={loading}
                                    type="submit"
                                >
                                    Continuar
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>


    )
}