"use client";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";
import { Field, fieldBox } from "./form";
import { Spinner, Progress } from "./feedback";

/* ===================================================================================
   Listbox parts — Figma: Select Option / Select Menu, Combobox Option / Combobox Menu.
   The menu sits 4px under its field, Elevation/2, max 320px tall then scrolls.
   =================================================================================== */
export type ListOption = { value: string; label: string; description?: string; icon?: IconName; disabled?: boolean };

export function ListboxOption({ option, id, selected, active, query, onPick }: { option: ListOption; id: string; selected?: boolean; active?: boolean; query?: string; onPick?: () => void }) {
  const label = useMemo(() => {
    if (!query) return option.label;
    const i = option.label.toLowerCase().indexOf(query.toLowerCase());
    if (i < 0) return option.label;
    return <>{option.label.slice(0, i)}<strong className="font-semibold">{option.label.slice(i, i + query.length)}</strong>{option.label.slice(i + query.length)}</>;
  }, [option.label, query]);
  return (
    <li
      id={id}
      role="option"
      aria-selected={!!selected}
      aria-disabled={option.disabled || undefined}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => !option.disabled && onPick?.()}
      className={cn(
        "relative flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-body-small",
        active && "bg-neutral-hover before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-brand",
        selected && "bg-selected text-fg-brand",
        option.disabled ? "cursor-not-allowed text-fg-disabled" : "hover:bg-neutral-hover",
      )}
    >
      {option.icon && <Icon name={option.icon} className={option.disabled ? "text-icon-disabled" : "text-icon-secondary"} />}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate">{label}</span>
        {option.description && <span className="truncate text-caption-default text-fg-secondary">{option.description}</span>}
      </span>
      {selected && <Icon name="check" size={16} className="text-icon-brand" />}
    </li>
  );
}

export function ListboxMenu({ id, label, children, footer }: { id: string; label: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="absolute inset-x-0 top-full z-[var(--ds-z-dropdown)] mt-1 overflow-hidden rounded-md border border-line-default bg-surface shadow-elevation-2">
      <ul id={id} role="listbox" aria-label={label} className="max-h-80 overflow-y-auto p-1">{children}</ul>
      {footer}
    </div>
  );
}
export { ListboxOption as SelectOption, ListboxOption as ComboboxOption, ListboxMenu as SelectMenu, ListboxMenu as ComboboxMenu };

/* ===================================================================================
   Combobox — Figma: Combobox. ARIA 1.2 combobox with list autocomplete.
   Typing filters; ↓/↑ move; Enter picks; Esc closes, then clears; Tab leaves.
   =================================================================================== */
export function Combobox({
  label, options, value, onChange, onInputChange, loading, onCreate, recent, placeholder = "Search…", helperText, error, leadingIcon = "search", size = "md", disabled, showKeyboardHint,
}: {
  label: string; options: ListOption[]; value?: string | null; onChange?: (value: string | null) => void;
  /** Called on every keystroke — use it for async search. Without it, options are filtered locally. */
  onInputChange?: (query: string) => void; loading?: boolean; onCreate?: (query: string) => void;
  /** Shown when the query is empty (e.g. recently picked). */ recent?: ListOption[];
  placeholder?: string; helperText?: string; error?: string; leadingIcon?: IconName; size?: "md" | "sm"; disabled?: boolean; showKeyboardHint?: boolean;
}) {
  const uid = useId();
  const listId = `${uid}-list`;
  const selected = options.find((o) => o.value === value) ?? recent?.find((o) => o.value === value) ?? null;
  const [query, setQuery] = useState(selected?.label ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [typed, setTyped] = useState(false);
  useEffect(() => { if (!open) setQuery(selected?.label ?? ""); }, [selected?.label, open]);

  const q = typed ? query.trim() : "";
  const showRecent = !q && !!recent?.length;
  const list = showRecent ? recent! : onInputChange ? options : options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()) || o.description?.toLowerCase().includes(q.toLowerCase()));
  const canCreate = !!onCreate && !!q && !list.some((o) => o.label.toLowerCase() === q.toLowerCase());
  const total = list.length + (canCreate ? 1 : 0);
  const optId = (i: number) => `${uid}-opt-${i}`;

  const pick = (o: ListOption | null) => { onChange?.(o ? o.value : null); setQuery(o?.label ?? ""); setTyped(false); setOpen(false); setActive(-1); };
  const move = (d: number) => {
    if (!open) { setOpen(true); }
    let i = active;
    for (let n = 0; n < total; n++) { i = (i + d + total) % total; if (i >= list.length || !list[i].disabled) break; }
    setActive(i);
    document.getElementById(optId(i))?.scrollIntoView({ block: "nearest" });
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter" && open && active >= 0) {
      e.preventDefault();
      if (active < list.length) pick(list[active]); else { onCreate?.(q); setOpen(false); }
    } else if (e.key === "Escape") {
      if (open) { setOpen(false); setActive(-1); } else { setQuery(""); setTyped(false); onChange?.(null); }
    } else if (e.key === "Tab") setOpen(false);
  };
  const status = loading ? "Searching…" : !open ? "" : list.length ? `${list.length} result${list.length === 1 ? "" : "s"}` : q ? `No results for “${q}”` : "";

  return (
    <Field label={label} helperText={helperText} error={error}>
      {({ id, describedBy }) => (
        <div className="relative">
          <div data-invalid={!!error} className={cn(fieldBox, size === "md" ? "h-control-md" : "h-control-sm")}>
            {leadingIcon && <Icon name={leadingIcon} className="text-icon-secondary" />}
            <input
              id={id} role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list" aria-describedby={describedBy}
              aria-activedescendant={open && active >= 0 ? optId(active) : undefined} aria-invalid={!!error || undefined}
              autoComplete="off" disabled={disabled} value={query} placeholder={placeholder}
              onChange={(e) => { setQuery(e.target.value); setTyped(true); setOpen(true); setActive(-1); onInputChange?.(e.target.value); }}
              onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onBlur={() => { setOpen(false); setTyped(false); }} onKeyDown={onKey}
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-placeholder"
            />
            {loading ? <Spinner size="sm" label="" /> : <Icon name="chevron-down" className={cn("text-icon-primary transition-transform duration-fast", open && "rotate-180")} />}
          </div>
          <span role="status" aria-live="polite" className="sr-only">{status}</span>
          {open && (
            <ListboxMenu id={listId} label={label} footer={showKeyboardHint ? <p className="border-t border-line-default px-3 py-2 text-caption-default text-fg-secondary">↑↓ to move · Enter to pick · Esc to close</p> : undefined}>
              {showRecent && <li role="presentation" className="px-3 pt-2 pb-1 text-caption-default font-semibold text-fg-secondary">Recent</li>}
              {loading && !list.length && <li role="presentation" className="flex items-center gap-2 px-3 py-2 text-body-small text-fg-secondary"><Spinner size="sm" label="" /> Searching…</li>}
              {list.map((o, i) => <ListboxOption key={o.value} id={optId(i)} option={o} query={q} selected={o.value === value} active={i === active} onPick={() => pick(o)} />)}
              {!loading && !list.length && !canCreate && (
                <li role="presentation" className="px-3 py-3 text-body-small text-fg-secondary">No results for “{q}”. Check the spelling or try a different name.</li>
              )}
              {canCreate && (
                <li id={optId(list.length)} role="option" aria-selected={false} onMouseDown={(e) => e.preventDefault()} onClick={() => { onCreate?.(q); setOpen(false); }}
                  className={cn("flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-body-small text-fg-brand hover:bg-neutral-hover", active === list.length && "bg-neutral-hover")}>
                  <Icon name="plus" /> Create “{q}”
                </li>
              )}
            </ListboxMenu>
          )}
        </div>
      )}
    </Field>
  );
}

/* ===================================================================================
   Slider — Figma: Slider + Slider Thumb. Single or Range. Dragging is never required:
   click the rail, use the keys, or type in the number boxes (WCAG 2.5.7).
   =================================================================================== */
type SliderBase = { label: string; min?: number; max?: number; step?: number; disabled?: boolean; format?: (v: number) => string; showMinMax?: boolean; showInputs?: boolean; helperText?: string };

export function SliderThumb({ value, min, max, step, label, valueText, disabled, onChange, style }: { value: number; min: number; max: number; step: number; label: string; valueText: string; disabled?: boolean; onChange: (v: number) => void; style?: React.CSSProperties }) {
  const onKey = (e: KeyboardEvent<HTMLSpanElement>) => {
    const big = Math.max(step, (max - min) / 10);
    const map: Record<string, number> = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: big, PageDown: -big };
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl" && (e.key === "ArrowLeft" || e.key === "ArrowRight") ? -1 : 1;
    if (e.key in map) { e.preventDefault(); onChange(value + map[e.key] * rtl); }
    else if (e.key === "Home") { e.preventDefault(); onChange(min); }
    else if (e.key === "End") { e.preventDefault(); onChange(max); }
  };
  return (
    <span
      role="slider" tabIndex={disabled ? -1 : 0} aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={valueText} aria-disabled={disabled || undefined}
      onKeyDown={disabled ? undefined : onKey} style={style}
      className={cn(
        "absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-surface shadow-elevation-1 transition-[box-shadow,transform] duration-fast rtl:translate-x-1/2",
        disabled ? "border-line-disabled" : "cursor-grab border-line-selected hover:scale-110 focus-visible:focus-ring active:cursor-grabbing active:scale-110",
      )}
    />
  );
}

function useRail(min: number, max: number, step: number) {
  const ref = useRef<HTMLDivElement>(null);
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min));
  const fromPointer = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    const rtl = getComputedStyle(ref.current!).direction === "rtl";
    const t = (clientX - r.left) / r.width;
    return clamp(min + (rtl ? 1 - t : t) * (max - min));
  };
  return { ref, clamp, fromPointer };
}
const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;

function SliderShell({ label, children, header, footer, helperText }: { label: string; children: ReactNode; header?: ReactNode; footer?: ReactNode; helperText?: string }) {
  return (
    <div role="group" aria-label={label} className="flex w-full flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2"><span className="text-label-medium">{label}</span>{header}</div>
      {children}
      {footer}
      {helperText && <p className="text-caption-default text-fg-secondary">{helperText}</p>}
    </div>
  );
}
const NumberBox = ({ label, value, onCommit, min, max, disabled }: { label: string; value: number; onCommit: (v: number) => void; min: number; max: number; disabled?: boolean }) => {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  return (
    <label className="flex flex-col gap-1 text-caption-default text-fg-secondary">
      {label}
      <input type="number" inputMode="decimal" min={min} max={max} value={draft} disabled={disabled} onChange={(e) => setDraft(e.target.value)}
        onBlur={() => onCommit(Number(draft))} onKeyDown={(e) => e.key === "Enter" && onCommit(Number(draft))}
        className={cn(fieldBox, "h-control-sm w-28 text-body-small tabular-nums outline-none")} />
    </label>
  );
};

export function Slider({ label, value, onChange, min = 0, max = 100, step = 1, disabled, format = String, showMinMax = true, showInputs, helperText }: SliderBase & { value: number; onChange: (v: number) => void }) {
  const { ref, clamp, fromPointer } = useRail(min, max, step);
  const set = (v: number) => onChange(clamp(v));
  const drag = (e: React.PointerEvent) => {
    if (disabled) return;
    set(fromPointer(e.clientX));
    const mv = (ev: PointerEvent) => set(fromPointer(ev.clientX));
    const up = () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
  };
  const p = pct(value, min, max);
  return (
    <SliderShell label={label} helperText={helperText} header={<span className="text-label-medium tabular-nums text-fg-secondary">{format(value)}</span>}
      footer={(showMinMax || showInputs) && (
        <div className="flex items-end justify-between gap-2">
          {showMinMax && <span className="text-caption-default text-fg-secondary">{format(min)}</span>}
          {showInputs && <NumberBox label={label} value={value} onCommit={set} min={min} max={max} disabled={disabled} />}
          {showMinMax && <span className="text-caption-default text-fg-secondary">{format(max)}</span>}
        </div>
      )}>
      <div ref={ref} onPointerDown={drag} className={cn("relative h-6 touch-none select-none", disabled ? "cursor-not-allowed opacity-[var(--ds-opacity-disabled)]" : "cursor-pointer")}>
        <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-control-off/40" />
        <span className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand start-0" style={{ width: `${p}%` }} />
        <SliderThumb value={value} min={min} max={max} step={step} label={label} valueText={format(value)} disabled={disabled} onChange={set} style={{ insetInlineStart: `${p}%` }} />
      </div>
    </SliderShell>
  );
}

export function RangeSlider({ label, value, onChange, min = 0, max = 100, step = 1, disabled, format = String, showMinMax = true, showInputs, helperText, thumbLabels }: SliderBase & { value: [number, number]; onChange: (v: [number, number]) => void; thumbLabels?: [string, string] }) {
  const { ref, clamp, fromPointer } = useRail(min, max, step);
  const [lo, hi] = value;
  const names = thumbLabels ?? [`Minimum ${label.toLowerCase()}`, `Maximum ${label.toLowerCase()}`];
  const setLo = (v: number) => onChange([Math.min(clamp(v), hi), hi]);
  const setHi = (v: number) => onChange([lo, Math.max(clamp(v), lo)]);
  const drag = (e: React.PointerEvent) => {
    if (disabled) return;
    const v = fromPointer(e.clientX);
    const which = Math.abs(v - lo) <= Math.abs(v - hi) ? 0 : 1;
    const apply = (x: number) => (which === 0 ? setLo : setHi)(x);
    apply(v);
    const mv = (ev: PointerEvent) => apply(fromPointer(ev.clientX));
    const up = () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
  };
  const [pl, ph] = [pct(lo, min, max), pct(hi, min, max)];
  return (
    <SliderShell label={label} helperText={helperText} header={<span className="text-label-medium tabular-nums text-fg-secondary">{format(lo)} – {format(hi)}</span>}
      footer={(showMinMax || showInputs) && (
        <div className="flex items-end justify-between gap-2">
          {showInputs ? <NumberBox label={names[0]} value={lo} onCommit={setLo} min={min} max={max} disabled={disabled} /> : showMinMax && <span className="text-caption-default text-fg-secondary">{format(min)}</span>}
          {showInputs ? <NumberBox label={names[1]} value={hi} onCommit={setHi} min={min} max={max} disabled={disabled} /> : showMinMax && <span className="text-caption-default text-fg-secondary">{format(max)}</span>}
        </div>
      )}>
      <div ref={ref} onPointerDown={drag} className={cn("relative h-6 touch-none select-none", disabled ? "cursor-not-allowed opacity-[var(--ds-opacity-disabled)]" : "cursor-pointer")}>
        <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-control-off/40" />
        <span className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand" style={{ insetInlineStart: `${pl}%`, width: `${ph - pl}%` }} />
        <SliderThumb value={lo} min={min} max={hi} step={step} label={names[0]} valueText={format(lo)} disabled={disabled} onChange={setLo} style={{ insetInlineStart: `${pl}%` }} />
        <SliderThumb value={hi} min={lo} max={max} step={step} label={names[1]} valueText={format(hi)} disabled={disabled} onChange={setHi} style={{ insetInlineStart: `${ph}%` }} />
      </div>
    </SliderShell>
  );
}

/* ===================================================================================
   File Upload — Figma: File Upload. The whole zone is one labelled button; drag-and-drop
   is a shortcut, never the only way. Rules (types, size) are shown up front.
   =================================================================================== */
export type UploadItem = { file: File; progress?: number; error?: string };
const parseSize = (s?: string) => { const m = s?.match(/([\d.]+)\s*(KB|MB|GB)/i); return m ? Number(m[1]) * { KB: 1e3, MB: 1e6, GB: 1e9 }[m[2].toUpperCase() as "KB"] : Infinity; };
const human = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);

export function FileUpload({ label = "Upload files", accept, maxSize, multiple = true, helperText, disabled, items, onFiles, onRemove }: {
  label?: string; accept?: string; maxSize?: string; multiple?: boolean; helperText?: string; disabled?: boolean;
  /** Files to list under the zone, with optional progress (0–100) or error. */ items?: UploadItem[];
  /** Called with the files that pass the accept / size rules; rejected ones come back with an error. */ onFiles: (accepted: File[], rejected: UploadItem[]) => void;
  onRemove?: (file: File) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const hid = useId();
  const limit = parseSize(maxSize);
  const exts = accept?.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  const take = (list: FileList | null) => {
    if (!list) return;
    const ok: File[] = [], bad: UploadItem[] = [];
    for (const f of Array.from(list)) {
      const ext = "." + (f.name.split(".").pop() ?? "").toLowerCase();
      if (exts?.length && !exts.some((x) => x === ext || (x.endsWith("/*") ? f.type.startsWith(x.slice(0, -1)) : f.type === x))) bad.push({ file: f, error: `${f.name} isn’t a supported type. Use ${accept}.` });
      else if (f.size > limit) bad.push({ file: f, error: `${f.name} is ${human(f.size)} — the limit is ${maxSize}.` });
      else ok.push(f);
    }
    onFiles(ok, bad);
  };
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button" disabled={disabled} aria-describedby={hid} onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (!disabled) take(e.dataTransfer.files); }}
        className={cn(
          "flex flex-col items-center gap-2 rounded-container border-2 border-dashed px-6 py-8 text-center transition-colors duration-fast focus-visible:focus-ring",
          drag ? "border-line-selected bg-selected" : "border-line-strong bg-surface hover:border-line-hover hover:bg-surface-subtle",
          disabled && "cursor-not-allowed border-line-disabled bg-disabled text-fg-disabled",
        )}
      >
        <Icon name="upload" size={24} className={disabled ? "text-icon-disabled" : "text-icon-brand"} />
        <span className="text-label-medium">{drag ? "Drop to upload" : <><span className="text-fg-brand underline underline-offset-2">{label}</span> or drag and drop</>}</span>
        <span id={hid} className="text-caption-default text-fg-secondary">{helperText ?? [accept?.replace(/\./g, "").toUpperCase().replace(/,/g, ", "), maxSize && `up to ${maxSize}`].filter(Boolean).join(" · ")}</span>
      </button>
      <input ref={input} type="file" hidden accept={accept} multiple={multiple} onChange={(e) => { take(e.target.files); e.target.value = ""; }} />
      {!!items?.length && (
        <ul aria-label="Files" className="flex flex-col gap-2">
          {items.map((it) => (
            <li key={it.file.name + it.file.size} className={cn("flex items-center gap-3 rounded-md border p-3", it.error ? "border-line-danger bg-danger-subtle" : "border-line-default bg-surface")}>
              <Icon name={it.error ? "alert-circle" : "file"} className={it.error ? "text-icon-danger" : "text-icon-secondary"} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex justify-between gap-2 text-body-small"><span className="truncate">{it.file.name}</span><span className="shrink-0 text-fg-secondary">{human(it.file.size)}</span></span>
                {it.error ? <span role="alert" className="text-caption-default text-fg-danger">{it.error}</span>
                  : it.progress !== undefined && it.progress < 100 ? <Progress value={it.progress} label={`Uploading ${it.file.name}`} />
                  : it.progress === 100 ? <span className="flex items-center gap-1 text-caption-default text-fg-success"><Icon name="check" size={16} />Uploaded</span> : null}
              </div>
              {onRemove && (
                <button type="button" aria-label={`Remove ${it.file.name}`} onClick={() => onRemove(it.file)} className="grid size-8 place-items-center rounded-sm text-icon-secondary hover:bg-neutral-hover focus-visible:focus-ring">
                  <Icon name="close" size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
