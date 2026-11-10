"use client";
import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";

export default function FormCombobox({ field, id }) {
  const initial =
    field.defaultValue &&
    field.options.some((option) => option.value === field.defaultValue)
      ? field.defaultValue
      : field.isMulti
        ? null
        : field.options[0]?.value;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(initial ? [initial] : []);
  const labels = field.options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);
  function choose(value) {
    setSelected((current) =>
      field.isMulti
        ? current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value]
        : [value],
    );
    if (!field.isMulti) setOpen(false);
  }
  return (
    <div className="min-w-0">
      {selected.length ? (
        selected.map((value) => (
          <input key={value} type="hidden" name={field.name} value={value} />
        ))
      ) : !field.isMulti ? (
        <input type="hidden" name={field.name} value="" />
      ) : null}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            id={id}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-required={field.required || undefined}
            aria-label={field.label}
            className="flex min-h-12 w-full items-center justify-between gap-3 rounded border border-[var(--line)] bg-[var(--bg)] px-3.5 py-3 text-left text-sm font-normal text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy)]"
          >
            <span className="min-w-0 break-words">
              {labels.join(", ") || field.placeholder || "Select an option"}
            </span>
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="m3 6 5 5 5-5" />
            </svg>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={5}
            collisionPadding={16}
            className="z-[60] w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)] font-[family-name:var(--font-sans)] text-sm text-[var(--ink)] shadow-lg"
          >
            <Command
              loop
              label={"Search " + field.label}
              defaultValue={selected[0]}
            >
              <div className="flex items-center gap-2 border-b border-[var(--line)] px-3">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-[var(--muted)]"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="8" cy="8" r="5" />
                  <path d="m12 12 5 5" />
                </svg>
                <Command.Input
                  autoFocus
                  aria-label={"Search " + field.label}
                  placeholder="Search options…"
                  className="h-11 min-w-0 w-full bg-transparent font-normal outline-none placeholder:text-[var(--muted)]"
                />
              </div>
              <Command.List
                aria-multiselectable={field.isMulti || undefined}
                aria-label={field.label}
                className="max-h-[min(260px,var(--radix-popover-content-available-height))] overflow-y-auto p-1"
              >
                <Command.Empty className="px-3 py-6 text-center text-[var(--muted)]">
                  No options found.
                </Command.Empty>
                {field.options.map((option) => (
                  <Command.Item
                    key={option.value}
                    value={option.value}
                    keywords={[option.label]}
                    onSelect={() => choose(option.value)}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded px-3 py-2.5 outline-none data-[selected=true]:bg-[var(--bg2)] data-[selected=true]:text-[var(--accent)]"
                  >
                    <span>{option.label}</span>
                    {selected.includes(option.value) && (
                      <svg
                        aria-label="Selected"
                        className="h-4 w-4 shrink-0"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="m3 8 3 3 7-7" />
                      </svg>
                    )}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
