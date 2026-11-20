/**
 * @title Toggle
 * @description A switch for settings that apply immediately.
 */
"use client";
import { useState } from "react";
import { Toggle } from "@/components/ui/form";

export default function Example() {
  const [email, setEmail] = useState(true);
  const [digest, setDigest] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <Toggle label="Email notifications" checked={email} onChange={setEmail} />
      <Toggle label="Weekly digest" checked={digest} onChange={setDigest} />
      <Toggle label="Single sign-on (set by your admin)" checked onChange={() => {}} disabled />
    </div>
  );
}
