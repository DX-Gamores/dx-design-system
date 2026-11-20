/**
 * @title Loading and disabled
 * @description Loading keeps the label and width and announces “busy”. Prefer explaining why an action is unavailable over disabling it.
 */
"use client";
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading>Saving…</Button>
      <Button disabled>Disabled</Button>
      <Button variant="secondary" disabled>Disabled</Button>
    </div>
  );
}
