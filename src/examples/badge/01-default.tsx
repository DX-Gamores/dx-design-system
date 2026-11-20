/**
 * @title Badge
 * @description A short status or count. The word carries the meaning; the tone reinforces it.
 */
"use client";
import { Badge } from "@/components/ui/feedback";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Draft</Badge>
      <Badge tone="brand">New</Badge>
      <Badge tone="success">Active</Badge>
      <Badge tone="warning">Invited</Badge>
      <Badge tone="danger">Failed</Badge>
      <Badge tone="info">Beta</Badge>
    </div>
  );
}
