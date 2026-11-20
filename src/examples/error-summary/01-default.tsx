/**
 * @title Error Summary
 * @description After a failed submit: lists every problem at the top and links each one to its field.
 */
"use client";
import { TextField } from "@/components/ui/form";
import { ErrorSummary } from "@/components/ui/patterns";

export default function Example() {
  return (
    <div className="flex max-w-lg flex-col gap-4">
      <ErrorSummary
        focusOnMount={false}
        errors={[
          { fieldId: "es-name", message: "Enter your full name" },
          { fieldId: "es-email", message: "Enter an email address, like name@company.com" },
        ]}
      />
      <TextField id="es-name" label="Full name" error="Enter your full name" />
      <TextField id="es-email" label="Work email" defaultValue="jane@" error="Enter an email address, like name@company.com" />
    </div>
  );
}
