/**
 * @title Drawer
 * @description A side sheet for filters, details or a secondary task, without leaving the page.
 */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox, RadioGroup } from "@/components/ui/form";
import { Drawer } from "@/components/ui/overlays";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" leadingIcon="filter" onClick={() => setOpen(true)}>Filters</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filters"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Clear</Button><Button onClick={() => setOpen(false)}>Show 12 results</Button></>}
      >
        <Checkbox label="Assigned to me" defaultChecked />
        <Checkbox label="Has attachments" />
        <RadioGroup label="Status" name="status" defaultValue="open" options={[{ value: "open", label: "Open" }, { value: "done", label: "Done" }, { value: "any", label: "Any" }]} />
      </Drawer>
    </>
  );
}
