/**
 * @title Card
 * @description Groups content about one subject, with an optional title and actions.
 */
"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/display";

export default function Example() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Flat card" actions={<><Button size="sm">Open</Button><Button size="sm" variant="secondary">Share</Button></>}>
        Supporting text about one subject.
      </Card>
      <Card title="Raised card" elevation="raised">Use on the canvas, or when it needs emphasis.</Card>
    </div>
  );
}
