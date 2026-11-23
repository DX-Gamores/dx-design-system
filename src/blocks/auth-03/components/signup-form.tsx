"use client";
import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/data";
import { Checkbox, TextField } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/nav-extra";
import { ErrorSummary } from "@/components/ui/patterns";
import { PasswordField } from "../../_parts/password-field";

const rules = [
  { id: "len", label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { id: "num", label: "A number", test: (v: string) => /\d/.test(v) },
  { id: "let", label: "A letter", test: (v: string) => /[a-z]/i.test(v) },
];

export function SignupForm() {
  const [pw, setPw] = useState("");
  const [errors, setErrors] = useState<{ fieldId: string; message: string }[]>([]);
  const err = (id: string) => errors.find((e) => e.fieldId === id)?.message;
  const met = rules.filter((r) => r.test(pw)).length;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-heading-h2">Create your account</h1>
        <p className="text-body-medium text-fg-secondary">Start a 14-day free trial. No credit card needed.</p>
      </div>
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          setErrors([
            ...(String(f.get("name") ?? "").trim() ? [] : [{ fieldId: "su-name", message: "Enter your full name" }]),
            ...(/^\S+@\S+\.\S+$/.test(String(f.get("email") ?? "")) ? [] : [{ fieldId: "su-email", message: "Enter an email address, like name@company.com" }]),
            ...(met === rules.length ? [] : [{ fieldId: "su-password", message: "Choose a password that meets all the rules" }]),
            ...(f.get("terms") ? [] : [{ fieldId: "su-terms", message: "Agree to the Terms and Privacy Policy to continue" }]),
          ]);
        }}
      >
        <ErrorSummary errors={errors} />
        <TextField id="su-name" name="name" label="Full name" autoComplete="name" error={err("su-name")} />
        <TextField id="su-email" name="email" label="Work email" type="email" autoComplete="email" placeholder="name@company.com" error={err("su-email")} />
        <div className="flex flex-col gap-2">
          <PasswordField id="su-password" name="password" label="Password" autoComplete="new-password" error={err("su-password")} value={pw} onChange={setPw} />
          <ul aria-label="Password rules" className="flex flex-col gap-1">
            {rules.map((r) => {
              const ok = r.test(pw);
              return (
                <li key={r.id} className={`flex items-center gap-2 text-caption-default ${ok ? "text-fg-success" : "text-fg-secondary"}`}>
                  <Icon name={ok ? "check-circle" : "minus"} size={16} />
                  {r.label}<span className="sr-only">{ok ? " — done" : " — not yet"}</span>
                </li>
              );
            })}
          </ul>
          <p aria-live="polite" className="sr-only">{pw ? `${met} of ${rules.length} password rules met` : ""}</p>
        </div>
        <div className="flex flex-col gap-1">
          <Checkbox id="su-terms" name="terms" label={<>I agree to the <Link href="#" size="sm">Terms</Link> and <Link href="#" size="sm">Privacy Policy</Link></>} aria-invalid={!!err("su-terms") || undefined} />
          {err("su-terms") && <p className="flex items-center gap-1 ps-7 text-caption-default text-fg-danger"><Icon name="alert-circle" size={16} />{err("su-terms")}</p>}
        </div>
        <Button type="submit" size="lg" className="w-full">Create account</Button>
      </form>
      <div className="flex items-center gap-3 text-caption-default text-fg-secondary"><div className="flex-1"><Divider /></div>or<div className="flex-1"><Divider /></div></div>
      <Button variant="secondary"><KeyRound aria-hidden className="size-4" />Sign up with single sign-on</Button>
      <p className="text-center text-body-small text-fg-secondary">Already have an account? <Link href="#" size="sm">Sign in</Link></p>
    </div>
  );
}
