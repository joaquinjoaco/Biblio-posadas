"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper"
import { ListItemBig } from "@/components/ui/list-item-big"

export function NavMain({
    items,
    title,
}: {
    title: string,
    items: {
        title: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
            icon?: LucideIcon
            description?: string
        }[]
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                    >

                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <TooltipWrapper
                                            key={subItem.title}
                                            content={
                                                <ListItemBig
                                                    key={subItem.title}
                                                    title={subItem.title}
                                                    href={subItem.url}
                                                    icon={subItem.icon ? <subItem.icon /> : <></>}
                                                >
                                                    {subItem.description}
                                                </ListItemBig>
                                            }
                                            side="right"
                                        >
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <a href={subItem.url}>
                                                        <span>{subItem.title}</span>
                                                    </a>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </TooltipWrapper>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>

                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
