import type { Metadata } from "next";
import { ThemeSync } from "@/components/app-shell";

// Full-page block previews, shown in the frames on /blocks/ and opened on their own with "Open in a new tab".
export const metadata: Metadata = { title: { default: "Block", template: "%s · Blocks · DX Design System" }, robots: { index: false } };

export default function ViewLayout({ children }: { children: React.ReactNode }) {
  return <><ThemeSync />{children}</>;
}
