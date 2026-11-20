/**
 * @title AI Response
 * @description An answer from an AI feature: streams in, can be stopped, shows sources and confidence, and invites feedback.
 */
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AIResponse } from "@/components/ui/patterns";

const answer = "You have 12 vacation days left this year. Up to 5 unused days roll over to 2027; anything above that expires on Dec 31.";

export default function Example() {
  const [shown, setShown] = useState(answer.length);
  const [status, setStatus] = useState<"streaming" | "complete" | "stopped" | "error">("complete");
  useEffect(() => {
    if (status !== "streaming") return;
    if (shown >= answer.length) { setStatus("complete"); return; }
    const t = setTimeout(() => setShown((n) => n + 4), 40);
    return () => clearTimeout(t);
  }, [shown, status]);
  const regenerate = () => { setShown(0); setStatus("streaming"); };
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <AIResponse
        status={status}
        confidence="high"
        sources={[{ title: "Leave policy 2026", href: "#" }, { title: "HR portal", href: "#" }]}
        onStop={() => setStatus("stopped")}
        onCopy={() => navigator.clipboard?.writeText(answer)}
        onRegenerate={regenerate}
        onFeedback={() => {}}
      >
        {answer.slice(0, shown)}
      </AIResponse>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={regenerate}>Stream an answer</Button>
        <Button size="sm" variant="ghost" onClick={() => setStatus("error")}>Show the error state</Button>
      </div>
    </div>
  );
}
