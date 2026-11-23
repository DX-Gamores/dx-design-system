"use client";
import { useState } from "react";
import { KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/data";
import { Checkbox, TextField } from "@/components/ui/form";
import { Link } from "@/components/ui/nav-extra";
import { ErrorSummary } from "@/components/ui/patterns";
import { PasswordField } from "./password-field";

const emailOk = (v: string) => /^\S+@\S+\.\S+$/.test(v);

/** Email + password sign-in with an error summary, plus single sign-on and magic-link options. */
export function LoginForm({ title = "Sign in to Acme", headingLevel = 1 }: { title?: string; headingLevel?: 1 | 2 }) {
  const [errors, setErrors] = useState<{ fieldId: string; message: string }[]>([]);
  const err = (id: string) => errors.find((e) => e.fieldId === id)?.message;
  const H = `h${headingLevel}` as "h1";
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <H className="text-heading-h2">{title}</H>
        <p className="text-body-medium text-fg-secondary">Welcome back. Enter your details to continue.</p>
      </div>
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const next = [
            ...(emailOk(String(f.get("email") ?? "")) ? [] : [{ fieldId: "login-email", message: "Enter an email address, like name@company.com" }]),
            ...(f.get("password") ? [] : [{ fieldId: "login-password", message: "Enter your password" }]),
          ];
          setErrors(next);
        }}
      >
        <ErrorSummary errors={errors} />
        <TextField id="login-email" name="email" label="Email" type="email" autoComplete="email" placeholder="name@company.com" error={err("login-email")} />
        <PasswordField id="login-password" name="password" label="Password" autoComplete="current-password" error={err("login-password")} />
        <div className="flex items-center justify-between gap-3"><Checkbox label="Remember me" defaultChecked /><Link href="#" size="sm">Forgot password?</Link></div>
        <Button type="submit" size="lg" className="w-full">Sign in</Button>
      </form>
      <div className="flex items-center gap-3 text-caption-default text-fg-secondary"><div className="flex-1"><Divider /></div>or<div className="flex-1"><Divider /></div></div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="secondary"><KeyRound aria-hidden className="size-4" />Single sign-on</Button>
        <Button variant="secondary"><Mail aria-hidden className="size-4" />Email me a link</Button>
      </div>
      <p className="text-center text-body-small text-fg-secondary">New to Acme? <Link href="#" size="sm">Create an account</Link></p>
    </div>
  );
}
