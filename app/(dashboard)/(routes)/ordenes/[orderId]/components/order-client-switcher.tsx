"use client";

import { Check, ChevronsUpDown, User } from "lucide-react";
import { Address, Client, Prisma, Product, Zone } from "@prisma/client";
import { useState } from "react";

// local imports.
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandItem,
    CommandGroup,
} from "@/components/ui/command";
import { FormLabel } from "@/components/ui/form";
import { Decimal } from "@prisma/client/runtime/library";
import { Badge } from "@/components/ui/badge";


type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ClientSwitcherProps extends PopoverTriggerProps {
    clients: (Client & { addresses: ({ zone: Zone } & Address)[] })[];
    currentClient: Client & { addresses: ({ zone: Zone } & Address)[] } | null;
    disabled: boolean;
    form: any;
    setCurrentClient: React.Dispatch<React.SetStateAction<Client & { addresses: ({ zone: Zone } & Address)[] } | null>>;
    setAddressAsTitle: React.Dispatch<React.SetStateAction<{ deliveryAddress: string, deliveryZoneId: string, deliveryZoneCost: Decimal }>>;

    setBoughtProducts: React.Dispatch<React.SetStateAction<{ product: Product, calculatedPrice: Decimal | any, quantity: Decimal | any }[]>>;
};

export default function ClientSwitcher({
    className,
    clients = [],
    currentClient,
    disabled,
    form,
    setCurrentClient,
    setAddressAsTitle,
    setBoughtProducts, // to reset bought products on client select
}: ClientSwitcherProps) {

    const formattedItems = clients.map((client) => ({
        // label: client.storeId === "newClient" ? "" : client.addresses[0].address,
        label: client.addresses.length < 1 ? "" : client.addresses[0].address, // if addresses.length < 1 then we know the client has no registered addresses.
        name: client.name,
        value: client.phone,
        type: client.type,
    }));

    const currentSelectedClient = currentClient ? formattedItems.find((item) => item.value === currentClient.phone) : null;

    const [open, setOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const onClientSelect = (phone: string) => {
        setBoughtProducts([]);
        const client = clients.find((c) => c.phone === phone) || null;
        if (client) {
            form.setValue('clientId', client.phone);
            form.setValue('deliveryName', client.name);
            form.setValue('deliveryAddress', client.addresses.length < 1 ? "" : client.addresses[0].address);
            form.setValue('deliveryZoneId', client.addresses.length < 1 ? "" : client.addresses[0].zoneId);
            form.setValue('deliveryZoneCost', client.addresses.length < 1 ? "" : client.addresses[0].zone.cost);
            setCurrentClient(client);
            setAddressAsTitle({
                deliveryAddress: client.addresses.length > 0 ? client.addresses[0].address : "",
                deliveryZoneCost: client.addresses[0].zone.cost,
                deliveryZoneId: "",
            });
        } else {
            // Case when the user typed a new phone number.
            // We insert a new client object at the end of the clients array and then update the form value to that new client we made.
            // This client will be inserted in the DB later with the provided name and address.
            const lastItemIdx = clients.push({
                phone: phone,
                storeId: "newClient", // hacky way to improve UX
                name: "",
                type: "particular",
                socialReason: "",
                ruc: "",
                addresses: [],
                discount: new Prisma.Decimal(0),
                isArchived: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }) - 1;

            form.setValue('clientId', clients[lastItemIdx].phone);
            form.setValue('deliveryName', "");
            form.setValue('deliveryAddress', "");
            form.setValue('deliveryZoneId', "");
            form.setValue('deliveryZoneCost', "");

            setAddressAsTitle({
                deliveryAddress: "",
                deliveryZoneId: "",
                deliveryZoneCost: new Prisma.Decimal(0),
            });
            setCurrentClient(clients[lastItemIdx]);
        }
        setSearchInput("");
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen} >
            <FormLabel>Número</FormLabel>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Selecciona un cliente"
                    className={cn("w-full justify-between", className)}
                    disabled={disabled}>
                    <div className="flex items-center gap-x-2">
                        <User className="flex-none mr-2 h-4 w-4" />
                        <p className="truncate">
                            {currentSelectedClient?.value}
                        </p>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[500px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Busca un cliente o escribe un número nuevo..."
                            onInput={(event) => {
                                setSearchInput(event.currentTarget.value);
                            }}
                        />
                        <CommandEmpty>
                            No se encontró ningún cliente.
                        </CommandEmpty>
                        <CommandGroup heading="Clientes">
                            {formattedItems.map((client) => (
                                <CommandItem
                                    key={client.value}
                                    onSelect={() => onClientSelect(client.value)}
                                    className="cursor-pointer"
                                >
                                    <User className="flex-none mr-2 h-4 w-4" />
                                    <div className="truncate">{client.value}<br />{client.name}<br />{client.label}<br /><Badge className="my-1" variant="outline">{client.type.toUpperCase()}</Badge></div>
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            // UX: If the selected client is the current client we style it as 'active'.
                                            currentSelectedClient?.value === client.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>

                    {/* Redundant UI for improved UX */}
                    {searchInput &&
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            <Button
                                variant={"outline"}
                                className="w-[98%]"
                                onClick={() => onClientSelect(searchInput)}
                            >
                                <div className="flex items-center justify-center gap-x-2 font-normal">
                                    <p>Usar este número nuevo</p>
                                    <Check />
                                </div>
                            </Button>
                        </div>
                    }

                </Command>
            </PopoverContent>
        </Popover>
    );
};