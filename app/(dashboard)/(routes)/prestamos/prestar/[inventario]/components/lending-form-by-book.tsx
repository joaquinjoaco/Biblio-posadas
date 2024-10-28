"use client";

import { Libro, Socio } from "@prisma/client";
import * as z from "zod";
import { ArrowLeft, CalendarIcon, Check, ChevronsUpDown, FileQuestion, IdCard, LocateIcon, MapPin, Trash } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { enUS, es } from "date-fns/locale";

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
}

export const LendingFormByBookForm: React.FC<LendingFormByBookProps> = ({
    book,
    members
}) => {

    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

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

    const { watch } = form;
    const onSubmit = async (data: LendingFormByBookValues) => {
        try {
            setLoading(true);
            // Create the lending.
            await axios.post(`/api/prestamos/prestar`, data);

            router.push(`/prestamos`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success(toastMessage);

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



    return (
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
                                                    <CommandList>
                                                        <CommandGroup>
                                                            {members?.map((member) => (
                                                                <CommandItem
                                                                    value={member.id.toString()}
                                                                    key={member.id}
                                                                    onSelect={() => {
                                                                        form.setValue("idSocio", member.id.toString())
                                                                    }}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            member.id.toString() === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <div className="divide-x-8 my-2 transition-all divide-orange-500 divide-">
                                                                        <div className="flex items-center font-medium">Nº {member.id}</div>
                                                                        <div className="flex items-center pl-2"><IdCard className="h-4 w-4 mr-2" />{member.nombre} {member.apellido}</div>
                                                                        <div className="flex items-center pl-2"><MapPin className="h-4 w-4 mr-2" />{member.direccion}</div>
                                                                        <div className="flex items-center pl-2"><LocateIcon className="h-4 w-4 mr-2" />{member.ubicacion}</div>
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
                                            <Popover>
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
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
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
                                            <Popover>
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
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
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
                        {/* 
                       
                        <div className="border rounded-md p-8">
                            <h1 className="font-semibold">Detalles:</h1>
                            <p>{watch("idLibro")}</p>
                            <p>{watch("idSocio")}</p>
                             // BUGGY AF...
                            <p>{form.getValues("fechaPrestado") ? format(form.getValues("fechaPrestado"), 'PPP', { locale: es }) : ""}</p>
                            <p>{form.getValues("fechaPrestado") ? format(form.getValues("fechaDevolucionEstipulada"), 'PPP', { locale: es }) : ""}</p>
                           

                        </div> 
                        */}
                    </div>
                </form>
            </Form>
        </>
    )
}