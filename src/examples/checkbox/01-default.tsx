/**
 * @title Checkbox
 * @description Independent on/off choices that are saved with a form. The whole label is clickable.
 */
"use client";
import { Checkbox } from "@/components/ui/form";

export default function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox label="Email me product updates" defaultChecked />
      <Checkbox label="I agree to the Terms and Privacy Policy, including how DXFORM processes my data." />
      <Checkbox label="Disabled option" disabled />
    </div>
  );
}
