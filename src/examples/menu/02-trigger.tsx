/**
 * @title Custom trigger
 * @description Any button can open a menu, for example a “Sort by” button.
 */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/ui/overlays";

export default function Example() {
  const [sort, setSort] = useState("Name");
  return (
    <div className="pb-48">
      <Menu
        label="Sort by"
        placement="bottom-start"
        trigger={(p) => <Button variant="secondary" trailingIcon="chevron-down" {...p}>{`Sort by: ${sort}`}</Button>}
        items={["Name", "Last active", "Role"].map((s) => ({ label: s, onSelect: () => setSort(s) }))}
      />
    </div>
  );
}
