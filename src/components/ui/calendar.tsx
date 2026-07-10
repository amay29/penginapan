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
        // react-day-picker v10 classNames
        months: "flex flex-col sm:flex-row gap-8",
        month: "space-y-4",
        month_caption: "flex justify-center relative items-center mb-4",
        caption_label: "text-[10px] uppercase tracking-[0.25em] text-obsidian-800",
        nav: "flex items-center justify-between absolute inset-x-0 top-0",
        button_previous: "h-7 w-7 bg-transparent p-0 flex items-center justify-center text-obsidian-500 hover:text-obsidian-900 transition-colors duration-300",
        button_next: "h-7 w-7 bg-transparent p-0 flex items-center justify-center text-obsidian-500 hover:text-obsidian-900 transition-colors duration-300",
        month_grid: "w-full border-collapse",
        weekdays: "flex mb-2",
        weekday: "text-obsidian-400 w-10 text-[9px] uppercase tracking-[0.15em] font-normal",
        week: "flex w-full mt-1",
        day: "relative p-0 text-center",
        day_button: cn(
          "h-10 w-10 p-0 font-normal text-sm text-obsidian-800 hover:bg-parchment-200 transition-colors duration-200"
        ),
        selected: "!bg-obsidian-900 !text-parchment-50",
        today: "font-semibold underline underline-offset-2",
        outside: "text-obsidian-300 opacity-40",
        disabled: "text-obsidian-200 opacity-30 line-through cursor-not-allowed",
        range_middle: "!bg-parchment-100 !text-obsidian-800",
        range_start: "!bg-obsidian-900 !text-parchment-50",
        range_end: "!bg-obsidian-900 !text-parchment-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left"
            ? <ChevronLeft className="h-4 w-4" strokeWidth={1} />
            : <ChevronRight className="h-4 w-4" strokeWidth={1} />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";
export { Calendar };
