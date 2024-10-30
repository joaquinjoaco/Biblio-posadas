"use client";

import { Libro, Prestamo, Socio } from "@prisma/client";
import * as z from "zod";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
    fechaPrestado: z.date({
        required_error: "Debes seleccionar una fecha.",
    }),
    fechaDevolucionEstipulada: z.date({
        required_error: "Debes seleccionar una fecha.",
    }),
    fechaDevolucionFinal: z.date().optional(),
});

type LendingFormEditValues = z.infer<typeof formSchema>;

interface LendingFormEditProps {
    initialData: Prestamo & { socio: Socio, libro: Libro } | null;
}

export const LendingFormEdit: React.FC<LendingFormEditProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    const title = `Préstamo Nº ${initialData?.id}`;
    const description = `${initialData?.libro.titulo}, de ${initialData?.libro.autor}` || "";
    const toastMessage = "Préstamo actualizado";
    const action = "Editar préstamo";

    const today = new Date()

    const defaultValues = {
        fechaPrestado: initialData?.fechaPrestado,
        fechaDevolucionEstipulada: initialData?.fechaDevolucionEstipulada,
        fechaDevolucionFinal: initialData?.fechaDevolucionFinal ? initialData.fechaDevolucionFinal : undefined
    }

    const form = useForm<LendingFormEditValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit = async (data: LendingFormEditValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/prestamos/${initialData?.id}`, data);

            router.back();
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success(toastMessage);
        } catch (error: any) {
            toast.error("Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
        }
    }

    return (
        !initialData ?
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="py-6 px-8 mx-4 max-w-[600px] rounded-2xl bg-destructive text-destructive-foreground">
                    <p className="font-semibold text-lg">
                        Ups!
                    </p>
                    <p>
                        No se econtró un préstamo con número {params.id}
                    </p>
                    <Button variant="link" onClick={() => { router.back() }} className="text-destructive-foreground underline pl-0">
                        Volver
                    </Button>
                </div>
            </div>

            :
            <>
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
                    <form id="book-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full pt-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex flex-col gap-y-8">
                                <div className="grid grid-cols-1 gap-8 border p-8 rounded-md">
                                    {/* fechaPrestado date picker */}
                                    <FormField
                                        control={form.control}
                                        name="fechaPrestado"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Fecha de inicio del préstamo</FormLabel>
                                                <Popover open={open} onOpenChange={setOpen}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[240px] pl-3 text-left font-normal",
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
                                                                setOpen(false)
                                                            }}
                                                            fromDate={new Date()}
                                                            // disabled={(date) =>
                                                            //     date < new Date("1900-01-01")
                                                            // }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormDescription>
                                                    La fecha en la que se efectúa el préstamo.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* fechaDevolucionEstipulada date picker */}
                                    <FormField
                                        control={form.control}
                                        name="fechaDevolucionEstipulada"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Fecha de devolución estipulada</FormLabel>
                                                <Popover open={open2} onOpenChange={setOpen2}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[240px] pl-3 text-left font-normal",
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
                                                                setOpen2(false)
                                                            }}
                                                            fromDate={new Date()}
                                                            // disabled={(date) =>
                                                            //     date < new Date("1900-01-01")
                                                            // }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormDescription>
                                                    La fecha en la que se espera que se devuelva el libro. Sirve para determinar cuándo se vence un préstamo.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                            </div>

                            <div className="flex flex-col border-l-4 border-primary p-8 space-y-2">
                                <Badge variant="default" className="max-w-fit">
                                    <p className="font-semibold">Socio: Nº{initialData.idSocio} {initialData.socio.nombre} {initialData.socio.apellido}</p>
                                </Badge>
                                <Badge className="max-w-fit">
                                    <p>Libro: {initialData.libro.titulo}, de {initialData.libro.autor}</p>
                                </Badge>

                                {/* fechaDevolucionFinal date picker */}
                                <FormField
                                    control={form.control}
                                    name="fechaDevolucionFinal"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col pt-8">
                                            <FormLabel>Fecha de devolución final del libro</FormLabel>
                                            <Popover open={open3} onOpenChange={setOpen3}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
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
                                                            setOpen2(false)
                                                        }}
                                                        fromDate={new Date()}
                                                        // disabled={(date) =>
                                                        //     date < new Date("1900-01-01")
                                                        // }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Para marcar el libro como 'devuelto', establece la fecha de devolución final.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                        </div>
                    </form>
                </Form>
            </>

    )
}