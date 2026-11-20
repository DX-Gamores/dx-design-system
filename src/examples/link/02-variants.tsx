/**
 * @title Sizes and external
 * @description Small links for dense UI; external links show an icon and open in a new tab.
 */
"use client";
import { Link } from "@/components/ui/nav-extra";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Link href="#">View billing history</Link>
      <Link href="#" size="sm">Small link</Link>
      <Link href="https://www.figma.com" external>Open in Figma</Link>
    </div>
  );
}
