/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Libro, Prestamo, Socio } from "@prisma/client";
import * as z from "zod";
import { ArrowLeft, CalendarIcon, Check, ChevronsUpDown, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

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
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { CommandEmpty } from "cmdk";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const formSchema = z.object({
    idLibro: z.string().min(1, { message: 'Debes seleccionar un libro' }),
    idSocio: z.string().min(1, { message: 'Debes seleccionar un socio' }),
    fechaPrestado: z.date({
        required_error: "Debes seleccionar una fecha.",
    }),
    fechaDevolucionEstipulada: z.date({
        required_error: "Debes seleccionar una fecha.",
    }),
});

type LendingFormByBookValues = z.infer<typeof formSchema>;

interface LendingFormByBookProps {
    book: Libro | null;
    members: Socio[] | null;
    lended: boolean;
    lendings: (Prestamo & { socio: Socio })[];
}

export const LendingFormByBookForm: React.FC<LendingFormByBookProps> = ({
    book,
    members,
    lended,
    lendings
}) => {

    // const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    const title = "Préstamo de libro";
    const description = book?.titulo || "";
    const toastMessage = "Préstamo registrado";
    const action = "Registrar préstamo";

    const defaultValues = {
        idSocio: '',
    }

    const form = useForm<LendingFormByBookValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    // const { watch } = form;

    const onSubmit = async (data: LendingFormByBookValues) => {
        try {
            setLoading(true);
            // Create the lending.
            if (!book?.isArchived) {
                await axios.post(`/api/prestamos/prestar`, data);

                router.push(`/prestamos`);
                router.refresh(); // Refresh the component so it refetches the patched data.
                toast.success(toastMessage);
            } else {
                toast.error("No se puede prestar el libro, está archivado.")
            }
        } catch (error: any) {
            if (error.response.status === 409) {
                toast.error(`Ocurrió un error al generar el Nº de préstamo.`);
            } else {
                toast.error("Ocurrió un error inesperado.");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (book?.inventario) {
            form.setValue("idLibro", book?.inventario.toString());
        }
    }, [])

    return (
        lended ?
            (
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="py-6 px-8 mx-4 max-w-[600px] rounded-2xl bg-destructive text-destructive-foreground">
                        <p className="font-semibold text-lg">
                            Libro ya prestado
                        </p>
                        <p>
                            El libro (Nº inventario {book?.inventario}) está en manos de <span className="italic">{lendings[0].socio.nombre} {lendings[0].socio.apellido}</span>.
                        </p>
                        <p>
                            Se espera que lo devuelva el <span className="italic">{format(lendings[0].fechaDevolucionEstipulada, "dd MMMM, yyyy", { locale: es })}</span>
                        </p>
                        <div className="text-sm mt-2">
                            <Badge variant="secondary">ID del préstamo: {lendings[0].id}</Badge>
                        </div>
                        <div className="mt-4">
                            <Link className="underline" href={`/prestamos/${lendings[0].id}`}>Ver préstamo</Link>
                        </div>
                        <div className="mt-4">
                            <Link className="underline" href='/libros'>Volver al listado de libros</Link>
                        </div>
                    </div>
                </div>
            ) : (
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
                                onClick={() => router.back()}
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
                        <form id="book-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="flex flex-col gap-y-8">

                                    {/* Socio picker */}
                                    <FormField
                                        control={form.control}
                                        name="idSocio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Socio</FormLabel>
                                                <Popover open={open} onOpenChange={setOpen}>
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
                                                                    ? members?.find(
                                                                        (member) => member.id.toString() === field.value
                                                                    )?.nombre + " "
                                                                    : "Selecciona un socio"}

                                                                {field.value
                                                                    ? members?.find(
                                                                        (member) => member.id.toString() === field.value
                                                                    )?.apellido
                                                                    : ""}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent align="start" className="w-full p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Busca un socio por nombre..." />
                                                            <CommandList>
                                                                <CommandEmpty className="text-sm flex justify-center p-2">No se encontró el socio.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {members?.map((member) => (
                                                                        <CommandItem
                                                                            value={`${member.nombre} ${member.apellido}`}
                                                                            key={member.id}
                                                                            onSelect={() => {
                                                                                form.setValue("idSocio", member.id.toString())
                                                                                setOpen(false)
                                                                            }}
                                                                            className="flex cursor-pointer"
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    member.id.toString() === field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            <div className="border-l-4 border-orange-500 pl-2 pr-4">
                                                                                <p className="flex items-center font-semibold">Nº {member.id}: {member.nombre} {member.apellido}</p>
                                                                                <p className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{member.direccion}</p>
                                                                                <p className="flex items-center"><Phone className="h-4 w-4 mr-2" />{member.telefono}</p>
                                                                                <div className="flex items-center my-2"><Badge variant="outline">{member.ubicacion}</Badge></div>
                                                                            </div>
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

                                    <div className="grid grid-cols-1  gap-8">
                                        {/* fechaPrestado date picker */}
                                        <FormField
                                            control={form.control}
                                            name="fechaPrestado"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Fecha de inicio del préstamo</FormLabel>
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
                                                    <FormLabel>Fecha de vencimiento del préstamo</FormLabel>
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
                                                                    setOpen3(false)
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
                                                        La fecha en la que se espera que se devuelva el libro.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                            </div>
                        </form>
                    </Form>
                </>
            )
    )
}