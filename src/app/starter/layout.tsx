import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

// The starter app: copy src/app/starter (and src/components) into a new project to begin from a working shell.
export const metadata: Metadata = { title: "Starter app" };

export default function StarterLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
