"use client"

import React from "react"

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface TooltipWrapperProps {
    children: React.ReactNode;
    content: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
    children,
    content,
    icon,
    className,
}) => {
    return (
        <Tooltip>
            <TooltipTrigger>
                {children}
            </TooltipTrigger>
            <TooltipContent className={className}>
                {icon} {content}
            </TooltipContent>
        </Tooltip>
    )
};