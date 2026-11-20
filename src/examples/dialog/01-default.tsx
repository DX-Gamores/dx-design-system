/**
 * @title Dialog
 * @description A focused task or decision that blocks the page. Focus moves in and returns to the button on close.
 */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form";
import { Dialog } from "@/components/ui/overlays";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite a member</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Invite a member" description="They'll get an email with a link to join." primaryLabel="Send invite" onPrimary={() => setOpen(false)}>
        <TextField label="Email" type="email" placeholder="name@company.com" />
      </Dialog>
    </>
  );
}
