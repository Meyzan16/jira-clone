"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";

// Context buat handle shared state antar komponen
const SelectContext = React.createContext<any>(null);

// Root
export const SelectWorkspace = ({
  children,
  value,
  defaultValue,
  onValueChange,
  items = [],
}: any) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value ?? defaultValue ?? null); // selected = { value, label }

  // Update selected value if value prop changes
  useEffect(() => {
    if (value && items.length) {
      const match = items.find((item: any) => item.$id === value);
      if (match) {
        setSelected({
          value: match.$id,
          label: (
            <div className="flex justify-start items-center gap-3 font-medium">
              <WorkspaceAvatar name={match.name} image={match.imageUrl} />
              <span className="truncate">{match.name}</span>
            </div>
          ),
        });
      }
    }
  }, [value, items]);


  const handleChange = (val: { value: string; label: React.ReactNode }) => {
    setSelected(val);
    setOpen(false);
    onValueChange?.(val.value);
  };

  return (
    <SelectContext.Provider
      value={{ open, setOpen, selected, onChange: handleChange }}
    >
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
};

// Trigger
export const SelectTrigger = ({ className = "", children }: any) => {
  const { open, setOpen } = useContext(SelectContext);
  return (
    <button
      onClick={() => setOpen((prev: boolean) => !prev)}
      className={`flex h-12 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-transparent placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-transparent disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${className}`}
    >
      {children}
      {open ? (
        <ChevronUp className="h-4 w-4 text-gray-500" />
      ) : (
        <ChevronDown className="h-4 w-4 text-gray-500" />
      )}
    </button>
  );
};

// Value
export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const { selected } = useContext(SelectContext);
  return (
    <span className="line-clamp-1 text-left text-sm text-black">
      {selected?.label || placeholder}
    </span>
  );
};

// Content (Dropdown)
export const SelectContent = ({ children }: any) => {
  const { open, setOpen } = useContext(SelectContext);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpen]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg"
    >
      <div className="max-h-60 overflow-auto py-1">{children}</div>
    </div>
  );
};

// Item
export const SelectItem = ({
  value,
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const { selected, onChange } = useContext(SelectContext);
  const isSelected = selected?.value === value;

  return (
    <div
      onClick={() => onChange({ value, label: children })}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm hover:bg-blue-100 ${
        isSelected ? "bg-blue-100 text-blue-700 font-semibold" : ""
      } ${className}`}
    >
      <span className="flex-1">{children}</span>
      {isSelected && (
        <span className="absolute right-3">
          <Check className="h-4 w-4 text-blue-600" />
        </span>
      )}
    </div>
  );
};
