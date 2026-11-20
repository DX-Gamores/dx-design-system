/**
 * @title With a tooltip
 * @description Show the same label in a Tooltip so sighted users know what the icon does.
 */
"use client";
import { IconButton } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/overlays";

export default function Example() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip content="Edit member"><IconButton icon="edit" label="Edit member" variant="ghost" /></Tooltip>
      <Tooltip content="Download report"><IconButton icon="download" label="Download report" variant="ghost" /></Tooltip>
      <Tooltip content="Share"><IconButton icon="share" label="Share" variant="ghost" /></Tooltip>
    </div>
  );
}
