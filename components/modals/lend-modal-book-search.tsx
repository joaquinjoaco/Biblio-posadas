/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import axios from "axios";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    inventario: z.string().min(1, { message: "Debes poporcionar un número de inventario." })
});

type LendingFormByBookValues = z.infer<typeof formSchema>;

interface LendModalProps {
    isOpen: boolean,
    onClose: () => void;
}

export const LendModal: React.FC<LendModalProps> = ({
    isOpen,
    onClose,
}) => {

    const [loading, setLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    const defaultValues = {
        inventario: '',
    }

    const form = useForm<LendingFormByBookValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit = async (data: LendingFormByBookValues) => {
        setLoading(true)
        try {
            // fetch the book by its inventory number and redirect to the lending page.
            const book = await axios.get(`/api/libros/${data.inventario}`)
            // router.push(`/prestamos/prestar/${book.data.inventario}`)
            window.open(`/prestamos/prestar/${book.data.inventario}`)
            setLoading(false)
            onClose()
            form.reset()
        } catch (error: any) {
            if (error.status === 404) {
                form.setError("inventario", {
                    type: "custom",
                    message: `No se encontró un libro con el número ${data.inventario}.`
                })
            } else {
                form.setError("inventario", {
                    type: "custom",
                    message: `Ocurrió un error inesperado. ${error.message}`
                })
            }
            setLoading(false)
        }
    }

    useEffect(() => {
        setIsMounted(true)
    }, [])


    if (!isMounted) {
        return null
    }

    return (
        <Modal
            title={"Prestar libro"}
            description={"Introduce el Nº de inventario de un libro para prestarlo"}
            isOpen={isOpen}
            onClose={() => {
                onClose()
                form.reset()
            }}
        >
            <Form {...form}>
                <form id="book-search-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField
                        control={form.control}
                        name="inventario"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nº de inventario del libro</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} placeholder="Nº de inventario" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                    disabled={loading}
                    variant="outline"
                    onClick={onClose}
                >
                    Cancelar
                </Button>
                <Button
                    disabled={loading}
                    className="ml-auto"
                    type="submit"
                    form="book-search-form"
                >
                    Prestar libro
                </Button>
            </div>
        </Modal >
    );
};