"use client";
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";

/* Shared field chrome — Figma: Text Field / Select / Textarea / Date Field.
   Label always visible; helper becomes the error message; error is text, not only colour. */
const fieldBox =
  "flex w-full items-center gap-2 rounded-control border bg-surface px-[var(--ds-padding-field)] text-body-medium " +
  "border-line-strong hover:border-line-hover focus-within:border-line-focus focus-within:focus-ring " +
  "has-[:disabled]:bg-disabled has-[:disabled]:border-line-disabled has-[:disabled]:text-fg-disabled " +
  "data-[invalid=true]:border-line-danger";

type FieldShell = { label: string; helperText?: string; error?: string; hideLabel?: boolean; size?: "md" | "sm"; children: (ids: { id: string; describedBy?: string }) => ReactNode };
function Field({ label, helperText, error, hideLabel, children }: FieldShell) {
  const id = useId();
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
  size?: "md" | "sm";
};
export function TextField({ label, helperText, error, hideLabel, leadingIcon, size = "md", className, ...rest }: TextFieldProps) {
  return (
    <Field label={label} helperText={helperText} error={error} hideLabel={hideLabel}>
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
        </div>
      )}
    </Field>
  );
}

export function Textarea({ label, helperText, error, maxLength, value, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; helperText?: string; error?: string }) {
  return (
    <Field label={label} helperText={helperText} error={error}>
      {({ id, describedBy }) => (
        <div data-invalid={!!error} className={cn(fieldBox, "items-start py-2")}>
          <textarea id={id} aria-describedby={describedBy} maxLength={maxLength} value={value} className="min-h-[var(--ds-size-textarea-min)] w-full resize-y bg-transparent outline-none placeholder:text-fg-placeholder" {...rest} />
        </div>
      )}
    </Field>
  );
}

/** Figma: Select — uses the native <select> for free keyboard + screen-reader support. 15+ options → Combobox. */
export function Select({ label, helperText, error, options, placeholder, ...rest }: Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & { label: string; helperText?: string; error?: string; placeholder?: string; options: { value: string; label: string }[] }) {
  return (
    <Field label={label} helperText={helperText} error={error}>
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
