/**
 * @title Radio
 * @description One choice from a short list, all visible. Arrow keys move the selection.
 */
"use client";
import { useState } from "react";
import { RadioGroup } from "@/components/ui/form";

export default function Example() {
  const [cycle, setCycle] = useState("m");
  return (
    <RadioGroup
      label="Billing cycle"
      name="cycle"
      value={cycle}
      onChange={setCycle}
      options={[
        { value: "m", label: "Monthly · ₱499 per member" },
        { value: "y", label: "Yearly · ₱4,990 per member (2 months free)" },
        { value: "c", label: "Custom contract", disabled: true },
      ]}
    />
  );
}
