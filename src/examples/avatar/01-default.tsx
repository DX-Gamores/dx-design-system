/**
 * @title Avatar
 * @description Initials of a person, in three sizes. Decorative when the name is shown next to it.
 */
"use client";
import { Avatar } from "@/components/ui/display";

export default function Example() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar name="Maria Santos" size="sm" />
        <Avatar name="Maria Santos" />
        <Avatar name="Maria Santos" size="lg" />
      </div>
      <div className="flex items-center gap-3">
        <Avatar name="Jun Cruz" decorative />
        <span className="text-label-medium">Jun Cruz</span>
      </div>
    </div>
  );
}
