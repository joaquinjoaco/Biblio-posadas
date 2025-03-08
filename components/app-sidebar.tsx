"use client"

import * as React from "react"
import {
    BookPlus,
    BookUp2,
    Handshake,
    LibraryBig,
    NotebookText,
    Timer,
    UserPlus,
    Users,
} from "lucide-react"
import Image from "next/image"

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main"
import { SidebarThemeToggle } from "@/components/ui/sidebar-theme-toggle"
import Link from "next/link"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    fantasyName: string
    companyName: string
}

export function AppSidebar({ fantasyName, companyName, ...props }: AppSidebarProps) {
    const data = {
        libros: [
            {
                title: "Libros",
                icon: LibraryBig,
                items: [
                    {
                        title: "Nuevo libro",
                        url: "/libros/nuevo",
                        icon: BookPlus,
                        description: "Registra un nuevo libro en la biblioteca. Podrás encontrarlo en la vista general de los libros.",
                    },
                    {
                        title: "Libros",
                        url: "/libros",
                        icon: LibraryBig,
                        description: "Vista general de todos los libros. Desde aquí puedes prestar un libro a un usuario.",
                    },
                    // {
                    //     title: "Libros prestados",
                    //     url: "/libros?lended=true",
                    //     icon: BookLock,
                    //     description: "Vista de los libros que se encuentran prestados.",
                    // },
                ],
            },
        ],
        socios: [
            {
                title: "Socios",
                icon: Users,
                items: [
                    {
                        title: "Nuevo socio",
                        url: "/socios/nuevo",
                        icon: UserPlus,
                        description: "Registra un nuevo socio en la biblioteca. Podrás encontrarlo en la vista general de los socios.",
                    },
                    {
                        title: "Socios",
                        url: "/socios",
                        icon: Users,
                        description: "Vista general de todos los socios.",
                    },
                ],
            },
        ],
        prestamos: [
            {
                title: "Préstamos",
                icon: NotebookText,
                items: [
                    {
                        title: "Préstamos activos",
                        url: "/prestamos?status=activos",
                        icon: BookUp2,
                        description: "Vista de los préstamos activos.",
                    },
                    {
                        title: "Préstamos vencidos",
                        url: "/prestamos?status=vencidos",
                        icon: Timer,
                        description: "Vista de los préstamos vencidos que aún no se han devuelto.",
                    },
                    {
                        title: "Todos los préstamos",
                        url: "/prestamos",
                        icon: NotebookText,
                        description: "Vista de todos los préstamos de la biblioteca.",
                    },
                    {
                        title: "Préstamos devueltos",
                        url: "/prestamos?status=devueltos",
                        icon: Handshake,
                        description: "Vista de los préstamos que ya fueron devueltos de la biblioteca.",
                    },
                ],
            },
        ],
    };

    return (
        <>
            <Sidebar variant="sidebar" className="z-20" {...props}>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <TooltipWrapper content={"Clic para ir al Panel"}>
                                <SidebarMenuButton size="lg" asChild>
                                    <Link href="/">
                                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                            <Image
                                                className="rounded-lg"
                                                src={"/posadas.jpeg"}
                                                alt="Biblioteca social del parque posadas"
                                                width={100}
                                                height={100}
                                            />
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{fantasyName}</span>
                                            <span className="truncate text-xs">{companyName}</span>
                                        </div>
                                    </Link>
                                </SidebarMenuButton>
                            </TooltipWrapper>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <NavMain title="Libros" items={data.libros} />
                    <NavMain title="Socios" items={data.socios} />
                    <NavMain title="Préstamos" items={data.prestamos} />
                    {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
                    <SidebarThemeToggle className="mt-auto" />
                </SidebarContent>
                <SidebarRail />
            </Sidebar>
        </>
    )
}
