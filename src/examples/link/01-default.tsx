/**
 * @title Link
 * @description Navigates somewhere. Underlined in running text so it never relies on color alone.
 */
"use client";
import { Link } from "@/components/ui/nav-extra";

export default function Example() {
  return (
    <p className="max-w-prose text-body-medium">
      Review your plan in <Link href="#">billing history</Link> before the renewal on Dec 1.
    </p>
  );
}
