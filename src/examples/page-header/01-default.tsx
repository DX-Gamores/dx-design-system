/**
 * @title Page Header
 * @description The page title, a one-line description and at most one primary action.
 */
"use client";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <PageHeader
      headingLevel={2}
      title="Team members"
      description="People who can access this workspace."
      actions={<><Button variant="secondary" leadingIcon="download">Export</Button><Button leadingIcon="plus">Invite people</Button></>}
    />
  );
}
