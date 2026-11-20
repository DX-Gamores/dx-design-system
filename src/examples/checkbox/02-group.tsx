/**
 * @title Group
 * @description Related checkboxes sit in a fieldset with a legend.
 */
"use client";
import { Checkbox } from "@/components/ui/form";

export default function Example() {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-label-medium">Notify me about</legend>
      <Checkbox label="Mentions" defaultChecked />
      <Checkbox label="Comments on my tasks" defaultChecked />
      <Checkbox label="Weekly summary" />
    </fieldset>
  );
}
