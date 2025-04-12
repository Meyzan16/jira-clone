"use client";

import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  children: React.ReactNode;
  className?: string;
  modal?: boolean;
}

interface DropdownInjectedProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ClickableProps extends DropdownProps {
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
}

const DropdownMenu: React.FC<DropdownProps> = ({
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
          ? React.cloneElement(
              child as React.ReactElement<DropdownInjectedProps>,
              { isOpen, setIsOpen }
            )
          : child
      )}
    </div>
  );
};

const DropdownMenuTrigger: React.FC<
  ClickableProps & {
    isOpen?: boolean;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  }
> = ({ children, onClick, className = "", setIsOpen }) => {
  return (
    <button
      className={`outline-none relative ${className}`}
      onClick={(e) => {
        if (setIsOpen) setIsOpen((prev) => !prev);
        if (onClick) onClick(e);
      }}
    >
      {children}
    </button>
  );
};

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
      className={`absolute z-50 min-w-[15rem] overflow-hidden rounded-md border bg-white p-1 text-gray-800 shadow-md ${
        side === "bottom" ? `top-full mt-${sideOffset}` : ""
      } ${side === "top" ? `bottom-full mb-${sideOffset}` : ""} ${
        side === "left" ? `right-full mr-${sideOffset}` : ""
      } ${side === "right" ? `left-full ml-${sideOffset}` : ""} ${
        align === "start" ? "left-0" : ""
      } ${align === "center" ? "left-1/2 transform -translate-x-1/2" : ""} ${
        align === "end" ? "right-0" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem: React.FC<
  ClickableProps & { setIsOpen?: React.Dispatch<React.SetStateAction<boolean>> }
> = ({ children, onClick, className = "", setIsOpen }) => {
  return (
    <div
      className={`relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-4 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 ${className}`}
      onClick={(e) => {
        if (setIsOpen) setIsOpen(false);
        if (onClick) onClick(e);
      }}
    >
      {children}
    </div>
  );
};

interface CheckboxProps extends DropdownProps {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
const DropdownMenuCheckboxItem: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  children,
  className = "",
}) => {
  return (
    <label
      className={`relative flex items-center pl-8 pr-2 py-1.5 text-sm cursor-pointer rounded hover:bg-gray-100 ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="absolute left-2 h-4 w-4"
      />
      {children}
    </label>
  );
};

interface RadioProps extends DropdownProps {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
const DropdownMenuRadioItem: React.FC<RadioProps> = ({
  checked,
  onChange,
  children,
  className = "",
}) => {
  return (
    <label
      className={`relative flex items-center pl-8 pr-2 py-1.5 text-sm cursor-pointer rounded hover:bg-gray-100 ${className}`}
    >
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="absolute left-2 h-4 w-4"
      />
      {children}
    </label>
  );
};

const DropdownMenuLabel: React.FC<DropdownProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`px-2 py-1.5 text-sm font-semibold ${className}`}>
      {children}
    </div>
  );
};

const DropdownMenuSeparator: React.FC<DropdownProps> = ({ className = "" }) => {
  return <div className={`my-1 h-px bg-gray-300 ${className}`} />;
};

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
