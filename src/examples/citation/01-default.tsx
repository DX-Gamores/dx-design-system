/**
 * @title Citation
 * @description A numbered link to a source an AI answer used.
 */
"use client";
import { Citation } from "@/components/ui/display";

export default function Example() {
  return (
    <p className="max-w-prose text-body-medium">
      Up to 5 unused days roll over to next year <Citation n={1} title="Leave policy 2026" href="#" /> and expire on Dec 31 <Citation n={2} title="HR portal" href="#" />.
    </p>
  );
}
