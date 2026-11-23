/**
 * @title A centered sign-in card
 * @description Email and password with show/hide, an error summary that links to each field, remember me, single sign-on and a magic-link option.
 * @route /login
 */
import { GalleryVerticalEnd } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { LoginForm } from "../_parts/login-form";

export default function Page() {
  return (
    <main id="main" className="flex min-h-svh flex-col items-center justify-center gap-6 bg-canvas p-4 sm:p-10">
      <a href="#" className="flex items-center gap-2 rounded-sm text-label-large focus-visible:focus-ring">
        <span className="grid size-7 place-items-center rounded-control bg-brand text-fg-on-brand"><Icon name={GalleryVerticalEnd} size={16} /></span>
        Acme Inc
      </a>
      <div className="w-full max-w-[420px] rounded-container border border-line-default bg-surface p-6 shadow-elevation-1 sm:p-8">
        <LoginForm />
      </div>
      <p className="max-w-[420px] text-center text-caption-default text-fg-secondary">
        By signing in you agree to our <a href="#" className="rounded-sm underline underline-offset-2 hover:text-fg-primary focus-visible:focus-ring">Terms</a> and <a href="#" className="rounded-sm underline underline-offset-2 hover:text-fg-primary focus-visible:focus-ring">Privacy Policy</a>.
      </p>
    </main>
  );
}
