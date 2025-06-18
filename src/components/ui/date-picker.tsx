"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";

interface DatePickerProps {
  onInput?: boolean;
  value: Date | undefined;
  onChange: (date: Date) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
}

export const DatePicker = ({
  onInput = false,
  value,
  onChange,
  onBlur,
  className,
  placeholder = "Select Date",
}: DatePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(value ?? new Date());
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        onBlur?.();
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onBlur]);

  return (
    <div ref={wrapperRef} className={`relative w-full ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center gap-2 border  text-left text-sm font-normal shadow-sm bg-white 
          ${!value ? "text-muted-foreground" : ""}
          ${onInput ? "rounded-full  p-3" : "rounded-lg  py-[5px] px-3"}

        `}
      >
        <CalendarIcon className="h-4 w-4" />
        {value ? format(value, "PPP") : <span>{placeholder}</span>}
      </button>

      {open && (
        <div className="absolute z-[9999] mt-2 w-auto rounded-md border bg-white p-0 shadow-md">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              if (date) {
                onChange(date);
                setOpen(false);
              }
            }}
            month={month}
            onMonthChange={setMonth}
            onYearChange={(year) => {
              setMonth((prev) => {
                const newDate = new Date(prev);
                newDate.setFullYear(year);
                return newDate;
              });
            }}
            initialFocus
          />
        </div>
      )}
    </div>
  );
};
