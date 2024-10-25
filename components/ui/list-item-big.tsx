"use client"

import React from "react"

import { NavigationMenuLink } from "./navigation-menu"
import Link from "next/link"

interface ListItemBigProps {
    title: string;
    href: string;
    children: React.ReactNode;
    icon: any;
}

export const ListItemBig: React.FC<ListItemBigProps> = ({
    title,
    href,
    children,
    icon,
}) => {
    return (
        <li className="">
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className={
                        "flex h-full w-full select-none flex-col rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:bg-orange-200/50 transition-colors"
                    }
                >
                    {icon}
                    <div className="flex flex-col mb-2 mt-4 text-lg font-medium">{title}</div>
                    <p className="text-sm leadin-tight text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
};