"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, CaptionProps } from "react-day-picker";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onYearChange?: (year: number) => void;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onYearChange,
  ...props
}: CalendarProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  function CustomCaption({ displayMonth }: CaptionProps) {
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedYear = Number(e.target.value);
      const newDate = new Date(displayMonth);
      newDate.setFullYear(selectedYear);
      props?.onMonthChange?.(newDate);
      onYearChange?.(selectedYear);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedMonth = Number(e.target.value);
      const newDate = new Date(displayMonth);
      newDate.setMonth(selectedMonth);
      props?.onMonthChange?.(newDate);
    };

    return (
      <div className="flex justify-between items-center px-2 gap-2">
        <select
          value={displayMonth.getMonth()}
          onChange={handleMonthChange}
          className="text-sm border rounded px-2 py-1"
        >
          {months.map((month, idx) => (
            <option key={month} value={idx}>
              {month}
            </option>
          ))}
        </select>

        <select
          value={displayMonth.getFullYear()}
          onChange={handleYearChange}
          className="text-sm border rounded px-2 py-1"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    );
  }

  const baseClassNames = {
    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
    month: "space-y-4",
    caption: "flex justify-center pt-1 relative items-center",
    caption_label: "text-sm font-medium",
    nav: "space-x-1 flex items-center",
    nav_button:
      "inline-flex items-center justify-center rounded-md border border-input bg-background px-2 py-1 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
    nav_button_previous: "absolute left-1",
    nav_button_next: "absolute right-1",
    table: "w-full border-collapse space-y-1",
    head_row: "flex",
    head_cell:
      "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
    row: "flex w-full mt-2 gap-1",
    cell: [
      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
      "[&:has([aria-selected])]:bg-accent",
      "[&:has([aria-selected].day-outside)]:bg-accent/50",
      "[&:has([aria-selected].day-range-end)]:rounded-r-md",
      props.mode === "range"
        ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
        : "[&:has([aria-selected])]:rounded-md",
    ].join(" "),
    day: "text-center text-sm rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary h-9 w-9 p-0 font-normal aria-selected:opacity-100",
    day_range_start: "day-range-start",
    day_range_end: "day-range-end",
    day_selected:
      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
    day_today: "bg-accent text-accent-foreground",
    day_outside:
      "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
    day_disabled: "text-muted-foreground opacity-50",
    day_range_middle:
      "aria-selected:bg-accent aria-selected:text-accent-foreground",
    day_hidden: "invisible",
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={`p-3 ${className ?? ""}`}
      classNames={{ ...baseClassNames, ...classNames }}
      components={{
        Caption: CustomCaption,
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={`h-4 w-4 ${className ?? ""}`} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={`h-4 w-4 ${className ?? ""}`} {...props} />
        ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
