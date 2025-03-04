"use client"

import React from "react"

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface TooltipWrapperProps {
    children: React.ReactNode;
    content: React.ReactNode;
    icon?: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom" | undefined;
    className?: string;
}

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
    children,
    content,
    icon,
    side,
    className,
}) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} className={className}>
                {icon} {content}
            </TooltipContent>
        </Tooltip>
    )
};