"use client";

import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { Address, Client, Prisma, Zone } from "@prisma/client";
import { useState } from "react";
import { Decimal } from "@prisma/client/runtime/library";

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

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ClientAddressesProps extends PopoverTriggerProps {
    currentClient: (Client & { addresses: Address[] }) | null;
    disabled: boolean;
    form: any;
    zones: Zone[];
    addressAsTitle: { deliveryAddress: string, deliveryZoneId: string, deliveryZoneCost: Decimal };
    setAddressAsTitle: React.Dispatch<React.SetStateAction<{ deliveryAddress: string, deliveryZoneId: string, deliveryZoneCost: Decimal }>>;
};

export default function ClientAddresses({
    className,
    currentClient,
    disabled,
    form,
    zones,
    addressAsTitle,
    setAddressAsTitle,
}: ClientAddressesProps) {

    const [open, setOpen] = useState(false);

    // Add an address
    const onAddressSelect = (address: string, zoneId: string) => {
        if (address) {
            form.setValue('deliveryAddress', address);
            form.setValue('deliveryZoneId', zoneId);
            form.setValue('deliveryZoneCost', Number(zones.find((zone) => zone.id === currentClient?.addresses[0].zoneId)?.cost));
            setAddressAsTitle({
                deliveryAddress: address,
                deliveryZoneId: zoneId,
                deliveryZoneCost: new Prisma.Decimal(0),
            });
            setOpen(false);
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Selecciona un cliente"
                    className={cn("w-full justify-between", className)}
                    disabled={disabled}>
                    <div className="flex items-center gap-x-2 overflow-hidden">
                        <MapPin className="flex-none mr-2 h-4 w-4" />
                        <p className="truncate">
                            {addressAsTitle.deliveryAddress || "Selecciona una dirección..."}
                        </p>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Escribe para buscar..." />
                        <CommandEmpty>
                            <div className="flex items-center justify-center gap-x-2 font-normal">
                                <p>No se registra la dirección.</p>
                            </div>
                        </CommandEmpty>
                        <CommandGroup heading="Direcciones">
                            {currentClient?.addresses.map((address) => (
                                <CommandItem
                                    key={address.id}
                                    onSelect={() => onAddressSelect(address.address, address.zoneId)}
                                >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    <p className="truncate">{address.address}</p>
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            // UX: If the selected address is the current address we style it as 'active'.
                                            addressAsTitle.deliveryAddress === address.address
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}