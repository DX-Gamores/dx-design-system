"use client";
import { useId, useRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";

/* Shared field chrome — Figma: Text Field / Select / Textarea / Date Field.
   Label always visible; helper becomes the error message; error is text, not only colour. */
export const fieldBox =
  "flex w-full items-center gap-2 rounded-control border bg-surface px-[var(--ds-padding-field)] text-body-medium " +
  "border-line-strong hover:border-line-hover focus-within:border-line-focus focus-within:focus-ring " +
  "has-[:disabled]:bg-disabled has-[:disabled]:border-line-disabled has-[:disabled]:text-fg-disabled " +
  "data-[invalid=true]:border-line-danger " +
  // the field box shows the ring (focus-within), so the input inside doesn't draw a second one
  "[&_input:focus-visible]:shadow-none [&_select:focus-visible]:shadow-none [&_textarea:focus-visible]:shadow-none";

export type FieldShell = { id?: string; label: string; helperText?: string; error?: string; hideLabel?: boolean; size?: "md" | "sm"; children: (ids: { id: string; describedBy?: string }) => ReactNode };
export function Field({ id: given, label, helperText, error, hideLabel, children }: FieldShell) {
  const auto = useId();
  const id = given ?? auto;
  const hid = `${id}-help`;
  const msg = error || helperText;
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className={cn("text-label-medium text-fg-primary", hideLabel && "sr-only")}>
        {label}
      </label>
      {children({ id, describedBy: msg ? hid : undefined })}
      {msg && (
        <p id={hid} className={cn("flex items-center gap-1 text-caption-default", error ? "text-fg-danger" : "text-fg-secondary")}>
          {error && <Icon name="alert-circle" size={16} />}
          {msg}
        </p>
      )}
    </div>
  );
}

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string;
  helperText?: string;
  error?: string;
  hideLabel?: boolean;
  leadingIcon?: IconName;
  /** Content after the input inside the field, e.g. a show-password IconButton. */
  trailing?: ReactNode;
  size?: "md" | "sm";
};
export function TextField({ id: given, label, helperText, error, hideLabel, leadingIcon, trailing, size = "md", className, ...rest }: TextFieldProps) {
  return (
    <Field id={given} label={label} helperText={helperText} error={error} hideLabel={hideLabel}>
      {({ id, describedBy }) => (
        <div data-invalid={!!error} className={cn(fieldBox, size === "md" ? "h-control-md" : "h-control-sm", className)}>
          {leadingIcon && <Icon name={leadingIcon} className="text-icon-secondary" />}
          <input
            id={id}
            aria-describedby={describedBy}
            aria-invalid={!!error || undefined}
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-placeholder read-only:text-fg-secondary"
            {...rest}
          />
          {trailing}
        </div>
      )}
    </Field>
  );
}

export function Textarea({ id: given, label, helperText, error, maxLength, value, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; helperText?: string; error?: string }) {
  return (
    <Field id={given} label={label} helperText={helperText} error={error}>
      {({ id, describedBy }) => (
        <div data-invalid={!!error} className={cn(fieldBox, "items-start py-2")}>
          <textarea id={id} aria-describedby={describedBy} maxLength={maxLength} value={value} className="min-h-[var(--ds-size-textarea-min)] w-full resize-y bg-transparent outline-none placeholder:text-fg-placeholder" {...rest} />
        </div>
      )}
    </Field>
  );
}

/** Figma: Select — uses the native <select> for free keyboard + screen-reader support. 15+ options → Combobox. */
export function Select({ id: given, label, hideLabel, helperText, error, options, placeholder, ...rest }: Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & { label: string; hideLabel?: boolean; helperText?: string; error?: string; placeholder?: string; options: { value: string; label: string }[] }) {
  return (
    <Field id={given} label={label} hideLabel={hideLabel} helperText={helperText} error={error}>
      {({ id, describedBy }) => (
        <div data-invalid={!!error} className={cn(fieldBox, "relative h-control-md pr-2")}>
          <select id={id} aria-describedby={describedBy} className="h-full flex-1 appearance-none bg-transparent pr-8 outline-none" {...rest}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Icon name="chevron-down" className="pointer-events-none absolute right-3 text-icon-primary" />
        </div>
      )}
    </Field>
  );
}

/** Figma: Checkbox — whole row is the target; long labels wrap. */
export function Checkbox({ label, ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-body-small has-[:disabled]:cursor-not-allowed has-[:disabled]:text-fg-disabled">
      <input type="checkbox" className="mt-0.5 size-5 shrink-0 cursor-[inherit] rounded-sm accent-[var(--ds-color-bg-brand)] focus-visible:focus-ring" {...rest} />
      <span>{label}</span>
    </label>
  );
}

/** Figma: Toggle — role="switch", applies immediately. Label names the setting, not the state. */
export function Toggle({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (on: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-3 text-body-small disabled:text-fg-disabled"
    >
      <span
        className={cn(
          "relative h-[var(--ds-size-toggle-height)] w-[var(--ds-size-toggle-width)] rounded-full transition-colors duration-150 group-focus-visible:focus-ring",
          checked ? "bg-brand" : "bg-control-off",
          disabled && "opacity-[var(--ds-opacity-disabled)]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-[calc(var(--ds-size-toggle-height)-4px)] rounded-full bg-[var(--ds-color-icon-on-control-off)] shadow-elevation-1 transition-transform duration-150 ease-spring-snappy",
            checked && "translate-x-[calc(var(--ds-size-toggle-width)-var(--ds-size-toggle-height))] rtl:-translate-x-[calc(var(--ds-size-toggle-width)-var(--ds-size-toggle-height))]",
          )}
        />
      </span>
      {label}
    </button>
  );
}

/* ---------- Radio — Figma: Radio. Native radios in a fieldset: Tab enters on the selected one, arrows move + select. */
export function Radio({ label, ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-body-small has-[:disabled]:cursor-not-allowed has-[:disabled]:text-fg-disabled">
      <input type="radio" className="mt-0.5 size-5 shrink-0 cursor-[inherit] accent-[var(--ds-color-bg-brand)] focus-visible:focus-ring" {...rest} />
      <span>{label}</span>
    </label>
  );
}
export function RadioGroup({ label, name, options, value, defaultValue, onChange, error, helperText, orientation = "vertical" }: {
  label: string; name: string; options: { value: string; label: ReactNode; disabled?: boolean }[];
  value?: string; defaultValue?: string; onChange?: (value: string) => void; error?: string; helperText?: string; orientation?: "vertical" | "horizontal";
}) {
  const id = useId();
  const msg = error || helperText;
  return (
    <fieldset aria-describedby={msg ? `${id}-help` : undefined} aria-invalid={!!error || undefined} className="flex flex-col gap-2">
      <legend className="pb-2 text-label-medium">{label}</legend>
      <div className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-wrap gap-x-6")}>
        {options.map((o) => (
          <Radio key={o.value} name={name} value={o.value} label={o.label} disabled={o.disabled}
            {...(value !== undefined ? { checked: value === o.value } : { defaultChecked: defaultValue === o.value })}
            onChange={() => onChange?.(o.value)} />
        ))}
      </div>
      {msg && (
        <p id={`${id}-help`} className={cn("flex items-center gap-1 text-caption-default", error ? "text-fg-danger" : "text-fg-secondary")}>
          {error && <Icon name="alert-circle" size={16} />}{msg}
        </p>
      )}
    </fieldset>
  );
}

/* ---------- Search Field — Figma: Search Field. type="search" (role searchbox) + a one-tap clear. */
export function SearchField({ label = "Search", value, onChange, onClear, size = "md", placeholder = "Search", className, ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange" | "value"> & {
  label?: string; value: string; onChange: (value: string) => void; onClear?: () => void; size?: "md" | "sm";
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className={cn(fieldBox, size === "md" ? "h-control-md" : "h-control-sm", className)}>
      <Icon name="search" size={size === "md" ? 20 : 16} className="text-icon-secondary" />
      <input ref={ref} type="search" aria-label={label} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Escape" && value) { e.preventDefault(); onChange(""); onClear?.(); } }}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-placeholder [&::-webkit-search-cancel-button]:hidden" {...rest} />
      {value && (
        <button type="button" aria-label="Clear search" onClick={() => { onChange(""); onClear?.(); ref.current?.focus(); }}
          className="grid size-6 place-items-center rounded-sm text-icon-secondary hover:bg-neutral-hover focus-visible:focus-ring">
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
}

/* ---------- Chip — Figma: Chip. Selectable filter (aria-pressed) and/or removable tag. */
export function Chip({ children, selected, onToggle, onRemove, disabled }: { children: string; selected?: boolean; onToggle?: (selected: boolean) => void; onRemove?: () => void; disabled?: boolean }) {
  const base = cn(
    "inline-flex h-8 items-center gap-1 rounded-full border text-label-small transition-colors duration-150",
    disabled ? "cursor-not-allowed border-line-disabled bg-disabled text-fg-disabled"
      : selected ? "border-line-selected bg-selected text-fg-brand" : "border-line-strong bg-surface text-fg-primary",
  );
  if (!onToggle) {
    return (
      <span className={cn(base, "pl-3", onRemove ? "pr-1" : "pr-3")}>
        {children}
        {onRemove && (
          <button type="button" disabled={disabled} aria-label={`Remove ${children}`} onClick={onRemove} className="grid size-6 place-items-center rounded-full hover:bg-neutral-hover focus-visible:focus-ring">
            <Icon name="close" size={16} />
          </button>
        )}
      </span>
    );
  }
  return (
    <button type="button" aria-pressed={!!selected} disabled={disabled} onClick={() => onToggle(!selected)} className={cn(base, "px-3 focus-visible:focus-ring", !disabled && (selected ? "hover:bg-selected-hover" : "hover:bg-neutral-hover"))}>
      {selected && <Icon name="check" size={16} />}
      {children}
    </button>
  );
}
