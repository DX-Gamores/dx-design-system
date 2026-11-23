/**
 * @title Sign up with password rules
 * @description Name, work email and a password with live rules (length, number, letter) announced politely, terms consent, and single sign-on.
 * @route /signup
 */
import { GalleryVerticalEnd } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { SignupForm } from "./components/signup-form";

export default function Page() {
  return (
    <main id="main" className="flex min-h-svh flex-col items-center justify-center gap-6 bg-canvas p-4 sm:p-10">
      <a href="#" className="flex items-center gap-2 rounded-sm text-label-large focus-visible:focus-ring">
        <span className="grid size-7 place-items-center rounded-control bg-brand text-fg-on-brand"><Icon name={GalleryVerticalEnd} size={16} /></span>
        Acme Inc
      </a>
      <div className="w-full max-w-[440px] rounded-container border border-line-default bg-surface p-6 shadow-elevation-1 sm:p-8">
        <SignupForm />
      </div>
    </main>
  );
}
