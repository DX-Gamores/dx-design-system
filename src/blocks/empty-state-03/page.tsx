/**
 * @title All caught up
 * @description A good empty: the inbox is clear. Says so calmly, shows when it was last updated, and offers related places to go.
 * @route /inbox
 */
import { CheckCheck } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/nav-extra";
import { TopBar } from "../_parts/top-bar";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-canvas">
      <TopBar current="Overview" />
      <main id="main" className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 md:px-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-heading-h2">Inbox</h1>
          <p className="text-body-medium text-fg-secondary">Mentions, invites and approvals.</p>
        </div>
        <section className="flex flex-col items-center gap-4 rounded-container border border-line-default bg-surface px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-success-subtle text-icon-success"><Icon name={CheckCheck} size={24} /></span>
          <h2 className="text-heading-h3">You're all caught up</h2>
          <p className="max-w-sm text-body-medium text-fg-secondary">New mentions and approvals will show up here. Last checked a minute ago.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2"><Link href="#">View archived</Link><Link href="#">Notification settings</Link></div>
        </section>
      </main>
    </div>
  );
}
