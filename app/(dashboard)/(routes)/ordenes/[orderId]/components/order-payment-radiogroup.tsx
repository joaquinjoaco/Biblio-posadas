"use client"

import { CreditCard, Landmark, Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


interface PaymentRadiogroupProps {
    payment: "" | "pos" | "efectivo" | "transferencia" | string;
    setPayment: React.Dispatch<React.SetStateAction<"" | "pos" | "efectivo" | "transferencia">>;
    form: any;
    disabled: boolean;
    className: string;
}

const PaymentRadiogroup: React.FC<PaymentRadiogroupProps> = ({
    payment,
    setPayment,
    form,
    disabled,
    className,
}) => {

    const handlePaymentChange = (payment: "pos" | "efectivo" | "transferencia" | "") => {
        form.setValue('payment', payment);
        setPayment(payment);
    }

    return (
        <Card className={`shadow-none ${className}`}>
            <CardHeader>
                <CardTitle className="text-md">Método de pago</CardTitle>
                <CardDescription>
                    Selecciona el método de pago que usará el cliente.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <RadioGroup
                    onValueChange={(value) => { handlePaymentChange(value as "" | "pos" | "efectivo" | "transferencia") }}
                    defaultValue={payment}
                    className="grid grid-cols-3 gap-4"
                    disabled={disabled}
                >
                    <div>
                        <RadioGroupItem value="pos" id="pos" className="peer sr-only" />
                        <Label
                            htmlFor="pos"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            <CreditCard className="h-6 w-6 mb-2" />
                            POS
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="efectivo" id="efectivo" className="peer sr-only" />
                        <Label
                            htmlFor="efectivo"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            <Wallet className="h-6 w-6 mb-2" />
                            Efectivo
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="transferencia" id="transferencia" className="peer sr-only" />
                        <Label
                            htmlFor="transferencia"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            <Landmark className="h-6 w-6 mb-2" />
                            Transferencia
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    );
}

export default PaymentRadiogroup;

