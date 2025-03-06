"use client";

import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  children: React.ReactNode;
  className?: string;
  modal?: boolean;
}

// Interface untuk komponen yang bisa diklik
interface ClickableProps extends DropdownProps {
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
}

// Komponen utama Dropdown
const DropdownMenu: React.FC<DropdownProps> = ({ children, className = "", modal = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Menutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { isOpen, setIsOpen })
          : child
      )}
    </div>
  );
};

// ✅ Tombol pemicu Dropdown (toggle on click)
const DropdownMenuTrigger: React.FC<ClickableProps & { isOpen?: boolean; setIsOpen?: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  children,
  onClick,
  className = "",
  isOpen,
  setIsOpen,
}) => {
  return (
    <button
      className={`outline-none relative ${className}`}
      onClick={(e) => {
        setIsOpen && setIsOpen((prev) => !prev); // Toggle state
        onClick && onClick(e);
      }}
    >
      {children}
    </button>
  );
};

// Konten utama Dropdown
interface DropdownMenuContentProps extends DropdownProps {
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  isOpen?: boolean;
}
const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  className = "",
  align = "start",
  side = "bottom",
  sideOffset = 4,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`
        z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2,
      ${side === "bottom" ? `top-full mt-${sideOffset}` : ""}
      ${side === "top" ? `bottom-full mb-${sideOffset}` : ""}
      ${side === "left" ? `right-full mr-${sideOffset}` : ""}
      ${side === "right" ? `left-full ml-${sideOffset}` : ""}
      ${align === "start" ? "left-0" : ""}
      ${align === "center" ? "left-1/2 transform -translate-x-1/2" : ""}
      ${align === "end" ? "right-0" : ""}
      ${className}`}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem: React.FC<ClickableProps & { setIsOpen?: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  children,
  onClick,
  className = "",
  setIsOpen,
}) => {
  return (
    <div
      className={` relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0, ${className}`}
      onClick={(e) => {
        setIsOpen && setIsOpen(false); // Tutup dropdown setelah diklik
        onClick && onClick(e);
      }}
    >
      {children}
    </div>
  );
};

// Checkbox Item
interface CheckboxProps extends DropdownProps {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
const DropdownMenuCheckboxItem: React.FC<CheckboxProps> = ({ checked, onChange, children, className = "" }) => {
  return (
    <label className={`relative flex items-center pl-8 pr-2 py-1.5 text-sm cursor-pointer rounded hover:bg-gray-100 ${className}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="absolute left-2 h-4 w-4" />
      {children}
    </label>
  );
};

// Radio Item
interface RadioProps extends DropdownProps {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
const DropdownMenuRadioItem: React.FC<RadioProps> = ({ checked, onChange, children, className = "" }) => {
  return (
    <label className={`relative flex items-center pl-8 pr-2 py-1.5 text-sm cursor-pointer rounded hover:bg-gray-100 ${className}`}>
      <input type="radio" checked={checked} onChange={onChange} className="absolute left-2 h-4 w-4" />
      {children}
    </label>
  );
};

// Label dalam dropdown
const DropdownMenuLabel: React.FC<DropdownProps> = ({ children, className = "" }) => {
  return <div className={`px-2 py-1.5 text-sm font-semibold ${className}`}>{children}</div>;
};

// Separator antar item
const DropdownMenuSeparator: React.FC<DropdownProps> = ({ className = "" }) => {
  return <div className={`my-1 h-px bg-gray-300 ${className}`} />;
};

// Ekspor semua komponen
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
