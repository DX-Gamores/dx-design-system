"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/display";
import { Alert } from "@/components/ui/feedback";
import { Textarea } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";

export function RequestAccess() {
  const [sent, setSent] = useState(false);
  const status = useRef<HTMLDivElement>(null);
  return (
    <section aria-labelledby="na-title" className="flex flex-col gap-6 rounded-container border border-line-default bg-surface p-6 sm:p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-surface-subtle text-icon-primary"><Icon name="lock" /></span>
        <h1 id="na-title" className="text-heading-h2">You don't have access to Reports</h1>
        <p className="text-body-medium text-fg-secondary">Reports are limited to admins of the Acme Inc workspace. An admin can give you access.</p>
      </div>
      <div className="flex items-center gap-3 rounded-container bg-surface-subtle p-3">
        <Avatar name="Wade Warren" />
        <p className="flex flex-col text-body-small"><span className="text-label-medium">Wade Warren</span><span className="text-fg-secondary">Workspace admin · usually replies within a day</span></p>
      </div>
      <div ref={status} tabIndex={-1} className="outline-none">
        {sent ? (
          <Alert tone="success" title="Request sent" live>We'll email you when Wade answers. You can keep working in the meantime.</Alert>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); setSent(true); requestAnimationFrame(() => status.current?.focus()); }}>
            <Textarea label="Note to the admin (optional)" placeholder="Why do you need access?" maxLength={240} />
            <div className="flex flex-wrap gap-2"><Button type="submit" leadingIcon="send">Request access</Button><Button type="button" variant="secondary">Go to dashboard</Button></div>
          </form>
        )}
      </div>
    </section>
  );
}
