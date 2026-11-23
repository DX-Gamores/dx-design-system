"use client";
import { useEffect, useState } from "react";
import { Button, IconButton } from "@/components/ui/button";
import { RadioGroup, Toggle } from "@/components/ui/form";
import { SegmentedControl } from "@/components/ui/navigation";
import { Popover } from "@/components/ui/overlays";
import gallery from "../../dist/brands/gallery.json";

/* Brand, contrast, density and dark mode for the whole site. Same storage as the starter app and templates
   (localStorage "ds-theme"), so a choice made here follows you into every preview and screen. */

type Brand = string;
type Density = "comfortable" | "compact";
type Settings = { brand: Brand; dark: boolean; hc: boolean; density: Density };
const DEFAULTS: Settings = { brand: "default", dark: false, hc: false, density: "comfortable" };

const toTheme = (s: Settings) => `${s.dark ? "dark" : "light"}${s.hc ? "-hc" : ""}`;
function read(): Settings {
  try {
    const raw = JSON.parse(localStorage.getItem("ds-theme") || "{}");
    const theme: string = raw.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    return { brand: raw.brand ?? "default", density: raw.density ?? "comfortable", dark: theme.startsWith("dark"), hc: theme.endsWith("-hc") };
  } catch {
    return DEFAULTS;
  }
}

function useSettings() {
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setS(read());
    setReady(true);
    const sync = () => setS(read());
    window.addEventListener("storage", sync);
    window.addEventListener("ds-theme", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("ds-theme", sync);
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const el = document.documentElement;
    el.dataset.brand = s.brand;
    el.dataset.theme = toTheme(s);
    el.dataset.density = s.density;
    try {
      const prev = localStorage.getItem("ds-theme");
      const next = JSON.stringify({ brand: s.brand, theme: toTheme(s), density: s.density });
      if (prev !== next) {
        localStorage.setItem("ds-theme", next);
        window.dispatchEvent(new Event("ds-theme"));
      }
    } catch {}
  }, [s, ready]);
  return [s, (patch: Partial<Settings>) => setS((x) => ({ ...x, ...patch }))] as const;
}

export function DarkModeToggle() {
  const [s, set] = useSettings();
  return <IconButton icon={s.dark ? "sun" : "moon"} label={s.dark ? "Switch to light mode" : "Switch to dark mode"} variant="ghost" size="sm" onClick={() => set({ dark: !s.dark })} />;
}

export function Customize() {
  const [s, set] = useSettings();
  return (
    <Popover
      title="Customize"
      description="Re-skin the whole site. Every component and preview follows."
      width={300}
      trigger={(p) => <Button variant="ghost" size="sm" leadingIcon="settings" {...p}><span className="max-sm:sr-only">Customize</span></Button>}
    >
      <RadioGroup
        label="Brand"
        name="ds-brand"
        value={s.brand}
        onChange={(v) => set({ brand: v as Brand })}
        options={[
          { value: "default", label: "Default · Inter" },
          { value: "violet", label: "Violet · Manrope" },
          { value: "amber", label: "Amber · Poppins" },
          ...gallery.map((g) => ({ value: g.slug, label: `${g.name} · ${g.input.headingFont}` })),
        ]}
      />
      <div className="[&_[role=radio]]:min-w-fit"><SegmentedControl label="Density" size="sm" value={s.density} onChange={(v) => set({ density: v })} options={[{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }]} /></div>
      <Toggle label="High contrast" checked={s.hc} onChange={(hc) => set({ hc })} />
      <Toggle label="Dark mode" checked={s.dark} onChange={(dark) => set({ dark })} />
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => set(DEFAULTS)}>Reset</Button>
      </div>
    </Popover>
  );
}
