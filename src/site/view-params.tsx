"use client";
import { useEffect } from "react";

/** Full-page previews accept ?brand=, ?theme= and ?density= (e.g. /view/dashboard-01/?brand=mangrove&theme=dark). */
export function ViewParams() {
  useEffect(() => {
    const q = new URLSearchParams(location.search), el = document.documentElement;
    for (const k of ["brand", "theme", "density"] as const) { const v = q.get(k); if (v && /^[a-z0-9-]+$/.test(v)) el.dataset[k] = v; }
  }, []);
  return null;
}
