/**
 * @title Popover
 * @description Small, non-modal content next to its trigger: a quick edit or extra details. Esc closes it.
 */
"use client";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form";
import { Popover } from "@/components/ui/overlays";

export default function Example() {
  return (
    <div className="pb-56">
      <Popover
        title="Billing contact"
        description="Invoices and payment reminders go to this address."
        trigger={(p) => <Button variant="secondary" trailingIcon="chevron-down" {...p}>Billing contact</Button>}
      >
        <TextField label="Email" defaultValue="billing@dxform.ph" />
        <div className="flex justify-end gap-2"><Button size="sm">Save</Button></div>
      </Popover>
    </div>
  );
}
