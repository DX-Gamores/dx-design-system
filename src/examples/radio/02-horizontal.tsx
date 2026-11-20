/**
 * @title Horizontal with an error
 * @description Short labels can sit in a row; the error belongs to the whole group.
 */
"use client";
import { RadioGroup } from "@/components/ui/form";

export default function Example() {
  return (
    <RadioGroup
      label="Notify me"
      name="notify"
      orientation="horizontal"
      defaultValue="all"
      error="Choose how you want to be notified."
      options={[{ value: "all", label: "All activity" }, { value: "mentions", label: "Mentions only" }, { value: "none", label: "Nothing" }]}
    />
  );
}
