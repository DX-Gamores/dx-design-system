"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";
import { Button, IconButton } from "./button";
import { Field, fieldBox } from "./form";

/* Figma: Date Picker page — Date Field + Calendar + Calendar Day.
   The field always stays typeable; the calendar is a shortcut in a dialog (WAI-ARIA APG Date Picker Dialog). */

const sameDay = (a?: Date | null, b?: Date | null) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => { const t = new Date(d.getFullYear(), d.getMonth() + n, 1); const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate(); return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last)); };
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const formatDate = (d: Date, locale?: string) => new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }).format(d);
const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
/** Loose parsing: 11/18/2026, 11/18, Nov 18, 18 Nov 2026, 2026-11-18. */
export function parseDate(s: string, ref = new Date()): Date | null {
  const t = s.trim().toLowerCase();
  if (!t) return null;
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return valid(+m[1], +m[2] - 1, +m[3]);
  m = t.match(/^(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{2,4}))?$/);
  if (m) return valid(m[3] ? (m[3].length === 2 ? 2000 + +m[3] : +m[3]) : ref.getFullYear(), +m[1] - 1, +m[2]);
  m = t.match(/^([a-z]{3})[a-z]*\.?\s+(\d{1,2}),?(?:\s+(\d{4}))?$/) ?? null;
  if (m && months.includes(m[1])) return valid(m[3] ? +m[3] : ref.getFullYear(), months.indexOf(m[1]), +m[2]);
  m = t.match(/^(\d{1,2})\s+([a-z]{3})[a-z]*\.?,?(?:\s+(\d{4}))?$/);
  if (m && months.includes(m[2])) return valid(m[3] ? +m[3] : ref.getFullYear(), months.indexOf(m[2]), +m[1]);
  return null;
}
function valid(y: number, mo: number, d: number) { const x = new Date(y, mo, d); return x.getMonth() === mo && x.getDate() === d ? x : null; }

export type DateRange = { start: Date | null; end: Date | null };
type DayState = { today: boolean; selected: boolean; rangeStart: boolean; rangeEnd: boolean; inRange: boolean; outside: boolean; disabled: boolean };

/* ---------- Calendar Day — 40×40 hit area, 32px circle. Disabled adds a strike, never colour alone. */
export function CalendarDay({ date, state, focused, onPick, onHover, buttonRef }: { date: Date; state: DayState; focused: boolean; onPick: () => void; onHover?: () => void; buttonRef?: (el: HTMLButtonElement | null) => void }) {
  const { today, selected, rangeStart, rangeEnd, inRange, outside, disabled } = state;
  const edge = selected || rangeStart || rangeEnd;
  return (
    <td role="gridcell" aria-selected={edge || inRange || undefined} className={cn("p-0", inRange && "bg-brand-subtle", rangeStart && "rounded-s-full bg-brand-subtle", rangeEnd && "rounded-e-full bg-brand-subtle", rangeStart && rangeEnd && "bg-transparent")}>
      <button
        ref={buttonRef} type="button" tabIndex={focused ? 0 : -1} disabled={disabled}
        aria-current={today ? "date" : undefined} aria-label={new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date)}
        onClick={onPick} onMouseEnter={onHover}
        className="group grid size-10 place-items-center focus-visible:outline-none"
      >
        <span className={cn(
          "relative grid size-8 place-items-center rounded-full text-body-small tabular-nums transition-colors duration-instant group-focus-visible:focus-ring",
          edge ? "bg-brand text-fg-on-brand" : "group-hover:bg-neutral-hover",
          outside && !edge && "text-fg-secondary",
          today && !edge && "font-semibold text-fg-brand ring-1 ring-line-selected",
          disabled && "text-fg-disabled line-through group-hover:bg-transparent",
        )}>
          {date.getDate()}
        </span>
      </button>
    </td>
  );
}

/* ---------- Calendar — month grid. ←→ day · ↑↓ week · Home/End week · PgUp/PgDn month · Shift+PgUp/PgDn year. */
type CalendarProps = {
  mode?: "single" | "range"; value?: Date | null; range?: DateRange; onChange?: (d: Date) => void; onRangeChange?: (r: DateRange) => void;
  min?: Date; max?: Date; isDisabled?: (d: Date) => boolean; locale?: string; weekStartsOn?: 0 | 1;
  showFooter?: boolean; onApply?: () => void; onCancel?: () => void; onEscape?: () => void; autoFocus?: boolean;
};
export function Calendar({ mode = "single", value, range, onChange, onRangeChange, min, max, isDisabled, locale, weekStartsOn = 0, showFooter, onApply, onCancel, onEscape, autoFocus }: CalendarProps) {
  const today = startOfDay(new Date());
  const initial = (mode === "range" ? range?.start : value) ?? today;
  const [focus, setFocus] = useState<Date>(initial);
  const [hover, setHover] = useState<Date | null>(null);
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const key = (d: Date) => d.toDateString();
  const wantFocus = useRef(!!autoFocus);
  useEffect(() => { if (wantFocus.current) refs.current.get(key(focus))?.focus(); });
  const titleId = useId();

  const off = (d: Date) => (!!min && d < startOfDay(min)) || (!!max && d > startOfDay(max)) || !!isDisabled?.(d);
  const first = new Date(focus.getFullYear(), focus.getMonth(), 1);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const gridStart = addDays(first, -lead);
  const weeks = Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(gridStart, w * 7 + d)));
  const dayNames = Array.from({ length: 7 }, (_, i) => addDays(gridStart, i));
  const fmtDay = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const fmtDayLong = new Intl.DateTimeFormat(locale, { weekday: "long" });

  const rs = range?.start ?? null, re = range?.end ?? (rs && hover && hover > rs ? hover : null);
  const state = (d: Date): DayState => ({
    today: sameDay(d, today), outside: d.getMonth() !== focus.getMonth(), disabled: off(d),
    selected: mode === "single" && sameDay(d, value), rangeStart: mode === "range" && sameDay(d, rs), rangeEnd: mode === "range" && sameDay(d, re),
    inRange: mode === "range" && !!rs && !!re && d > rs && d < re,
  });
  const pick = (d: Date) => {
    if (off(d)) return;
    setFocus(d);
    if (mode === "single") return onChange?.(d);
    if (!rs || (rs && range?.end) || d < rs) onRangeChange?.({ start: d, end: null }); else onRangeChange?.({ start: rs, end: d });
  };
  const moveTo = (d: Date) => { wantFocus.current = true; setFocus(d); };
  const onKey = (e: KeyboardEvent) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl" ? -1 : 1;
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focus, -1 * rtl), ArrowRight: () => addDays(focus, 1 * rtl), ArrowUp: () => addDays(focus, -7), ArrowDown: () => addDays(focus, 7),
      Home: () => addDays(focus, -((focus.getDay() - weekStartsOn + 7) % 7)), End: () => addDays(focus, 6 - ((focus.getDay() - weekStartsOn + 7) % 7)),
      PageUp: () => addMonths(focus, e.shiftKey ? -12 : -1), PageDown: () => addMonths(focus, e.shiftKey ? 12 : 1),
    };
    if (map[e.key]) { e.preventDefault(); moveTo(map[e.key]()); }
    else if (e.key === "Escape") { e.preventDefault(); onEscape?.(); }
  };

  return (
    <div className="flex w-fit flex-col gap-2 rounded-container border border-line-default bg-surface p-3 shadow-elevation-2">
      <div className="flex items-center justify-between gap-2">
        <IconButton icon="chevron-left" label="Previous month" variant="ghost" size="sm" onClick={() => setFocus(addMonths(focus, -1))} />
        <h2 id={titleId} aria-live="polite" className="text-label-large">{new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(focus)}</h2>
        <IconButton icon="chevron-right" label="Next month" variant="ghost" size="sm" onClick={() => setFocus(addMonths(focus, 1))} />
      </div>
      <table role="grid" aria-labelledby={titleId} onKeyDown={onKey} onMouseLeave={() => setHover(null)} className="border-collapse">
        <thead>
          <tr>{dayNames.map((d) => <th key={d.getDay()} scope="col" abbr={fmtDayLong.format(d)} className="size-10 text-caption-default font-normal text-fg-secondary">{fmtDay.format(d).slice(0, 2)}</th>)}</tr>
        </thead>
        <tbody>
          {weeks.map((w, i) => (
            <tr key={i}>
              {w.map((d) => (
                <CalendarDay key={key(d)} date={d} state={state(d)} focused={sameDay(d, focus)} onPick={() => pick(d)} onHover={() => mode === "range" && setHover(d)}
                  buttonRef={(el) => { if (el) refs.current.set(key(d), el); else refs.current.delete(key(d)); }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {showFooter && (
        <div className="flex items-center justify-between gap-2 border-t border-line-default pt-3">
          <Button size="sm" variant="ghost" onClick={() => { moveTo(today); if (mode === "single") pick(today); }}>Today</Button>
          <div className="flex gap-2">
            {onCancel && <Button size="sm" variant="secondary" onClick={onCancel}>Cancel</Button>}
            {onApply && <Button size="sm" onClick={onApply} disabled={mode === "range" && !(range?.start && range?.end)}>Apply</Button>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Date Picker (Date Field + Calendar). Typing always works; ↓ or the calendar button opens the grid. */
export function DatePicker({ label, value, onChange, min, max, isDisabled, helperText = "mm/dd/yyyy", error, size = "md", disabled, locale }: {
  label: string; value: Date | null; onChange: (d: Date | null) => void; min?: Date; max?: Date; isDisabled?: (d: Date) => boolean;
  helperText?: string; error?: string; size?: "md" | "sm"; disabled?: boolean; locale?: string;
}) {
  const [text, setText] = useState(value ? formatDate(value, locale) : "");
  const [open, setOpen] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const btn = useRef<HTMLButtonElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => setText(value ? formatDate(value, locale) : ""), [value, locale]);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close);
  }, [open]);
  const commit = () => {
    if (!text.trim()) { setLocalError(undefined); return onChange(null); }
    const d = parseDate(text);
    if (!d) return setLocalError(`Enter a date like 11/18/${new Date().getFullYear()}.`);
    if (min && d < startOfDay(min)) return setLocalError(`Pick a date on or after ${formatDate(min, locale)}.`);
    if (max && d > startOfDay(max)) return setLocalError(`Pick a date on or before ${formatDate(max, locale)}.`);
    setLocalError(undefined); onChange(d); setText(formatDate(d, locale));
  };
  const shown = error ?? localError;
  return (
    <Field label={label} helperText={helperText} error={shown}>
      {({ id, describedBy }) => (
        <div ref={wrap} className="relative">
          <div data-invalid={!!shown} className={cn(fieldBox, size === "md" ? "h-control-md" : "h-control-sm", "pe-1")}>
            <input id={id} value={text} disabled={disabled} aria-describedby={describedBy} aria-invalid={!!shown || undefined} placeholder="mm/dd/yyyy"
              onChange={(e) => setText(e.target.value)} onBlur={commit}
              onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "ArrowDown" && e.altKey) { e.preventDefault(); setOpen(true); } }}
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-placeholder" />
            <button ref={btn} type="button" disabled={disabled} aria-haspopup="dialog" aria-expanded={open}
              aria-label={value ? `Choose date, selected ${formatDate(value, locale)}` : "Choose date"} onClick={() => setOpen((o) => !o)}
              className="grid size-8 place-items-center rounded-sm text-icon-primary hover:bg-neutral-hover focus-visible:focus-ring disabled:text-icon-disabled">
              <Icon name="calendar" />
            </button>
          </div>
          {open && (
            <div role="dialog" aria-modal="true" aria-label="Choose date" className="absolute top-full z-[var(--ds-z-dropdown)] mt-1 start-0">
              <Calendar value={value} min={min} max={max} isDisabled={isDisabled} locale={locale} autoFocus showFooter
                onChange={(d) => { onChange(d); setLocalError(undefined); setOpen(false); btn.current?.focus(); }}
                onEscape={() => { setOpen(false); btn.current?.focus(); }} onCancel={() => { setOpen(false); btn.current?.focus(); }} />
            </div>
          )}
        </div>
      )}
    </Field>
  );
}
export { DatePicker as DateField };
