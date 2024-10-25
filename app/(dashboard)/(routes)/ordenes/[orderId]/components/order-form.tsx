"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, ExternalLink, Printer, X } from "lucide-react";
import { Address, Client, Driver, Order, OrderItem, Prisma, Product, Zone } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import OrderProduct from "./order-product";
import { formatter } from "@/lib/utils";
import { AlertModal } from "@/components/modals/alert-modal";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import ClientSwitcher from "./order-client-switcher";
import { Checkbox } from "@/components/ui/checkbox";
import PaymentRadiogroup from "./order-payment-radiogroup";
import { Badge } from "@/components/ui/badge";
import ProductPicker from "./order-product-picker";
import ClientAddresses from "./order-client-addresses";
import Zones from "./order-address-zone";

const formSchema = z.object({
    clientId: z.string({ required_error: "Debes indicar el número del cliente" })
        .min(1, { message: "Debes seleccionar un cliente o introducir un numero nuevo" })
        .max(32, { message: "No puede contener más de 32 caracteres" })
        .refine(value => /^\d+$/.test(value), { message: "El Teléfono/RUC debe contener solo números" }),
    deliveryName: z.string({ required_error: "Debes indicar el nombre del cliente" }).min(1, { message: "El nombre del cliente es obligatorio" }).max(128, { message: "No puede contener más de 128 caracteres" }),
    deliveryAddress: z.string({ required_error: "Debes indicar la dirección del cliente" }).min(1, { message: "La dirección del cliente es obligatoria" }).max(128, { message: "No puede contener más de 128 caracteres" }),
    deliveryZoneId: z.string({ required_error: "Debes indicar la zona" }).min(1, { message: "Debes indicar la zona correspondiente" }).max(64, { message: "No puede contener más de 64 caracteres" }),
    deliveryZoneCost: z.coerce.number(),
    notes: z.string().max(1024, { message: "Las notas del pedido son demasiado largas" }).optional(),
    payment: z.string({ required_error: "Debes indicar el método de pago" }).min(1, { message: "Debes seleccionar un método de pago" }),

    boughtProducts: z.object({
        product: z.object({
            id: z.string(),
            storeId: z.string(),
            name: z.string(),
            description: z.string().default(''),
            price: z.any(),
            isArchived: z.boolean().default(false),
            createdAt: z.date(),
            updatedAt: z.date(),
        }),
        calculatedPrice: z.number(),
        quantity: z.number(),
    }).array().min(1, { message: "Debes seleccionar al menos 1 (un) producto" }).nullish(),
});

type OrderFormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
    initialData: Order & {
        orderItems: (OrderItem & { product: Product })[],
        client: Client & { addresses: ({ zone: Zone } & Address)[] },
        driver: Driver | null,
    } | null;
    products: Product[];
    clients: (Client & { addresses: ({ zone: Zone } & Address)[] })[];
    zones: Zone[];
}

const OrderForm: React.FC<OrderFormProps> = ({
    initialData,
    products,
    clients,
    zones,
}) => {

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...initialData,
            deliveryZoneCost: parseFloat(String(initialData?.deliveryZoneCost))
        } || {
            clientId: '',
            deliveryName: '',
            deliveryAddress: '',
            deliveryZoneId: '',
            notes: '',
            payment: '',
            boughtProducts: [],
        }
    });

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const disable = initialData ? true : false; // False if there is initialData, used to disable all fields when viewing an existing order.
    const [edit, setEdit] = useState(false);

    const [currentClient, setCurrentClient] = useState<Client & { addresses: ({ zone: Zone } & Address)[] } | null>(initialData?.client ? initialData.client : null);
    // Don't know how to manage this number & decimal type problem. I need calculatedPrice and quantity to be a decimal.
    const [boughtProducts, setBoughtProducts] = useState<{ product: Product, calculatedPrice: Decimal | any, quantity: Decimal | any }[]>(initialData ?
        initialData.orderItems.map((orderItem) => ({ product: orderItem.product, calculatedPrice: orderItem.calculatedPrice, quantity: orderItem.quantity }))
        :
        []);
    const [payment, setPayment] = useState<"pos" | "efectivo" | "transferencia" | "">("");
    const [isDifferentAddress, setIsDifferentAddress] = useState(initialData ? initialData.differentAddress : false);
    const [addressAsTitle, setAddressAsTitle] = useState(initialData ? { deliveryAddress: initialData.deliveryAddress, deliveryZoneId: initialData.deliveryZoneId, deliveryZoneCost: initialData.deliveryZoneCost } : { deliveryAddress: "", deliveryZoneCost: new Prisma.Decimal(0), deliveryZoneId: "" });

    const subTotalPrice = boughtProducts.reduce((total, item) => {
        return total + (Number(item.calculatedPrice) * Number(item.quantity))
    }, 0);
    // const totalPrice = initialData ? initialData.totalPrice : subTotalPrice + Number(zones.find((zone) => zone.id === form.getValues('deliveryZoneId'))?.cost);
    const totalPrice = initialData ? initialData.totalPrice : subTotalPrice;
    const title = initialData ? initialData.deliveryAddress : addressAsTitle.deliveryAddress || "Nuevo pedido";
    const description = initialData ? `Pedido de ${initialData.deliveryName} (Teléfono: ${initialData.clientId})` : "Registra un nuevo pedido";
    const toastMessage = initialData ? "Pedido actualizado" : "Pedido creado";
    const action = initialData ? "Guardar cambios" : "Imprimir pedido";

    // Print order
    const printOrder = (orderId: string) => {
        window.open(`/${params.storeId}/ordenes/${orderId}/imprimir`);
    }

    // Submit
    const onSubmit = async (data: OrderFormValues) => {
        const orderData = {
            ...data,
            differentAddress: isDifferentAddress,
            totalPrice: totalPrice,
        }
        try {
            setLoading(true);
            let response;
            if (initialData) {
                // Only update the order payment type.
                response = await axios.patch(`/api/${params.storeId}/ordenes/${params.orderId}`, { payment: data.payment });
                setEdit(false);
            } else {
                // Create the order.
                response = await axios.post(`/api/${params.storeId}/ordenes`, { data: orderData });
            }

            router.push(`/${params.storeId}/ordenes`);
            router.refresh(); // Refresh the component so it refetches the data.
            toast.success(toastMessage);
            printOrder(response.data.id);
        } catch (error) {
            toast.error("Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
        }
    }

    // Cancel
    const onCancelOrder = async () => {
        try {
            setLoading(true);

            await axios.patch(`/api/${params.storeId}/ordenes/${params.orderId}/cancelar`);

            router.push(`/${params.storeId}/ordenes`);
            router.refresh(); // Refresh the component so it refetches the data.
            toast.success("Pedido cancelado.");

        } catch (error) {
            toast.error("Ocurrió un error inesperado.")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    useEffect(() => {
        // Seems that when we have initialData and this useEffect runs it goes 'undefined'.
        // Fix is to only do form.setValue() when there is no initial data to avoid this conflict.
        // This is anyways it's intended purpose. To run when we update boughtProducts through the ProductPicker when there is no initialData.
        if (!initialData) {
            form.setValue('boughtProducts', boughtProducts);
        }
    }, [boughtProducts]);

    // Hacky UX to make the current address reset when checking isDifferentAddress to false.
    // Doesm't run when there is initialData.
    useEffect(() => {
        if (!initialData && currentClient && !isDifferentAddress) {
            setAddressAsTitle({
                deliveryAddress: currentClient.addresses[0].address,
                deliveryZoneCost: currentClient.addresses[0].zone.cost,
                deliveryZoneId: currentClient.addresses[0].zone.id,
            });
            form.setValue('deliveryAddress', currentClient.addresses[0].address);
            form.setValue('deliveryZoneId', currentClient.addresses[0].zoneId);
            form.setValue('deliveryZoneCost', Number(zones.find((zone) => zone.id === currentClient.addresses[0].zoneId)?.cost));
        }
    }, [isDifferentAddress]);

    useEffect(() => {
        document.title = initialData ? initialData.deliveryAddress : "Nuevo pedido";
    }, [initialData]);

    useEffect(() => {
        if (!initialData) {
            document.title = addressAsTitle.deliveryAddress ? addressAsTitle.deliveryAddress : "Nuevo pedido";
        }
    }, [addressAsTitle]);

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onCancelOrder}
                loading={loading}
                title="¿Cancelar pedido?"
                description="Se cancelará el pedido, esta acción no se puede deshacer. Podrás encontrar el pedido en la vista general o de cancelados donde podrás eliminarlo."
                buttonMessage="Confirmar"
            />
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background py-4">
                <div>
                    <Heading
                        title={title}
                        description={description}
                    />
                    {initialData &&
                        <div className="flex flex-col sm:flex-row gap-x-2">
                            <Badge className="py-1 mt-2">{format(initialData.createdAt, "dd MMMM, yyyy (HH:mm)", { locale: es })}</Badge>
                            {initialData.driver ?
                                <Link
                                    href={`/${params.storeId}/repartidores/${initialData.driverId}/historial`}
                                    target="_blank">
                                    <Badge className="py-1 mt-2 flex flex-row items-center gap-x-2" variant={initialData.status as "enviado" | null | undefined}>
                                        <ExternalLink className="h-4 w-4" />
                                        {initialData.status.toUpperCase()}
                                        {initialData.driver ? ` (${initialData.driver.name})` : ""}
                                    </Badge>
                                </Link>
                                :
                                <Badge className="py-1 mt-2 flex flex-row items-center gap-x-2" variant={initialData.status as "emitido" | "enviado" | "cancelado"}>
                                    {initialData.status.toUpperCase()}
                                </Badge>
                            }
                        </div>
                    }
                </div>
                <div className="flex gap-x-2">

                    {(initialData && !edit) &&
                        <>
                            {/* Back button */}
                            <Button
                                onClick={() => router.push(`/${params.storeId}/ordenes/`)}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Button>
                            {/* Edit & Cancel order button */}
                            {initialData.status !== "cancelado" &&
                                <>
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
                                    <Button
                                        disabled={loading}
                                        variant="secondary"
                                        // size="sm"
                                        onClick={() => printOrder(params.orderId as string)}
                                        type="button"
                                        className="gap-x-2"
                                    >
                                        <Printer className="h-4 w-4" />
                                        Imprimir
                                    </Button>
                                    <Button
                                        disabled={loading}
                                        variant="destructive"
                                        // size="sm"
                                        onClick={() => setOpen(true)}
                                        type="button"
                                        className="gap-x-2"
                                    >
                                        <X className="h-4 w-4" />
                                        Cancelar pedido
                                    </Button>
                                </>
                            }
                        </>
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

                    {/* Submit Button */}
                    {(!initialData || edit) &&
                        <Button
                            form="order-form"
                            type="submit"
                            // onClick={() => {
                            // console.log(form.getValues())
                            // }}
                            disabled={loading}
                            className="ml-auto px-12"
                        // size="sm"
                        >
                            {action}
                        </Button>
                    }
                </div>
            </div>

            <Separator />

            <Form {...form}>
                <form id="order-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="flex flex-col space-y-12 lg:space-y-0 lg:flex-row lg:space-x-6">

                        {/* Left side */}
                        <div className="mt-4 flex-1 space-y-6">
                            <p className="text-md font-semibold">Datos del pedido</p>
                            {/* Client switcher */}
                            <FormField
                                control={form.control}
                                name="clientId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <ClientSwitcher
                                                {...field}
                                                clients={clients}
                                                currentClient={currentClient}
                                                disabled={loading || disable}
                                                form={form}
                                                setCurrentClient={setCurrentClient}
                                                setAddressAsTitle={setAddressAsTitle}
                                                setBoughtProducts={setBoughtProducts}
                                            />
                                        </FormControl>
                                        {currentClient && currentClient.storeId !== "newClient" &&
                                            <Link
                                                href={`/${params.storeId}/clientes/${currentClient.phone}/historial`}
                                                target="_blank"
                                                className="flex flex-row items-center text-sm text-sky-600"
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Ver historial de {currentClient.name}
                                            </Link>
                                        }
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            {/* Different address checkbox */}
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <Checkbox
                                    checked={isDifferentAddress}
                                    onCheckedChange={() => setIsDifferentAddress(!isDifferentAddress)}
                                    disabled={loading || disable || currentClient?.storeId === "newClient"}
                                />
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Enviar a una dirección diferente
                                    </FormLabel>
                                    <FormDescription>
                                        Podrás escribir una nueva dirección si necesitas enviar a una dirección distinta a las registradas para el cliente seleccionado. Esta nueva dirección será registrará automáticamente al crearse el pedido.
                                    </FormDescription>
                                </div>
                            </FormItem>

                            {/* Client's name */}
                            <FormField
                                control={form.control}
                                name="deliveryName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={loading || currentClient?.storeId !== "newClient"}
                                                placeholder="Nombre del cliente"
                                                // value={currentClient?.name || ''}
                                                onChange={(e) => {
                                                    // Update the form value
                                                    // form.setValue('name', e.target.value);
                                                    field.onChange(e);
                                                }}
                                                className="font-semibold"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-1 gap-x-2">
                                {/* Delivery address */}
                                <FormField
                                    control={form.control}
                                    name="deliveryAddress"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Dirección</FormLabel>
                                            <FormControl>
                                                {/* Simple address input field for when they are a new client, have no address, one address, or when sending to a different unregistered address */}
                                                {(currentClient?.addresses.length === 1 || isDifferentAddress || currentClient?.storeId === "newClient") &&
                                                    <Input
                                                        {...field}
                                                        disabled={loading || disable || (!isDifferentAddress && currentClient?.storeId !== "newClient")}
                                                        placeholder="Dirección del envío"
                                                        onChange={(e) => {
                                                            // Update the form value
                                                            // form.setValue('name', e.target.value);
                                                            field.onChange(e);
                                                            setAddressAsTitle({
                                                                ...addressAsTitle,
                                                                deliveryAddress: e.currentTarget.value,
                                                            });
                                                        }}
                                                        className={`font-semibold w-full flex-1 ${currentClient?.storeId !== "newClient" && "enabled:border-yellow-400"}`}
                                                    />}
                                            </FormControl>
                                            {/* Client address switcher for when the client has more than 1 address registered */}
                                            {((currentClient?.addresses.length !== 1 && currentClient?.storeId !== "newClient") && !isDifferentAddress) &&
                                                <ClientAddresses
                                                    addressAsTitle={initialData ? { deliveryAddress: initialData.deliveryAddress, deliveryZoneCost: initialData.deliveryZoneCost, deliveryZoneId: initialData.deliveryZoneId } : addressAsTitle}
                                                    setAddressAsTitle={setAddressAsTitle}
                                                    currentClient={currentClient}
                                                    disabled={loading || disable}
                                                    form={form}
                                                    zones={zones}
                                                />}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Delivery zone */}
                                <FormField
                                    control={form.control}
                                    name="deliveryZoneId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Zona</FormLabel>
                                            <FormControl>
                                                <Zones
                                                    field={field}
                                                    form={form}
                                                    zones={zones}
                                                    setAddressAsTitle={setAddressAsTitle}
                                                    disabled={loading || disable
                                                        || (!isDifferentAddress && currentClient?.storeId !== "newClient")
                                                    }
                                                    className="font-semibold"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Order notes */}
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notas del pedido (opcional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                disabled={loading || disable}
                                                placeholder="Observaciones..."
                                                className="font-semibold"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        {/* Right side */}
                        <div className="flex-1 space-y-6">

                            <div className="space-y-6 rounded-lg border border-slate-200 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-4 lg:p-8">
                                <div>
                                    <div className="flex text-md font-bold items-center gap-x-2">
                                        Pedido {initialData ?
                                            <Badge variant={"secondary"}>{initialData.payment.toUpperCase()}</Badge>
                                            :
                                            payment ? <Badge variant={"secondary"}>{payment.toUpperCase()}</Badge> : null
                                        }
                                    </div>

                                    {!initialData &&
                                        <>
                                            <FormDescription className="mt-2 mb-4">Selecciona los productos para armar el pedido.</FormDescription>
                                            <FormField
                                                control={form.control}
                                                name="boughtProducts"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormControl>
                                                            <ProductPicker
                                                                items={products}
                                                                boughtProducts={boughtProducts}
                                                                setBoughtProducts={setBoughtProducts}
                                                                discount={currentClient ? Number(currentClient.discount) : 0}
                                                                disabled={loading || disable}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </>
                                    }

                                    {Number(currentClient?.discount) > 0 && <p className="text-muted-foreground mt-2 text-sm">Descuento para el cliente: {Number(currentClient?.discount)}%</p>}

                                </div>

                                <div className="space-y-4">

                                    {boughtProducts.map((boughtProduct, idx) => (
                                        <OrderProduct
                                            key={boughtProduct.product.id}
                                            data={boughtProduct}
                                            boughtProducts={boughtProducts}
                                            setBoughtProducts={setBoughtProducts}
                                            discount={currentClient ? currentClient.discount : new Prisma.Decimal(0)}
                                            disabled={loading || disable}
                                        />
                                    ))}
                                    {/* {addressAsTitle.deliveryAddress &&
                                        <p className="mt-2 text-sm text-end">
                                            Envío a: {addressAsTitle.deliveryAddress} ({formatter.format(Number(addressAsTitle.deliveryZoneCost))})
                                        </p>
                                    } */}
                                    <div className="mt-6 space-y-4">
                                        <div className="flex items-center justify-between border-t py-4 border-gray-200 pt-4">
                                            <div className="text-xl font-bold">
                                                Total
                                            </div>
                                            <div className="text-xl font-extrabold">
                                                {formatter.format(Number(totalPrice))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment method */}
                            <FormField
                                control={form.control}
                                name="payment"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormMessage />
                                        <FormControl>
                                            <PaymentRadiogroup
                                                {...field}
                                                payment={initialData ? initialData.payment : payment}
                                                // handlePaymentChange={handlePaymentChange}
                                                setPayment={setPayment}
                                                form={form}
                                                disabled={edit ? false : loading || disable}
                                                className={edit ? "border-yellow-400" : ""}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>

                </form>
            </Form>
        </>
    );
}

export default OrderForm;