"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("font-sans", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-8",
        month: "space-y-4",
        caption: "flex justify-center relative items-center mb-4",
        caption_label: "text-[10px] uppercase tracking-[0.25em] text-obsidian-800",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 flex items-center justify-center text-obsidian-500 hover:text-obsidian-900 transition-colors duration-300"
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse",
        head_row: "flex mb-2",
        head_cell: "text-obsidian-400 w-10 text-[9px] uppercase tracking-[0.15em] font-normal",
        row: "flex w-full mt-1",
        cell: cn(
          "relative p-0 text-center focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "[&:has([aria-selected].day-range-end)]:rounded-r-none [&:has([aria-selected].day-range-start)]:rounded-l-none [&:has([aria-selected])]:bg-parchment-100"
            : "[&:has([aria-selected])]:bg-parchment-100"
        ),
        day: cn(
          "h-10 w-10 p-0 font-normal text-sm text-obsidian-800 hover:bg-parchment-200 transition-colors duration-200 aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start !bg-obsidian-900 !text-parchment-50",
        day_range_end: "day-range-end !bg-obsidian-900 !text-parchment-50",
        day_selected: "!bg-obsidian-900 !text-parchment-50",
        day_today: "font-semibold text-obsidian-900 underline underline-offset-2",
        day_outside: "text-obsidian-300 opacity-40",
        day_disabled: "text-obsidian-200 opacity-30 line-through cursor-not-allowed",
        day_range_middle: "!bg-parchment-100 !text-obsidian-800",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" strokeWidth={1} />,
        IconRight: () => <ChevronRight className="h-4 w-4" strokeWidth={1} />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";
export { Calendar };
