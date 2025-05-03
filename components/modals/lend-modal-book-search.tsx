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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DialogClose } from "../ui/dialog";
import { Badge } from "../ui/badge";

// Base schema.
const baseSchema = z.object({
    inventario: z.string().min(1, { message: "Debes poporcionar un número de inventario." })
})

// Extended schema for return action
const extendedSchema = baseSchema.extend({
    fechaDevolucionFinal: z.date({
        required_error: "Debes seleccionar una fecha.",
    }),
})

// Conditional schema type
type BookSearchModalFormValues = z.infer<typeof baseSchema> | z.infer<typeof extendedSchema>

interface BookSearchModalProps {
    isOpen: boolean,
    onClose: () => void,
    actionType: "lend" | "return",
}

export const BookSearchModal: React.FC<BookSearchModalProps> = ({
    isOpen,
    onClose,
    actionType,
}) => {

    const [openDatePicker, setOpenDatePicker] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const router = useRouter()

    const title = actionType === "lend" ? "Prestar libro" : "Devolver libro"
    const description = actionType === "lend" ?
        "Introduce el Nº de inventario de un libro para prestarlo"
        :
        <div className="flex gap-x-2">Busca un libro prestado para marcarlo como <Badge variant="devuelto">DEVUELTO</Badge></div>
    const action = actionType === "lend" ? "Prestar" : "Devolver"

    const defaultValues = {
        inventario: '',
        ...(actionType === "return" ? { fechaDevolucionFinal: new Date() } : {}),
    }

    const formSchema = actionType === "return" ? extendedSchema : baseSchema;
    const form = useForm<BookSearchModalFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    })

    const onSubmit = async (data: BookSearchModalFormValues) => {
        setLoading(true)
        try {
            // fetch the book by its inventory number and redirect to the lending page.
            console.log(data)
            const res = await axios.get(`/api/libros/${data.inventario}`)
            console.log(res)

            if (actionType === "lend") {
                // Open in a new tab.
                window.open(`/prestamos/prestar/${res.data.book.inventario}`)
                onClose()
                form.reset()
            } else if (actionType === "return") {
                if (!res.data.lended) {
                    // The book is not lended, show an error message.
                    form.setError("inventario", {
                        type: "custom",
                        message: `No se encontró un préstamo para el libro con el número ${data.inventario}.`
                    })
                } else {
                    // Mark the book as returned.
                    await axios.patch(`/api/prestamos/devolver/${res.data.lendingId}`, {
                        fechaDevolucionFinal: (data as z.infer<typeof extendedSchema>).fechaDevolucionFinal,
                    })
                    toast.success("Libro devuelto correctamente");
                    onClose()
                    form.reset()
                    router.refresh()
                }
            }

            setLoading(false)

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
            title={title}
            description={description}
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
                    {actionType === "return" && (
                        <FormField
                            control={form.control}
                            name="fechaDevolucionFinal"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha de devolución del libro</FormLabel>
                                    <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: es })
                                                    ) : (
                                                        <span>Selecciona una fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                locale={es}
                                                selected={field.value}
                                                onSelect={(e) => {
                                                    field.onChange(e)
                                                    setOpenDatePicker(false)
                                                }}
                                                fromDate={new Date()}
                                            // initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </form>
            </Form >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <DialogClose asChild>
                    <Button
                        disabled={loading}
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                </DialogClose>
                <Button
                    disabled={loading}
                    className={`ml-auto ${actionType === "return" && "bg-green-500 hover:bg-green-600"}`}
                    type="submit"
                    form="book-search-form"
                >
                    {action}
                </Button>
            </div>
        </Modal >
    );
};