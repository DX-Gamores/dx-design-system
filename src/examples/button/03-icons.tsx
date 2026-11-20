/**
 * @title With icons
 * @description A leading icon adds meaning; a trailing icon hints at what happens next (a menu, a new page).
 */
"use client";
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button leadingIcon="plus">Invite member</Button>
      <Button variant="secondary" leadingIcon="download">Export</Button>
      <Button variant="secondary" trailingIcon="chevron-down">Sort by</Button>
      <Button variant="ghost" trailingIcon="arrow-right">Next step</Button>
    </div>
  );
}
