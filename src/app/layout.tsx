import type { Metadata } from "next";
import "./fonts";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: "DX Design System · Starter", description: "Next.js starter wired to the DX Design System tokens." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-brand="default" data-theme="light" data-density="comfortable" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
