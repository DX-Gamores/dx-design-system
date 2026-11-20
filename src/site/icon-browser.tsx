"use client";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { Chip, Icon, SearchField, SegmentedControl } from "@/components/ui";
import type { IconName } from "@/components/ui/icon";
import lucideNames from "./lucide-names.json";

/* Icon browser: search by DX or Lucide name, filter by Figma category, copy in four formats. */

const L = lucideNames as Record<string, string>;
export const iconCategories: Record<string, IconName[]> = {
  Actions: ["check", "close", "plus", "minus", "plus-circle", "edit", "trash", "copy", "save", "undo", "redo", "refresh", "upload", "download", "share", "print", "filter", "sort", "search", "drag-handle"],
  "Navigation & Arrows": ["chevron-down", "chevron-up", "chevron-left", "chevron-right", "arrow-left", "arrow-right", "arrow-up", "arrow-down", "menu", "more", "home", "dashboard", "grid-view", "list-view", "external-link", "link"],
  "Status & Feedback": ["info", "alert-circle", "alert-triangle", "check-circle", "x-circle", "help-circle"],
  "Favorites & Social": ["star", "heart", "bookmark"],
  "User & Security": ["user", "lock", "eye", "eye-off", "sign-in", "sign-out"],
  Communication: ["bell", "mail", "send", "phone"],
  "Files & Media": ["file", "folder", "image", "attachment"],
  "Date & Time": ["calendar", "clock"],
  "Data & System": ["chart", "settings", "globe", "sun", "moon"],
  "Commerce & Location": ["cart", "credit-card", "map-pin"],
};

type Format = "dx" | "jsx" | "rn" | "svg";
const formats: { value: Format; label: string; long: string }[] = [
  { value: "dx", label: "DX", long: "<Icon name>" },
  { value: "jsx", label: "React", long: "Lucide React" },
  { value: "rn", label: "Native", long: "Lucide React Native" },
  { value: "svg", label: "SVG", long: "SVG" },
];
function code(n: string, f: Format, svg: string) {
  if (f === "dx") return `<Icon name="${n}" />`;
  if (f === "jsx") return `import { ${L[n]} } from "lucide-react";\n\n<${L[n]} size={20} />`;
  if (f === "rn") return `import { ${L[n]} } from "lucide-react-native";\n\n<${L[n]} size={20} color={theme.colors.icon.primary} />`;
  return svg;
}

export function IconBrowser({ downloadHref }: { downloadHref?: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [format, setFormat] = useState<Format>("dx");
  const [copied, setCopied] = useState<string | null>(null);
  const all = useMemo(() => Object.entries(iconCategories).flatMap(([c, names]) => names.map((n) => ({ n, c }))), []);
  const t = q.trim().toLowerCase();
  const list = all.filter(({ n, c }) => (!cat || c === cat) && (!t || n.includes(t) || L[n].toLowerCase().includes(t)));
  const long = formats.find((f) => f.value === format)!.long;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-full max-w-sm flex-1"><SearchField label="Search icons" value={q} onChange={setQ} placeholder="e.g. arrow, user, chart" /></div>
        <div className="shrink-0 [&_[role=radio]]:min-w-fit"><SegmentedControl label="Copy as" value={format} onChange={setFormat} options={formats.map(({ value, label }) => ({ value, label }))} /></div>
      </div>
      <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
        <Chip selected={cat === null} onToggle={() => setCat(null)}>All</Chip>
        {Object.keys(iconCategories).map((c) => <Chip key={c} selected={cat === c} onToggle={(on) => setCat(on ? c : null)}>{c}</Chip>)}
      </div>
      <p className="text-caption-default text-fg-secondary" aria-live="polite">
        {copied ? `Copied ${copied} as ${long}` : `${list.length} icons · drawn by Lucide (ISC) · click one to copy it as ${long}`}
        {downloadHref && <> · <a className="text-fg-brand underline underline-offset-2 focus-visible:focus-ring" href={downloadHref} download>Download all as SVG</a></>}
      </p>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2">
        {list.map(({ n }) => (
          <li key={n}>
            <button
              type="button"
              title={`Lucide: ${L[n]}`}
              onClick={(e) => {
                const svg = (e.currentTarget.querySelector("svg")?.outerHTML ?? "").replace(/ class="[^"]*"/, "").replace(/ aria-hidden="true"| focusable="false"/g, "");
                navigator.clipboard?.writeText(code(n, format, svg)).catch(() => {});
                setCopied(n);
              }}
              className={cn("flex w-full flex-col items-center gap-2 rounded-md p-3 text-caption-default text-fg-secondary hover:bg-neutral-hover focus-visible:focus-ring", copied === n && "bg-selected text-fg-brand")}
            >
              <Icon name={n} size={24} className="text-icon-primary" />
              <span className="break-all">{n}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-body-small text-fg-secondary">
        Need one that isn&apos;t here? Use any of Lucide&apos;s 1,600+ icons: <code className="text-code-small">{'<Icon name={Rocket} />'}</code> with{" "}
        <code className="text-code-small">{'import { Rocket } from "lucide-react"'}</code>, or add it to <code className="text-code-small">icon-map.ts</code> to give it a DX name.
        Browse them at <a className="text-fg-brand underline underline-offset-2 focus-visible:focus-ring" href="https://lucide.dev/icons/">lucide.dev/icons</a>.
      </p>
    </div>
  );
}
