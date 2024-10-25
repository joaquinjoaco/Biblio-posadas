import { Zone } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, formatter } from "@/lib/utils";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Decimal } from "@prisma/client/runtime/library";

interface ZonesProps {
    zones: Zone[];
    form: UseFormReturn<{
        deliveryZoneCost: number;
        clientId: string;
        deliveryName: string;
        deliveryAddress: string;
        deliveryZoneId: string;
        payment: string;
        notes?: string | undefined;
        boughtProducts?: {
            product: {
                id: string;
                storeId: string;
                name: string;
                description: string;
                isArchived: boolean;
                createdAt: Date;
                updatedAt: Date;
                price?: any;
            };
            calculatedPrice: number;
            quantity: number;
        }[] | null | undefined;
    }, any, undefined>;
    field: ControllerRenderProps<{
        clientId: string;
        deliveryName: string;
        deliveryAddress: string;
        deliveryZoneId: string;
        deliveryZoneCost: number;
        payment: string;
        notes?: string | undefined;
        boughtProducts?: {
            product: {
                name: string;
                id: string;
                storeId: string;
                description: string;
                isArchived: boolean;
                createdAt: Date;
                updatedAt: Date;
                price?: any;
            };
            calculatedPrice: number;
            quantity: number;
        }[] | null | undefined;
    }, "deliveryZoneId">;
    setAddressAsTitle: React.Dispatch<React.SetStateAction<{ deliveryAddress: string, deliveryZoneId: string, deliveryZoneCost: Decimal }>>;
    className?: string;
    disabled: boolean;
}
const Zones: React.FC<ZonesProps> = ({
    zones,
    form,
    field,
    setAddressAsTitle,
    className,
    disabled,
}) => {
    return (
        <Popover>
            <PopoverTrigger disabled={disabled} asChild className="w-full">
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground",
                        className
                    )}
                >
                    {field.value
                        ? zones.find(
                            (zone) => zone.id === field.value
                        )?.name
                        : "Selecciona una zona"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandGroup>
                        {zones.map((zone) => (
                            <CommandItem
                                value={zone.id}
                                key={zone.id}
                                onSelect={() => {
                                    form.setValue("deliveryZoneId", zone.id)
                                    setAddressAsTitle((prevState) => ({
                                        ...prevState,
                                        deliveryZoneCost: zone.cost,
                                    }))
                                }}
                            >
                                {zone.name} ({formatter.format(Number(zone.cost))})
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        zone.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default Zones;