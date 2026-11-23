"use client";
import { useState } from "react";
import { TextField } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";

/** Password input with a show/hide button. */
export function PasswordField({ id, name, label, helperText, error, autoComplete, value, onChange }: {
  id: string; name?: string; label: string; helperText?: string; error?: string; autoComplete: string; value?: string; onChange?: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <TextField id={id} name={name} label={label} type={show ? "text" : "password"} autoComplete={autoComplete} helperText={helperText} error={error} className="pe-1"
      value={value} onChange={onChange && ((e) => onChange(e.target.value))}
      trailing={
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}
          className="grid size-8 shrink-0 place-items-center rounded-sm text-icon-secondary hover:bg-neutral-hover focus-visible:focus-ring">
          <Icon name={show ? "eye-off" : "eye"} />
        </button>
      } />
  );
}
