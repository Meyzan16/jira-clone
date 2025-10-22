"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

type ScrollAreaProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
>;

export function ScrollArea({
  className = "",
  children,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      {...props}
      className={`relative overflow-hidden ${className}`}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

type ScrollBarProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
>;

export function ScrollBar({
  className = "",
  orientation = "vertical",
  ...props
}: ScrollBarProps) {
  const axisClass =
    orientation === "horizontal"
      ? "h-2.5 flex-col border-t border-t-transparent p-[1px]"
      : "h-full w-2.5 border-l border-l-transparent p-[1px]";

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      {...props}
      orientation={orientation}
      className={`flex touch-none select-none transition-colors ${axisClass} ${className}`}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}
