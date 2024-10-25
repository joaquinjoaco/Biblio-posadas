import { CheckIcon, ChevronsUpDown, PlusCircle, Trash } from "lucide-react";
import { Zone } from "@prisma/client";
import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn, formatter } from "@/lib/utils";

interface ClientAddressesProps {
    form: UseFormReturn<{
        discount: number;
        phone: string;
        name: string;
        addresses: {
            address: string;
            zoneId: string;
        }[];
        isArchived?: boolean | undefined;
        socialReason?: string | undefined;
        ruc?: string | undefined;
    }, any, undefined>;
    zones: Zone[];
    addressesFields: FieldArrayWithId<{
        discount: number;
        phone: string;
        name: string;
        addresses: {
            address: string;
            zoneId: string;
        }[];
        isArchived?: boolean | undefined;
        socialReason?: string | undefined;
        ruc?: string | undefined;
    }, "addresses", "id">[];
    appendAddress: UseFieldArrayAppend<{
        addresses: {
            address: string;
            zoneId: string;
        }[];
        discount: number;
        phone: string;
        name: string;
        isArchived?: boolean | undefined;
        socialReason?: string | undefined;
        ruc?: string | undefined;
    }, "addresses">;
    removeAddress: UseFieldArrayRemove;
    loading: boolean,
}

const ClientAddresses: React.FC<ClientAddressesProps> = ({
    form,
    zones,
    addressesFields,
    appendAddress,
    removeAddress,
    loading,
}) => {
    return (
        <div className="flex flex-col space-y-8 col-span-full xl:col-span-1">

            <div className={addressesFields.length > 0 ? "border rounded-md p-4" : ""}>

                {addressesFields.map((address, idx) => (
                    <>
                        <FormLabel>Dirección {idx + 1}</FormLabel>
                        <div key={address.id} className="flex flex-col mt-2 mb-8 gap-y-2 sm:flex-row sm:gap-y-0 sm:gap-x-2 sm:items-start">
                            {/* Address */}
                            <FormField
                                control={form.control}
                                name={`addresses.${idx}.address`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <div className="flex gap-x-2">
                                                <Input {...field} disabled={loading} placeholder="Calle y número" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="truncate" />
                                    </FormItem>
                                )}
                            />
                            {/* Zone */}
                            <FormField
                                control={form.control}
                                name={`addresses.${idx}.zoneId`}
                                render={({ field }) => (
                                    <FormItem className="space-x-2">
                                        <Popover>
                                            <PopoverTrigger asChild className="w-full">
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? zones.find(
                                                                (zone) => zone.id === field.value
                                                            )?.name
                                                            : "Selecciona una zona"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandGroup>
                                                        {zones.map((zone) => (
                                                            <CommandItem
                                                                value={zone.id}
                                                                key={zone.id}
                                                                onSelect={() => {
                                                                    form.setValue(`addresses.${idx}.zoneId`, zone.id)
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

                                        <FormMessage className="truncate" />
                                    </FormItem>
                                )}
                            />
                            {/* Remove address button */}
                            {idx > 0 &&
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        removeAddress(idx)
                                    }}
                                    className=""
                                    size="icon"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            }
                            <Separator className="sm:hidden" />
                        </div>
                    </>
                ))}

            </div>
            <div className="flex flex-col">
                {form.getValues('addresses').length < 1 &&
                    <FormMessage className="mb-2">Debes registrar al menos una dirección para el cliente</FormMessage>
                }
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => {
                        appendAddress({ address: "", zoneId: "" })
                    }}
                >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Agregar una nueva dirección
                </Button>
            </div>

        </div>
    );
}

export default ClientAddresses;