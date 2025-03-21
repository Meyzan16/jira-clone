"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";

// Buat interface untuk context value
interface DrawerContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

// Root Drawer
interface DrawerProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Drawer = ({ children, open, onOpenChange }: DrawerProps) => {
  return (
    <DrawerContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DrawerContext.Provider>
  );
};

// Trigger
export const DrawerTrigger = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error("DrawerTrigger must be used within Drawer");
  const { onOpenChange } = context;
  return <div onClick={() => onOpenChange(true)}>{children}</div>;
};

// Overlay
export const DrawerOverlay = ({ className = "" }: { className?: string }) => (
  <div className={`fixed inset-0 z-40 bg-black/80 ${className}`} />
);

// Content
interface DrawerContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerContent = ({ children, className = "" }: DrawerContentProps) => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error("DrawerContent must be used within Drawer");
  const { open, onOpenChange } = context;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onOpenChange]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <>
      <DrawerOverlay />
      <div
        ref={ref}
        className={`fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-white transition-all animate-in slide-in-from-bottom-10 ${className}`}
      >
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-gray-300" />
        {children}
      </div>
    </>
  );
};

// Close button
export const DrawerClose = ({ children }: { children?: React.ReactNode }) => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error("DrawerClose must be used within Drawer");
  const { onOpenChange } = context;
  return (
    <button
      onClick={() => onOpenChange(false)}
      className="absolute right-4 top-4 rounded opacity-70 hover:opacity-100"
    >
      {children ?? <span className="h-4 w-4"> X </span>}
    </button>
  );
};

// Header
interface DrawerSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerHeader = ({ children, className = "" }: DrawerSectionProps) => (
  <div className={`grid gap-1.5 p-4 text-center sm:text-left ${className}`}>
    {children}
  </div>
);

// Footer
export const DrawerFooter = ({ children, className = "" }: DrawerSectionProps) => (
  <div className={`mt-auto flex flex-col gap-2 p-4 ${className}`}>
    {children}
  </div>
);

// Title
export const DrawerTitle = ({ children, className = "" }: DrawerSectionProps) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h2>
);

// Description
export const DrawerDescription = ({ children, className = "" }: DrawerSectionProps) => (
  <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);
