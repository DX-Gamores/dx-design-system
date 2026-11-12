"use client";
import type { ReactNode } from "react";
import { InComponentEmpties } from "@/templates/empty";
import { AccountProfileExample, DeleteConfirmationExample, NotificationPreferencesExample, ProjectGridExample, SignInExample } from "@/templates/examples";

export const InComponentEmptiesDemo = () => <InComponentEmpties />;

const Example = ({ title, name, children }: { title: string; name: string; children: ReactNode }) => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-heading-h4">{title}</h3><code className="text-code-small text-fg-secondary">{`<${name} />`}</code></div>
    <div className="flex justify-center rounded-container border border-line-default bg-canvas p-6">{children}</div>
  </div>
);
export function ExamplesGallery() {
  return (
    <div className="flex flex-col gap-8">
      <Example title="Sign in" name="SignInExample"><SignInExample /></Example>
      <Example title="Notification preferences" name="NotificationPreferencesExample"><NotificationPreferencesExample /></Example>
      <Example title="Project grid" name="ProjectGridExample"><ProjectGridExample /></Example>
      <Example title="Account profile" name="AccountProfileExample"><AccountProfileExample /></Example>
      <Example title="Delete confirmation" name="DeleteConfirmationExample"><DeleteConfirmationExample /></Example>
    </div>
  );
}
