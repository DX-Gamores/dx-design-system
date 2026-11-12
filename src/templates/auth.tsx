"use client";
import NextLink from "next/link";
import { useState } from "react";
import { Button, Checkbox, Divider, ErrorSummary, Icon, Link, TextField } from "@/components/ui";

/* Figma: _Template/Auth/Sign in + Sign up (Desktop · Tablet · Mobile). Sits inside <AuthShell>. */

function PasswordField({ id, label, helperText, error, autoComplete }: { id: string; label: string; helperText?: string; error?: string; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <TextField id={id} label={label} type={show ? "text" : "password"} autoComplete={autoComplete} helperText={helperText} error={error} className="pe-1"
      trailing={
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}
          className="grid size-8 shrink-0 place-items-center rounded-sm text-icon-secondary hover:bg-neutral-hover focus-visible:focus-ring">
          <Icon name={show ? "eye-off" : "eye"} />
        </button>
      } />
  );
}

function useValidate(rules: Record<string, (v: string, form: HTMLFormElement) => string | null>) {
  const [errors, setErrors] = useState<{ fieldId: string; message: string }[]>([]);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const errs = Object.entries(rules).flatMap(([id, rule]) => { const el = f.querySelector<HTMLInputElement>(`#${id}`); const m = el ? rule(el.type === "checkbox" ? String(el.checked) : el.value, f) : null; return m ? [{ fieldId: id, message: m }] : []; });
    setErrors(errs);
  };
  return { errors, onSubmit, err: (id: string) => errors.find((x) => x.fieldId === id)?.message };
}
const emailRule = (v: string) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Enter an email address, like name@company.com");

export function SignInTemplate() {
  const { errors, onSubmit, err } = useValidate({ "signin-email": emailRule, "signin-password": (v) => (v ? null : "Enter your password") });
  return (
    <>
      <div className="flex flex-col gap-1"><h1 className="text-heading-h2">Sign in to Acme</h1><p className="text-body-medium text-fg-secondary">Welcome back. Enter your details to continue.</p></div>
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        <ErrorSummary errors={errors} />
        <TextField id="signin-email" label="Email" type="email" autoComplete="email" placeholder="name@company.com" error={err("signin-email")} />
        <PasswordField id="signin-password" label="Password" autoComplete="current-password" error={err("signin-password")} />
        <div className="flex items-center justify-between gap-3"><Checkbox label="Remember me" defaultChecked /><Link href="#" size="sm">Forgot password?</Link></div>
        <Button type="submit" size="lg" className="w-full">Sign in</Button>
      </form>
      <Divider />
      <p className="text-center text-body-small text-fg-secondary">New to Acme? <NextLink href="/templates/sign-up" className="rounded-sm text-label-small text-fg-brand underline underline-offset-2 focus-visible:focus-ring">Create an account</NextLink></p>
    </>
  );
}

export function SignUpTemplate() {
  const { errors, onSubmit, err } = useValidate({
    "signup-name": (v) => (v.trim() ? null : "Enter your full name"),
    "signup-email": emailRule,
    "signup-password": (v) => (v.length >= 8 && /\d/.test(v) ? null : "Use at least 8 characters, including a number"),
    "signup-terms": (v) => (v === "true" ? null : "Agree to the Terms and Privacy Policy to continue"),
  });
  return (
    <>
      <div className="flex flex-col gap-1"><h1 className="text-heading-h2">Create your account</h1><p className="text-body-medium text-fg-secondary">Start a 14-day free trial. No credit card needed.</p></div>
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        <ErrorSummary errors={errors} />
        <TextField id="signup-name" label="Full name" autoComplete="name" error={err("signup-name")} />
        <TextField id="signup-email" label="Work email" type="email" autoComplete="email" placeholder="name@company.com" error={err("signup-email")} />
        <PasswordField id="signup-password" label="Password" autoComplete="new-password" helperText="At least 8 characters, including a number." error={err("signup-password")} />
        <div className="flex flex-col gap-1">
          <Checkbox id="signup-terms" label={<>I agree to the <Link href="#" size="sm">Terms</Link> and <Link href="#" size="sm">Privacy Policy</Link></>} aria-invalid={!!err("signup-terms") || undefined} />
          {err("signup-terms") && <p className="flex items-center gap-1 ps-7 text-caption-default text-fg-danger"><Icon name="alert-circle" size={16} />{err("signup-terms")}</p>}
        </div>
        <Button type="submit" size="lg" className="w-full">Create account</Button>
      </form>
      <Divider />
      <p className="text-center text-body-small text-fg-secondary">Already have an account? <NextLink href="/templates/sign-in" className="rounded-sm text-label-small text-fg-brand underline underline-offset-2 focus-visible:focus-ring">Sign in</NextLink></p>
    </>
  );
}
