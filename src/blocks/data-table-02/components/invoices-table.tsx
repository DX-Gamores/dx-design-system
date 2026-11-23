"use client";
import { useState } from "react";
import { Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { Menu, Popover } from "@/components/ui/overlays";

type Invoice = { id: string; customer: string; issued: string; due: string; method: string; status: "Paid" | "Pending" | "Overdue"; amount: number };
const invoices: Invoice[] = [
  { id: "INV-001", customer: "North Farm Co.", issued: "Oct 1", due: "Oct 15", method: "Bank transfer", status: "Paid", amount: 250 },
  { id: "INV-002", customer: "Harbor Labs", issued: "Oct 2", due: "Oct 16", method: "Card", status: "Pending", amount: 150 },
  { id: "INV-003", customer: "Juniper Studio", issued: "Oct 3", due: "Oct 17", method: "Card", status: "Overdue", amount: 350 },
  { id: "INV-004", customer: "Acme Labs", issued: "Oct 5", due: "Oct 19", method: "Bank transfer", status: "Paid", amount: 450 },
  { id: "INV-005", customer: "Riverbend Foods", issued: "Oct 8", due: "Oct 22", method: "Card", status: "Paid", amount: 550 },
  { id: "INV-006", customer: "Summit Health", issued: "Oct 9", due: "Oct 23", method: "Bank transfer", status: "Pending", amount: 200 },
  { id: "INV-007", customer: "Kite & Co.", issued: "Oct 12", due: "Oct 26", method: "Card", status: "Paid", amount: 300 },
];
const tone = { Paid: "success", Pending: "warning", Overdue: "danger" } as const;
const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const cols = [
  { key: "customer", label: "Customer" }, { key: "issued", label: "Issued" }, { key: "due", label: "Due" },
  { key: "method", label: "Method" }, { key: "status", label: "Status" },
] as const;
type ColKey = (typeof cols)[number]["key"];

export function InvoicesTable() {
  const [visible, setVisible] = useState<Set<ColKey>>(new Set(["customer", "due", "method", "status"]));
  const show = cols.filter((c) => visible.has(c.key));
  const th = "h-10 border-b border-line-default bg-surface-subtle px-4 text-label-small text-fg-secondary";
  const td = "h-12 border-b border-line-default px-4 text-body-small";
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Popover
          title="Columns"
          placement="bottom"
          width={220}
          trigger={({ ref, ...p }) => (
            <button ref={ref} type="button" {...p} className="inline-flex h-control-sm items-center gap-2 rounded-control border border-line-strong bg-surface px-3 text-label-medium hover:bg-neutral-hover focus-visible:focus-ring">
              <Icon name={Columns3} size={16} />Columns
            </button>
          )}
        >
          <fieldset className="flex flex-col gap-2">
            <legend className="sr-only">Show columns</legend>
            {cols.map((c) => (
              <label key={c.key} className="flex items-center gap-2 text-body-small">
                <input type="checkbox" checked={visible.has(c.key)} onChange={(e) => setVisible((v) => { const n = new Set(v); if (e.target.checked) n.add(c.key); else n.delete(c.key); return n; })} className="size-4 accent-[var(--ds-color-bg-brand)]" />
                {c.label}
              </label>
            ))}
          </fieldset>
        </Popover>
        <Button size="sm" variant="secondary" leadingIcon="download">Export CSV</Button>
      </div>
      <div className="relative overflow-x-auto rounded-container border border-line-default bg-surface" tabIndex={0} role="region" aria-label="Invoices table, scrolls sideways">
        <table className="w-full min-w-[640px] border-separate border-spacing-0">
          <caption className="sr-only">Invoices, October 2026</caption>
          <thead>
            <tr>
              <th scope="col" className={`${th} text-start`}>Invoice</th>
              {show.map((c) => <th key={c.key} scope="col" className={`${th} text-start`}>{c.label}</th>)}
              <th scope="col" className={`${th} text-end`}>Amount</th>
              <th scope="col" className={th}><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={inv.id} className="hover:bg-neutral-hover">
                <th scope="row" className={`${td} text-start font-mono text-code-small font-normal`}>{inv.id}</th>
                {show.map((c) => <td key={c.key} className={td}>{c.key === "status" ? <Badge tone={tone[inv.status]}>{inv.status}</Badge> : inv[c.key]}</td>)}
                <td className={`${td} text-end tabular-nums`}>{money(inv.amount)}</td>
                <td className={`${td} w-14`}>
                  <Menu label={`More actions for ${inv.id}`} placement={i < 3 ? "bottom-end" : "top-end"} items={[{ label: "View invoice", icon: "eye" }, { label: "Download PDF", icon: "download" }, { label: "Send reminder", icon: "send", disabled: inv.status === "Paid" }, { label: "Void invoice", icon: "x-circle", tone: "danger", separatorBefore: true }]} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={show.length + 1} className="h-12 px-4 text-start text-label-medium">Total</th>
              <td className="h-12 px-4 text-end text-label-medium tabular-nums">{money(invoices.reduce((s, i) => s + i.amount, 0))}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
