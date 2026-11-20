/**
 * @title Stepper
 * @description Progress through a multi-step task. Completed steps can be revisited.
 */
"use client";
import { useState } from "react";
import { Stepper } from "@/components/ui/navigation";

export default function Example() {
  const [at, setAt] = useState(1);
  return (
    <Stepper
      steps={[
        { label: "Account", description: "Email and password", status: "complete" },
        { label: "Company", description: "Fix 2 fields", status: at === 1 ? "error" : "complete" },
        { label: "Team", description: "Invite people", status: at === 2 ? "current" : "upcoming" },
        { label: "Billing", status: "upcoming" },
      ]}
      onStepClick={(i) => setAt(i)}
    />
  );
}
