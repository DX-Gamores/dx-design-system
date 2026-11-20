/**
 * @title Form Actions
 * @description Save and Cancel at the end of a form. Sticky on long forms, with an unsaved-changes status.
 */
"use client";
import { useState } from "react";
import { TextField } from "@/components/ui/form";
import { FormActions } from "@/components/ui/patterns";

export default function Example() {
  const [dirty, setDirty] = useState(false);
  return (
    <form className="flex max-w-lg flex-col gap-4" onChange={() => setDirty(true)} onSubmit={(e) => { e.preventDefault(); setDirty(false); }}>
      <TextField label="Workspace name" defaultValue="Acme" />
      <FormActions status={dirty ? "You have unsaved changes" : undefined} onCancel={() => setDirty(false)} />
    </form>
  );
}
