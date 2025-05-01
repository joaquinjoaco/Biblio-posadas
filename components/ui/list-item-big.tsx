/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React from "react"

import Link from "next/link"

interface ListItemBigProps {
    title: string;
    href: string;
    children: React.ReactNode;
    icon: any;
    blank?: boolean;
}

export const ListItemBig: React.FC<ListItemBigProps> = ({
    title,
    href,
    children,
    icon,
    blank,
}) => {
    return (
        <Link
            href={href}
            target={`${blank ? "_blank" : "_self"}`}
            className={
                "flex h-full w-full select-none flex-col rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:bg-orange-200/50 dark:hover:bg-orange-400 transition-colors"
            }
        >
            {icon}
            <div className="flex flex-col mb-2 mt-4 text-lg font-medium">{title}</div>
            <p className="text-sm leadin-tight text-muted-foreground">
                {children}
            </p>
        </Link>
    )
};