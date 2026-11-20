/**
 * @title Form Section
 * @description Groups related fields under a title and description. Side by side on desktop, stacked on phones.
 */
"use client";
import { TextField, Toggle } from "@/components/ui/form";
import { FormSection } from "@/components/ui/patterns";

export default function Example() {
  return (
    <div className="flex flex-col gap-8">
      <FormSection title="Profile" description="Visible to everyone in the workspace.">
        <TextField label="Full name" defaultValue="Jane Cooper" />
        <TextField label="Work email" type="email" defaultValue="jane@acme.com" />
      </FormSection>
      <FormSection title="Notifications" description="Choose what we email you about." layout="stacked">
        <Toggle label="Weekly summary" checked onChange={() => {}} />
      </FormSection>
    </div>
  );
}
