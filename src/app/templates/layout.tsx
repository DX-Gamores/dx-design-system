import type { Metadata } from "next";
import { ThemeSync } from "@/components/app-shell";

// Full-screen templates — the code version of the Figma Templates and Starter pages.
export const metadata: Metadata = { title: { default: "Templates", template: "%s · Templates · DX Design System" } };

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return <><ThemeSync />{children}</>;
}
