"use client";
import React, { useState, useContext, useRef, useEffect, createContext } from "react";
import { X } from "lucide-react";

const DialogContext = createContext<any>(null);

export const Dialog = ({ children, open, onOpenChange }: any) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger = ({ children }: { children: React.ReactNode }) => {
  const { onOpenChange } = useContext(DialogContext);
  return (
    <button onClick={() => onOpenChange(true)}>
      {children}
    </button>
  );
};

export const DialogOverlay = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/80 transition-opacity ${className}`}
    />
  );
};

export const DialogContent = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const { open, onOpenChange } = useContext(DialogContext);
  const contentRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onOpenChange]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <>
      <DialogOverlay />
      <div
        ref={contentRef}
        className={`fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg transition-all sm:rounded-lg ${className}`}
      >
        {children}
        <DialogClose />
      </div>
    </>
  );
};

export const DialogClose = () => {
  const { onOpenChange } = useContext(DialogContext);
  return (
    <button
      onClick={() => onOpenChange(false)}
      className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  );
};

export const DialogHeader = ({ className = "", ...props }: any) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />
);

export const DialogFooter = ({ className = "", ...props }: any) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props} />
);

export const DialogTitle = ({ className = "", ...props }: any) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
);

export const DialogDescription = ({ className = "", ...props }: any) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props} />
);
