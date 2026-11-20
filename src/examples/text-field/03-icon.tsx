/**
 * @title With an icon and a trailing action
 * @description A leading icon hints at the content; a trailing IconButton adds an action such as show password.
 */
"use client";
import { useState } from "react";
import { IconButton } from "@/components/ui/button";
import { TextField } from "@/components/ui/form";

export default function Example() {
  const [show, setShow] = useState(false);
  return (
    <div className="grid max-w-2xl gap-4 md:grid-cols-2">
      <TextField label="Amount" leadingIcon="credit-card" placeholder="0.00" inputMode="decimal" />
      <TextField
        label="Password"
        type={show ? "text" : "password"}
        leadingIcon="lock"
        trailing={<IconButton icon={show ? "eye-off" : "eye"} label={show ? "Hide password" : "Show password"} variant="ghost" size="sm" onClick={() => setShow(!show)} />}
      />
    </div>
  );
}
