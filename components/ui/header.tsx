"use client"

import { SidebarTrigger } from "./sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "./breadcrumb";
import { Separator } from "./separator";
import { TooltipWrapper } from "./tooltip-wrapper";
import { useEffect, useState } from "react";

export const Header = ({
    breadcrumbs,
    withSideBarTrigger,
}: {
    breadcrumbs: { name: string, url: string }[],
    withSideBarTrigger: boolean
}) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])


    if (!isMounted) {
        return null;
    }
    return (
        <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
                {withSideBarTrigger &&
                    <TooltipWrapper content="Barra lateral">
                        <SidebarTrigger className="-ml-1" />
                    </TooltipWrapper>
                }
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((breadcrumb, index) => (
                            <div key={index} className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5" >
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href={breadcrumb.url}>
                                        {breadcrumb.name}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {/* Show the separator only if it's not the last item */}
                                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
                            </div>
                        ))}

                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
}
