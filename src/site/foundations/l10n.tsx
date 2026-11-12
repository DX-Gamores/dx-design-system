"use client";
import { useEffect, useState } from "react";
import { Alert, Button, Checkbox, Icon, SegmentedControl, TextField, type IconName } from "@/components/ui";
import { mirroredIcons } from "@/components/ui/icon";
import { Verdict, VerdictGrid } from "./shared";

/* Mirrors the Figma Localization & RTL page, with real components and live Intl formatting. */

export function L10nGlance() {
  const tiles: [string, string][] = [["48", "screens stress-tested at +40% text"], ["754", "strings — 0 overflow after 2 fixes"], ["0", "fixed-size text boxes in templates"], ["92–99%", "of template frames use auto layout"]];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiles.map(([n, l]) => <div key={l} className="flex flex-col gap-1 rounded-container border border-line-default bg-surface p-4"><span className="text-heading-h2">{n}</span><span className="text-body-small text-fg-secondary">{l}</span></div>)}
    </div>
  );
}

const copy = {
  en: { label: "English · source", save: "Save changes", tab: "Members", field: "Email address", alert: "Your changes were saved.", consent: "Email me product updates" },
  de: { label: "German · +30–35%", save: "Änderungen speichern", tab: "Mitglieder", field: "E-Mail-Adresse", alert: "Ihre Änderungen wurden gespeichert.", consent: "Senden Sie mir Produktneuigkeiten per E-Mail" },
  pseudo: { label: "Pseudo-locale · +40%", save: "[Šåvé çĥåñĝéš ·····]", tab: "[Ṁéṁƀéŕš ···]", field: "[Éṁåîļ åððŕéšš ·····]", alert: "[Ýöûŕ çĥåñĝéš ŵéŕé šåvéð. ········]", consent: "[Éṁåîļ ṁé þŕöðûçţ ûþðåţéš ··········]" },
};
export function TextExpansion() {
  const [loc, setLoc] = useState<keyof typeof copy>("pseudo");
  const c = copy[loc];
  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl label="Language" value={loc} onChange={(v) => setLoc(v as keyof typeof copy)} options={[{ value: "en", label: "English" }, { value: "de", label: "German" }, { value: "pseudo", label: "Pseudo +40%" }]} />
      <div className="grid gap-4 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)] md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <span className="text-caption-default text-fg-secondary">{c.label} · Button and Tab grow</span>
          <div className="flex flex-wrap gap-2"><Button>{c.save}</Button><Button variant="secondary" leadingIcon="plus">{c.tab}</Button></div>
          <div className="max-w-[260px]"><Checkbox label={c.consent} /></div>
        </div>
        <div className="flex max-w-[320px] flex-col gap-3">
          <span className="text-caption-default text-fg-secondary">Field label and Alert wrap — nothing is clipped</span>
          <TextField label={c.field} placeholder="name@company.com" />
          <Alert tone="success" title={c.alert} />
        </div>
      </div>
    </div>
  );
}

export function RightToLeft() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {(["ltr", "rtl"] as const).map((d) => (
        <div key={d} className="flex flex-col gap-2">
          <span className="text-label-small tracking-wide text-fg-secondary uppercase">{d === "ltr" ? "LTR · English" : "RTL · العربية"}</span>
          <div dir={d} lang={d === "rtl" ? "ar" : "en"} className="flex flex-col gap-4 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)]">
            <TextField label={d === "rtl" ? "البريد الإلكتروني" : "Email"} defaultValue="name@company.com" dir="ltr" leadingIcon="mail" />
            <Alert tone="success" title={d === "rtl" ? "تم حفظ التغييرات" : "Changes saved"}>{d === "rtl" ? "يمكنك التراجع خلال ١٠ ثوانٍ." : "You can undo for 10 seconds."}</Alert>
            <div><Button trailingIcon="arrow-right">{d === "rtl" ? "التالي" : "Next"}</Button></div>
          </div>
        </div>
      ))}
      <p className="text-body-small text-fg-secondary md:col-span-2">Set <code className="text-code-small">dir="rtl"</code> on <code className="text-code-small">&lt;html&gt;</code> and use logical utilities (<code className="text-code-small">ms-* me-* ps-* pe-* start-* end-*</code>). The email field keeps <code className="text-code-small">dir="ltr"</code>: emails, numbers and codes stay left to right.</p>
    </div>
  );
}

export function IconMirroring() {
  const flip: [IconName, string][] = [["arrow-right", "Arrow right"], ["chevron-right", "Chevron right"], ["undo", "Undo"], ["send", "Send"], ["sign-out", "Sign out"]];
  const keep: [IconName, string][] = [["clock", "Clock"], ["check", "Check"], ["search", "Search"], ["phone", "Phone"], ["copy", "Copy"]];
  const Col = ({ title, list, ok }: { title: string; list: [IconName, string][]; ok: boolean }) => (
    <div className="flex flex-col gap-3 rounded-container border border-line-default bg-surface p-4">
      <span className="flex items-center gap-2 text-label-large"><Icon name={ok ? "check-circle" : "x-circle"} className={ok ? "text-icon-success" : "text-icon-secondary"} />{title}</span>
      <ul className="flex flex-col gap-2">
        {list.map(([n, l]) => (
          <li key={n} className="flex items-center gap-3 text-body-small">
            <Icon name={n} size={24} /><span dir="rtl" className="inline-flex"><Icon name={n} size={24} className="text-icon-brand" /></span><span>{l}</span>
            <code className="ml-auto text-code-small text-fg-secondary">{mirroredIcons.has(n) ? "auto-flips" : "never flips"}</code>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-4 md:grid-cols-2"><Col title="Mirror" list={flip} ok /><Col title="Don’t mirror" list={keep} ok={false} /></div>
      <p className="text-body-small text-fg-secondary">Each row shows the icon in LTR, then in RTL (blue). The <code className="text-code-small">Icon</code> component flips direction icons automatically inside <code className="text-code-small">dir="rtl"</code>.</p>
    </div>
  );
}

export function Formats() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const date = new Date(Date.UTC(2026, 10, 18, 12));
  const locales: [string, string][] = [["en-PH", "PHP"], ["en-US", "USD"], ["de-DE", "EUR"], ["fr-FR", "EUR"], ["ar-EG", "EGP"]];
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-container border border-line-default bg-surface">
        <table className="w-full text-body-small">
          <thead className="bg-surface-subtle text-left text-label-small"><tr><th className="px-3 py-2">Locale</th><th className="px-3 py-2">Date</th><th className="px-3 py-2">Number</th><th className="px-3 py-2">Currency</th></tr></thead>
          <tbody>
            {ready && locales.map(([l, cur]) => (
              <tr key={l} className="border-t border-line-default">
                <td className="px-3 py-2"><code className="text-code-small">{l}</code></td>
                <td className="px-3 py-2">{new Intl.DateTimeFormat(l, { dateStyle: "medium", timeZone: "UTC" }).format(date)}</td>
                <td className="px-3 py-2 tabular-nums">{new Intl.NumberFormat(l).format(1234567.89)}</td>
                <td className="px-3 py-2 tabular-nums">{new Intl.NumberFormat(l, { style: "currency", currency: cur }).format(1234.5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <pre className="overflow-x-auto rounded-container border border-line-default bg-surface-subtle p-4 text-code-small">{`new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date)
new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount)`}</pre>
      <p className="text-body-small text-fg-secondary">This table is formatted live by your browser with <code className="text-code-small">Intl.*</code> — never build dates, numbers or prices by hand.</p>
    </div>
  );
}

export function L10nDoDont() {
  return (
    <VerdictGrid>
      <Verdict ok note="Use full sentences with placeholders (ICU plurals)."><code className="text-code-small">{`t("items.count", { count: 3 })`}<br />→ 3 items · 3 Artikel · ٣ عناصر</code></Verdict>
      <Verdict ok={false} note="Don’t glue strings — word order and plurals change."><code className="text-code-small">{`"You have " + n + " item" + (n>1?"s":"")`}</code></Verdict>
      <Verdict ok note="Let components hug their text."><Button>Änderungen speichern</Button></Verdict>
      <Verdict ok={false} note="Don’t fix widths around English."><span className="w-[120px] overflow-hidden"><Button className="w-[120px] justify-start overflow-hidden">Änderungen speichern</Button></span></Verdict>
      <Verdict ok note="Name languages in their own language."><span className="text-body-medium">Language: Deutsch · Español · العربية</span></Verdict>
      <Verdict ok={false} note="Don’t use flags — flags are countries, not languages."><span className="text-heading-h3" aria-label="Flags of Germany, Spain and Saudi Arabia">🇩🇪 🇪🇸 🇸🇦</span></Verdict>
    </VerdictGrid>
  );
}

export function Checklist() {
  const items = [
    "Run the +40% pseudo-locale on the screen — nothing clips",
    "Text boxes hug or fill; none are fixed width",
    "Long labels wrap (checkbox, radio, alert) instead of truncating",
    "Strings come from the translation file, with ICU plurals",
    "Dates, numbers, currency via Intl.* — never by hand",
    "RTL: layout mirrors; direction icons flip; LTR content (emails, codes) stays LTR",
    "Line height leaves room for tall scripts (Thai, Arabic diacritics)",
  ];
  return (
    <ul className="flex flex-col gap-2 rounded-container border border-line-default bg-surface p-4">
      {items.map((i) => <li key={i} className="flex gap-2 text-body-medium"><Icon name="check-circle" className="mt-0.5 text-icon-success" />{i}</li>)}
    </ul>
  );
}
