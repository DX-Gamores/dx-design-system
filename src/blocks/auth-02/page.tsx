/**
 * @title A split sign-in screen with a brand panel
 * @description The form on one side, a brand panel with a customer quote on the other. The panel hides below 1024px.
 * @route /login
 */
import { GalleryVerticalEnd } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { LoginForm } from "../_parts/login-form";

export default function Page() {
  return (
    <div className="grid min-h-svh bg-canvas lg:grid-cols-2">
      <main id="main" className="flex flex-col gap-4 p-6 md:p-10">
        <a href="#" className="flex items-center gap-2 self-start rounded-sm text-label-large focus-visible:focus-ring">
          <span className="grid size-7 place-items-center rounded-control bg-brand text-fg-on-brand"><Icon name={GalleryVerticalEnd} size={16} /></span>
          Acme Inc
        </a>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[380px]"><LoginForm /></div>
        </div>
      </main>
      <aside aria-label="About Acme" className="relative hidden flex-col justify-end overflow-hidden bg-brand p-12 text-fg-on-brand lg:flex">
        <div aria-hidden className="absolute -end-24 -top-24 size-96 rounded-full bg-[var(--ds-color-text-on-brand)] opacity-10" />
        <div aria-hidden className="absolute -start-16 bottom-40 size-64 rounded-full bg-[var(--ds-color-text-on-brand)] opacity-10" />
        <figure className="relative flex max-w-lg flex-col gap-4">
          <blockquote className="text-heading-h3">“Acme cut our weekly reporting from a day to twenty minutes. The team actually looks forward to Mondays now.”</blockquote>
          <figcaption className="text-body-medium">Sofia Davis · Operations lead, North Farm Co.</figcaption>
        </figure>
      </aside>
    </div>
  );
}
