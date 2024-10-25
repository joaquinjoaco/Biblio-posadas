"use client";

import { ChevronsUpDown, Package, PlusCircle } from "lucide-react";
import { Product } from "@prisma/client";
import { useState } from "react";

// local imports.
import { Button } from "@/components/ui/button";
import { cn, formatter } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandItem,
    CommandGroup,
} from "@/components/ui/command";
import { Decimal } from "@prisma/client/runtime/library";


type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ProductPickerProps extends PopoverTriggerProps {
    items: Product[];
    boughtProducts: { product: Product, calculatedPrice: Decimal | any, quantity: Decimal | any }[];
    setBoughtProducts: React.Dispatch<React.SetStateAction<{ product: Product, calculatedPrice: Decimal | any, quantity: Decimal | any }[]>>;
    discount: number;
    disabled?: boolean;
};

const ProductPicker: React.FC<ProductPickerProps> = ({
    items = [],
    disabled,
    boughtProducts,
    setBoughtProducts,
    discount,
}: ProductPickerProps) => {

    const [open, setOpen] = useState(false);

    const onProductSelect = (product: Product) => {
        // If the product has not been added it will be added to the array.
        if (!boughtProducts.some((boughtProduct) => boughtProduct.product.id === product.id)) {
            setBoughtProducts([...boughtProducts, {
                product: product,
                calculatedPrice: Number(product.price) - (Number(product.price) * (discount / 100)),
                quantity: 1, // initial quantity
            }]);
        }
        setOpen(false);
    }

    return (
        <>
            <Popover open={open} onOpenChange={setOpen} >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Selecciona un producto"
                        type="button"
                        className={cn("w-full justify-between")}
                        disabled={disabled}
                    >
                        <div className="flex items-center gap-x-2">
                            <Package className="flex-none mr-2 h-4 w-4" />
                            <p className="truncate">
                                Selecciona un producto
                            </p>
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] p-0">
                    <Command>
                        <CommandList>
                            <CommandInput placeholder="Busca un producto..." />
                            <CommandEmpty>
                                No se encontró el producto.
                            </CommandEmpty>
                            <CommandGroup heading="Productos">
                                {items.map((product) => (
                                    <CommandItem
                                        key={product.id}
                                        onSelect={() => onProductSelect(product)}
                                        className="cursor-pointer"
                                    >
                                        <PlusCircle className="flex-none h-4 w-4 mr-2" />
                                        <p className="truncate">
                                            {product.name}
                                            <span className="truncate text-xs text-muted-foreground"> ({product.id})</span>
                                        </p>
                                        <p className="ml-auto">{formatter.format(Number(product.price))}</p>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default ProductPicker;