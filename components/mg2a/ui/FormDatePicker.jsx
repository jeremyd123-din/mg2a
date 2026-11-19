"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

const calendarClasses = getDefaultClassNames();

function dateValue(date) {
  if (!date) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export default function FormDatePicker({ field, id }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(field.defaultValue || "")) return undefined;
    const initial = new Date(field.defaultValue + "T00:00:00");
    return dateValue(initial) === field.defaultValue ? initial : undefined;
  });
  const display = date?.toLocaleDateString("en-US", { dateStyle: "medium" });

  function select(next) {
    setDate(next);
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <input type="hidden" name={field.name} value={dateValue(date)} />
      <Popover.Trigger asChild>
        <button
          id={id}
          type="button"
          aria-label={`${field.label}: ${display || "Pick a Date"}`}
          className="flex min-h-12 w-full min-w-0 items-center justify-between gap-2 rounded border border-[var(--line)] bg-[var(--bg)] px-3.5 py-3 text-left text-sm font-normal text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy)]"
        >
          <span className="min-w-0">
            {display || field.placeholder || "Pick a Date"}
          </span>
          <svg
            aria-hidden="true"
            className="size-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          aria-label={`Choose ${field.label.toLowerCase()} date`}
          align="start"
          sideOffset={5}
          collisionPadding={8}
          className="z-[60] max-h-[var(--radix-popover-content-available-height)] max-w-[var(--radix-popover-content-available-width)] overflow-auto rounded-md border border-[var(--line)] bg-[var(--panel)] p-3 font-[family-name:var(--font-sans)] text-sm text-[var(--ink)] shadow-lg"
        >
          {/* Calendar + Popover composition from the shadcn/ui date picker. */}
          <DayPicker
            mode="single"
            selected={date}
            defaultMonth={date}
            onSelect={select}
            required={field.required}
            autoFocus
            showOutsideDays
            className="[--rdp-accent-color:var(--accent)] [--rdp-day-width:clamp(32px,10.5vw,36px)] [--rdp-day-height:var(--rdp-day-width)] [--rdp-day_button-width:var(--rdp-day-width)] [--rdp-day_button-height:var(--rdp-day-width)] [--rdp-day_button-border-radius:0.375rem] [--rdp-nav-height:var(--rdp-day-width)] [--rdp-nav_button-width:var(--rdp-day-width)] [--rdp-nav_button-height:var(--rdp-day-width)]"
            classNames={{
              month: calendarClasses.month + " flex flex-col gap-2",
              nav:
                calendarClasses.nav +
                " pointer-events-none inset-x-0 justify-between [&>button]:pointer-events-auto [&>button]:rounded-md [&>button:hover]:bg-[var(--bg2)] [&_svg]:size-4",
              month_caption:
                calendarClasses.month_caption +
                " items-center justify-center px-[var(--rdp-day-width)]",
              caption_label:
                calendarClasses.caption_label + " text-sm font-medium",
              day_button:
                calendarClasses.day_button +
                " hover:bg-[var(--bg2)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]",
              selected: calendarClasses.selected + " font-semibold",
            }}
          />
          {date && !field.required && (
            <button
              type="button"
              onClick={() => select(undefined)}
              className="mt-1 w-full rounded border-t border-[var(--line)] px-3 py-2 text-center text-[var(--accent)] hover:bg-[var(--bg2)]"
            >
              Clear Date
            </button>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
