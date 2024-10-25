"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUpRightSquare, BarChart, BarChartBig, BookLock, BookPlus, BookUser, BookX, Gift, LibraryBig, Map, Package, PackageCheck, PackagePlus, PackageSearch, PackageX, ScrollText, Settings2, ShoppingBasket, Store, Truck, User, UserPlus, Users } from "lucide-react";
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
    // const params = useParams();

    const panel = {
        href: `/`,
        label: 'Panel',
        active: pathname === `/`,
    };

    // Books
    const booksBig = [
        {
            href: `/libros/nuevo`,
            label: 'Nuevo libro',
            // active: pathname === `/${params.storeId}/ordenes/nuevo`,
            desc: 'Registra un nuevo libro en el sistema. Podrás encontrarlo en la vista general de los libros.',
            icon: <BookPlus className="h-6 w-6" />,
        },
        {
            href: `/libros`,
            label: 'Libros',
            // active: pathname === `/${params.storeId}/ordenes/asignar`,
            desc: 'Vista general de todos los libros. Desde aquí puedes prestar un libro a un usuario.',
            icon: <LibraryBig className="h-6 w-6" />,
        },
    ];

    const books = [
        {
            href: `/libros/lended=true`,
            label: 'Libros prestados',
            // active: pathname === `/${params.storeId}/ordenes?daily`,
            desc: 'Vista de los libros que se encuentran prestados.',
            icon: <BookLock className="h-4 w-4" />,
        },
        // {
        //     href: `/distributions`,
        //     label: 'Todas las distribuciones',
        //     // active: pathname === `/${params.storeId}/ordenes`,
        //     desc: 'Vista general de todos los pedidos, registra nuevos pedidos o accede a ellos.',
        //     icon: <PackageSearch className="h-4 w-4" />,
        // },
        // {
        //     href: `/distributions/delivered`,
        //     label: 'Distribuciones entregadas',
        //     // active: pathname === `/${params.storeId}/ordenes/nuevo`,
        //     desc: 'Vista de distribuciones entregadas por un repartidor.',
        //     icon: <PackageCheck className="h-4 w-4" />,
        // },
        // {
        //     href: `/distributions/cancelled`,
        //     label: 'Distribuciones canceladas',
        //     // active: pathname === `/${params.storeId}/ordenes/cancelados`,
        //     desc: 'Vista de distribuciones canceladas.',
        //     icon: <PackageX className="h-4 w-4" />,
        // },
    ];

    // members
    const membersBig = [
        {
            href: `/socios/nuevo`,
            label: 'Nuevo usuario',
            // active: pathname === `/users?type=beneficiary`,
            desc: 'Registra un nuevo socio en el sistema. Podrás encontrarlo en la vista general de los socios.',
            icon: <UserPlus className="h-6 w-6" />,
        },
        {
            href: `/socios`,
            label: 'Socios',
            // active: pathname === `/users?type=driver`,
            desc: 'Vista general de todos los socios.',
            icon: <Users className="h-6 w-6" />,
        },
    ];

    // const users = [
    //     {
    //         href: `/lendings`,
    //         label: 'Usuarios con préstamos',
    //         // active: pathname === `/users`,
    //         desc: 'Vista de los usuarios que tienen préstamos activos.',
    //         icon: <BookUser className="h-4 w-4" />,
    //     },
    // ];

    // Book lendings
    const lendingsBig = [
        {
            href: `/lendings`,
            label: 'Préstamos activos',
            // active: pathname === `/users`,
            desc: 'Vista de los préstamos activos.',
            icon: <BookUser className="h-4 w-4" />,
        },
        {
            href: `/lendings`,
            label: 'Préstamos vencidos',
            // active: pathname === `/users`,
            desc: 'Vista de los préstamos vencidos que aún no se han devuelto.',
            icon: <BookX className="h-4 w-4" />,
        },
    ];

    const lendings = [
        {
            href: `/lendings`,
            label: 'Todos los préstamos',
            // active: pathname === `/${params.storeId}/repartidores`,
            desc: 'Vista de todos los préstamos del sistema.',
            icon: <Gift className="h-4 w-4" />,
        }
    ];


    // // Reports
    // const reports = [
    //     {
    //         href: `/reports/zones`,
    //         label: 'Zonas con mayores distribuciones',
    //         // active: pathname === `/${params.storeId}/repartidores`,
    //         desc: 'Reporte de zonas con mayores distribuciones.',
    //         icon: <BarChartBig className="h-6 w-6" />,
    //     },
    // ];

    // Good ole' hydration trick.
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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

                    {/* Books */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Libros</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {booksBig.map((route) => (
                                    <ListItemBig
                                        key={route.label}
                                        title={route.label}
                                        href={route.href}
                                        icon={route.icon}
                                    >
                                        {route.desc}
                                    </ListItemBig>
                                ))}
                                {books.map((route) => (
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

                    {/* Members */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="font-medium">Usuarios</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {membersBig.map((route) => (
                                    <ListItemBig
                                        key={route.label}
                                        title={route.label}
                                        href={route.href}
                                        icon={route.icon}
                                    >
                                        {route.desc}
                                    </ListItemBig>
                                ))}

                                {/* {users.map((route) => (
                                    <ListItem
                                        key={route.label}
                                        title={route.label}
                                        href={route.href}
                                        icon={route.icon}
                                    >
                                        {route.desc}
                                    </ListItem>
                                ))} */}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Lendings */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Prestamos</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {lendingsBig.map((route) => (
                                    <ListItemBig
                                        key={route.label}
                                        title={route.label}
                                        href={route.href}
                                        icon={route.icon}
                                    >
                                        {route.desc}
                                    </ListItemBig>
                                ))}
                                {lendings.map((route) => (
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


                    {/* <NavigationMenuItem>
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
                    </NavigationMenuItem> */}

                </NavigationMenuList>
            </NavigationMenu>
        </nav>
    );
};