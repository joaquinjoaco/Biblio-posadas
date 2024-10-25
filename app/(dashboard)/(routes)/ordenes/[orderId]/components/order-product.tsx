"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { formatter } from "@/lib/utils";
import { Product } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2, } from "lucide-react";
import { Decimal } from "@prisma/client/runtime/library";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";

interface OrderProductProps {
    data: ({
        product: Product, calculatedPrice: number, quantity: number
    });
    discount: Decimal;
    disabled: boolean;
    boughtProducts: { product: Product, calculatedPrice: Decimal | any, quantity: Decimal | any }[];
    setBoughtProducts: React.Dispatch<React.SetStateAction<{ product: Product, calculatedPrice: Decimal | any, quantity: Decimal | any }[]>>;
};

const OrderProduct: React.FC<OrderProductProps> = ({
    data,
    disabled,
    discount,
    boughtProducts,
    setBoughtProducts,
}) => {

    const params = useParams();
    const [selectedQuantity, setSelectedQuantity] = useState<string>(data.quantity.toString());

    const onQuantityChange = (value: string) => {
        // UX Improvement:
        // We handle the quantity as a string but then parse it into a float
        // Remove non-numeric characters from the input value.
        const sanitizedValue = value.replace(/[^\d.]/g, '');
        // Not going to let the user type a number > 25000 as selected quantity.
        if (Number(sanitizedValue) > 25000) {
            setSelectedQuantity("25000");
        } else {
            setSelectedQuantity(sanitizedValue)
        }
    }

    const handleProductQuantityChange = (newData: { product: Product, calculatedPrice: number, quantity: string }) => {
        // if the item.id is the same as the id that it received it will map the newData item to
        // the array instead of the current item in that index.
        const updatedData = boughtProducts.map((item) =>
            item.product.id === newData.product.id ? { ...newData, calculatedPrice: newData.calculatedPrice, quantity: parseFloat(newData.quantity) } : item
        );
        setBoughtProducts(updatedData);
    }

    // Remove a product (POTENTIAL BUG HERE)
    const onProductRemove = (productId: string) => {
        const updatedData = boughtProducts.filter((product) => product.product.id !== productId);
        setBoughtProducts(updatedData); // useEffect on orderForm will take care of updating the form's boughtProducts.
    }

    useEffect(() => {
        handleProductQuantityChange({ product: data.product, calculatedPrice: data.calculatedPrice, quantity: selectedQuantity });
    }, [selectedQuantity]);

    return (
        <li className="flex justify-between">
            {/* Product */}
            <div className="flex flex-row gap-x-2 items-center justify-between text-sm font-semibold">
                <Button
                    variant="ghost"
                    type="button"
                    disabled={disabled}
                    onClick={() => onProductRemove(data.product.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
                <Input
                    // type="number"
                    max="25000"
                    className="w-20"
                    disabled={disabled}
                    value={selectedQuantity}
                    onChange={(e) => onQuantityChange(e.currentTarget.value)}
                />
                <TooltipWrapper
                    className="font-normal flex flex-row items-center"
                    content={data.product.description || "Sin descripción"}
                    icon={<ExternalLink className="h-4 w-4 mr-2" />}
                >
                    <Link
                        className="cursor-pointer"
                        href={`/${params.storeId}/productos/${data.product.id}`}
                        target="_blank"
                    >
                        {data.product.name}
                    </Link>
                </TooltipWrapper>
            </div>

            {/* Price */}
            <div className="flex mt-1 text-sm">
                {Number(discount) > 0 &&
                    <p className="line-through mr-2 text-muted-foreground">
                        {formatter.format(Number(data.product.price) * parseFloat(selectedQuantity))}
                    </p>
                }
                <p className="font-semibold">
                    {formatter.format(Number(data.calculatedPrice) * parseFloat(selectedQuantity))}
                </p>
            </div>
        </li>
    );
}

export default OrderProduct;