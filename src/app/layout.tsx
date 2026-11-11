import type { Metadata } from "next";
import "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "DX Design System", template: "%s · DX Design System" },
  description: "DXFORM's design system: tokens, components and guidelines, mirrored from the Figma library.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-brand="default" data-theme="light" data-density="comfortable" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
