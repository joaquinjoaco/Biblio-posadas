"use client"

import * as React from "react"
import { Moon, MoreHorizontal, Sun, SunMoon } from "lucide-react"
import { useTheme } from "next-themes"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./sidebar"

export function SidebarThemeToggle({
    ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    const { setTheme } = useTheme()
    const { isMobile } = useSidebar()

    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <DropdownMenu>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="select-none data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                    Cambiar tema <MoreHorizontal className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                                className="min-w-56 rounded-lg"
                            >
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    <Sun className="h-4 w-4 mr-2" /> Claro
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    <Moon className="h-4 w-4 mr-2" /> Oscuro
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    <SunMoon className="h-4 w-4 mr-2" /> Sistema
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </DropdownMenu>

            </SidebarGroupContent>
        </SidebarGroup>

    );
};
