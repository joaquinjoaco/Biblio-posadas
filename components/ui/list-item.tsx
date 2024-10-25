"use client"

import React from "react"

import { NavigationMenuLink } from "./navigation-menu"
import Link from "next/link"

interface ListItemProps {
    title: string;
    href: string;
    children: React.ReactNode;
    icon: any;
}

export const ListItem: React.FC<ListItemProps> = ({
    title,
    href,
    children,
    icon,
}) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className={
                        "block w-full h-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    }
                >
                    <div className="flex flex-row gap-x-2 items-center text-sm font-medium leading-none">{icon}{title}</div>
                    <p className="text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
};