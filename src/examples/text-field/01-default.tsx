/**
 * @title Text Field
 * @description Always a visible label. Helper text explains the format before people make a mistake.
 */
"use client";
import { TextField } from "@/components/ui/form";

export default function Example() {
  return (
    <div className="max-w-sm">
      <TextField label="Email" type="email" placeholder="name@company.com" helperText="We'll never share it." />
    </div>
  );
}
