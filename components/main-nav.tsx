"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUpRightSquare, BarChart, BarChartBig, Gift, Map, Package, PackageCheck, PackagePlus, PackageSearch, PackageX, ScrollText, Settings2, ShoppingBasket, Store, Truck, User, Users } from "lucide-react";
import { useEffect, useState } from "react";

// local imports.
import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import { ListItem } from "./ui/list-item";
import { ListItemBig } from "./ui/list-item-big";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {

    const pathname = usePathname();
    const params = useParams();

    const panel = {
        href: `/`,
        label: 'Panel',
        active: pathname === `/`,
    };

    const usersBig = [
        {
            href: `/users?type=beneficiary`,
            label: 'Beneficiarios',
            // active: pathname === `/users?type=beneficiary`,
            desc: 'Crea, edita y accede a los historiales de los beneficiarios registrados en Ayudemos.uy.',
            icon: <User className="h-6 w-6" />,
        },
        {
            href: `/users?type=driver`,
            label: 'Repartidores',
            // active: pathname === `/users?type=driver`,
            desc: 'Crea, edita y accede a los historiales de los repartidores registrados en Ayudemos.uy.',
            icon: <Truck className="h-6 w-6" />,
        },
    ];

    const users = [
        {
            href: `/users`,
            label: 'Todos los usuarios',
            // active: pathname === `/users`,
            desc: 'Crea, edita y accede a los historiales de todos los usuarios registrados en Ayudemos.uy.',
            icon: <Users className="h-4 w-4" />,
        },
    ];

    const donations = [
        {
            href: `/donations`,
            label: 'Donaciones',
            // active: pathname === `/${params.storeId}/repartidores`,
            desc: 'Registra y edita donaciones del sistema.',
            icon: <Gift className="h-4 w-4" />,
        }
    ];

    const reports = [
        {
            href: `/reports/zones`,
            label: 'Zonas con mayores distribuciones',
            // active: pathname === `/${params.storeId}/repartidores`,
            desc: 'Reporte de zonas con mayores distribuciones.',
            icon: <BarChartBig className="h-4 w-4" />,
        },

    ];

    const distributionsBig = [
        {
            href: `/distributions/new`,
            label: 'Nueva distribución',
            // active: pathname === `/${params.storeId}/ordenes/nuevo`,
            desc: 'Registra una neuva distribución. Podrás encontrarla en la vista general de distribuciones.',
            icon: <PackagePlus className="h-6 w-6" />,
        },
        {
            href: `/distributions/assign`,
            label: 'Distribuciones',
            // active: pathname === `/${params.storeId}/ordenes/asignar`,
            desc: 'Vista de distribuciones. Asigna distribuciones a repartidores.',
            icon: <ArrowUpRightSquare className="h-6 w-6" />,
        },
    ];

    const distributions = [
        {
            href: `/distributions?daily=true`,
            label: 'Distribuciones del día',
            // active: pathname === `/${params.storeId}/ordenes?daily`,
            desc: 'Vista general los pedidos del día, registra nuevos pedidos o accede a ellos.',
            icon: <Package className="h-4 w-4" />,
        },
        {
            href: `/distributions`,
            label: 'Todas las distribuciones',
            // active: pathname === `/${params.storeId}/ordenes`,
            desc: 'Vista general de todos los pedidos, registra nuevos pedidos o accede a ellos.',
            icon: <PackageSearch className="h-4 w-4" />,
        },
        {
            href: `/distributions/delivered`,
            label: 'Distribuciones entregadas',
            // active: pathname === `/${params.storeId}/ordenes/nuevo`,
            desc: 'Vista de distribuciones entregadas por un repartidor.',
            icon: <PackageCheck className="h-4 w-4" />,
        },
        {
            href: `/distributions/cancelled`,
            label: 'Distribuciones canceladas',
            // active: pathname === `/${params.storeId}/ordenes/cancelados`,
            desc: 'Vista de distribuciones canceladas.',
            icon: <PackageX className="h-4 w-4" />,
        },
    ];

    // Good ole' hydration trick.
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6 z-50", className)}
        >
            <NavigationMenu>
                <NavigationMenuList>

                    {/* Panel */}
                    <NavigationMenuItem>
                        <Link href={panel.href} legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                {panel.label}
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                    {/* Usuarios */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="font-medium">Usuarios</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {usersBig.map((route) => (
                                    <ListItemBig
                                        key={route.label}
                                        title={route.label}
                                        href={route.href}
                                        icon={route.icon}
                                    >
                                        {route.desc}
                                    </ListItemBig>
                                ))}

                                {users.map((route) => (
                                    <ListItem
                                        key={route.label}
                                        title={route.label}
                                        href={route.href}
                                        icon={route.icon}
                                    >
                                        {route.desc}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Distribuciones */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Distribuciones</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {distributionsBig.map((route) => (
                                    <ListItemBig
                                        key={route.label}
                                        title={route.label}
                                        href={route.href}
                                        icon={route.icon}
                                    >
                                        {route.desc}
                                    </ListItemBig>
                                ))}
                                {distributions.map((route) => (
                                    <ListItem
                                        key={route.label}
                                        title={route.label}
                                        href={route.href}
                                        icon={route.icon}
                                    >
                                        {route.desc}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Donaciones */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Donaciones</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {donations.map((route) => (
                                    <ListItem
                                        key={route.label}
                                        title={route.label}
                                        href={route.href}
                                        icon={route.icon}
                                    >
                                        {route.desc}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Reportes */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Reportes</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {reports.map((route) => (
                                    <ListItem
                                        key={route.label}
                                        title={route.label}
                                        href={route.href}
                                        icon={route.icon}
                                    >
                                        {route.desc}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                </NavigationMenuList>
            </NavigationMenu>
        </nav>
    );
};